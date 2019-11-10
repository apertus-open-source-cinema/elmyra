const archiver = require('archiver');
const Bundler = require('parcel-bundler');
const childProcess = require('child_process');
const fs = require('fs');
const fsExtra = require('fs-extra');
const git = require('git-rev-sync');
const path = require('path');
const sass = require('sass');

const ARCH = process.arch;
const PLATFORM = { 'linux': 'linux', 'darwin': 'macos', 'win32': 'windows' }[process.platform];

const PLATFORM_BUILD_DIR = path.join(__dirname, `build/elmyra-${PLATFORM}-${ARCH}`);

const assets = () => fsExtra.copy(
  path.join(__dirname, 'src/assets/'),
  path.join(PLATFORM_BUILD_DIR, 'static/')
);

const clean = async () => {
  await fsExtra.emptyDir(PLATFORM_BUILD_DIR);
  await fsExtra.ensureDir(path.join(PLATFORM_BUILD_DIR, 'static'));
};

const css = async () => {
  const stylesPath = path.join(PLATFORM_BUILD_DIR, 'static/styles.css');

  await fsExtra.remove(stylesPath);

  const result = sass.renderSync({
    file: path.join(__dirname, 'src/scss/main.scss'),
    outputStyle: 'compressed'
  });


  await fs.promises.writeFile(stylesPath, result.css);
};

const javascript = async () => {
  const scriptsPath = path.join(PLATFORM_BUILD_DIR, 'static/scripts.js');

  await fsExtra.remove(scriptsPath);

  const options = {
    outFile: 'scripts.js',
    outDir: path.join(PLATFORM_BUILD_DIR, 'static'),
    scopeHoist: false,
    sourceMaps: false,
    target: 'browser',
    watch: false
  };

  const bundler = new Bundler(path.join(__dirname, 'src/javascript/main.js'), options);
  const bundle = await bundler.bundle();
};

const library = () => Promise.all([
  fsExtra.copy(path.join(__dirname, `lib/${PLATFORM}`), path.join(PLATFORM_BUILD_DIR, `lib/${PLATFORM}`)),
  fsExtra.copy(path.join(__dirname, 'lib/elmyra'), path.join(PLATFORM_BUILD_DIR, 'lib/elmyra'))
]);

const python = () => fsExtra.copy(path.join(__dirname, 'src/python'), path.join(PLATFORM_BUILD_DIR, 'python'));

const rust = () => new Promise((resolve, reject) => {
  const cargoProcess = childProcess.spawn('cargo', ['build', '--release']);

  const output = [];
  cargoProcess.stdout.on('data', data => output.push(data.toString()));
  cargoProcess.stderr.on('data', data => output.push(data.toString()));

  cargoProcess.on('close', async code => {
    if(code === 0) {
      await fsExtra.copy(
        path.join(__dirname, 'target/release/elmyra'),
        path.join(PLATFORM_BUILD_DIR, 'elmyra')
      );

      resolve();
    } else {
      reject(`Rust compilation failed: ${output.join('\n')}`);
    }
  });
});

const package = async platform => {
  switch(platform) {
    case 'linux': {
      options.ignore.push('^/lib/(macos|windows)');
      break;
    }
    case 'macos': {
      options.ignore.push('^/lib/(linux|windows)');
      break;
    }
    case 'windows': {
      options.ignore.push('^/lib/(macos|linux)');
      break;
    }
  }

  await new Promise((resolve, reject) => {
    const zipPath = path.join(__dirname, `build/elmyra-${git.short()}-${PLATFORM}.zip`);
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', resolve);

    archive.pipe(output);
    archive.directory(PLATFORM_BUILD_DIR, false);
    archive.finalize();
  });
};

const packageLibrary = () => new Promise((resolve, reject) => {
  const output = fs.createWriteStream(path.join(__dirname, `build/elmyra-lib.zip`));
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', resolve);

  archive.pipe(output);
  archive.directory(path.join(__dirname, 'lib'), false);
  archive.finalize();
});

const build = async () => {
  const requested = process.argv.slice(2);

  if(requested.length === 0) {
    console.log('No build steps requested (all|clean|css|js|python|rust|package|package-lib) - you can provide multiple to mix and match them however needed.');
    return;
  }

  await fsExtra.ensureDir(path.join(__dirname, 'build'));

  if(requested.includes('package-lib')) {
    await packageLibrary();
  }

  if(requested.includes('package')) {
    await clean();
    await Promise.all([assets(), css(), javascript(), library(), python(), rust()]);
    await package();
  } else if(requested.includes('all')) {
    await clean();
    await Promise.all([assets(), css(), javascript(), library(), python(), rust()]);
  } else {
    if(requested.includes('clean')) { await clean(); }

    const pending = [];

    if(requested.includes('assets')) { pending.push(assets()); }
    if(requested.includes('css')) { pending.push(css()); }
    if(requested.includes('javascript')) { pending.push(javascript()); }
    if(requested.includes('library')) { pending.push(library()); }
    if(requested.includes('python')) { pending.push(python()); }
    if(requested.includes('rust')) { pending.push(rust()); }

    await Promise.all(pending);
  }
};

build();
