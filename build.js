const archiver = require('archiver');
const Bundler = require('parcel-bundler');
const electronPackager = require('electron-packager');
const fs = require('fs');
const fsExtra = require('fs-extra');
const git = require('git-rev-sync');
const path = require('path');
const sass = require('sass');

const NODE_PLATFORM_MAPPING = {
  'linux': 'linux',
  'darwin': 'macos',
  'win32': 'windows'
};

const css = async () => {
  await Promise.all([
    fsExtra.remove(path.join(__dirname, 'static/styles.css')),
    fsExtra.remove(path.join(__dirname, 'static/styles.css.map'))
  ]);

  const result = sass.renderSync({
    file: path.join(__dirname, 'src/scss/main.scss'),
    outFile: path.join(__dirname, 'static/styles.css'),
    outputStyle: 'compressed',
    sourceMap: true
  });

  await fs.promises.writeFile(path.join(__dirname, 'static/styles.css'), result.css);
  await fs.promises.writeFile(path.join(__dirname, 'static/styles.css.map'), result.map);
};

const js = async () => {
  await Promise.all([
    fsExtra.remove(path.join(__dirname, 'static/scripts.js')),
    fsExtra.remove(path.join(__dirname, 'static/scripts.js.map'))
  ]);

  const options = {
    cache: false,
    minify: true,
    outFile: 'scripts.js',
    outDir: './static',
    scopeHoist: false,
    target: 'browser',
    watch: false
  };

  const bundler = new Bundler(path.join(__dirname, 'src/js/main.js'), options);
  const bundle = await bundler.bundle();

  // await fs.promises.writeFile(path.join(__dirname, 'static/styles.css'), result.css);
  // await fs.promises.writeFile(path.join(__dirname, 'static/styles.css.map'), result.map);
};

const library = async platform => {
  await fs.promises.copyFile(
    path.join(__dirname, `src/${platform}/library.json`),
    path.join(__dirname, 'library.json')
  );
};

const package = async platform => {
  const options = {
    arch: 'x64',
    dir: '.',
    name: 'elmyra',
    out: './release',
    overwrite: true,
    ignore: [
      '^/.babelrc$',
      '^/.gitignore$',
      '^/.stylintrc$',
      '^/renderer.log$',
      '^/server.log$',
      '^/LIB_SPECS.md$',
      '^/README.md$',
      '^/__pycache__',
      '^/imports/',
      '^/src',
      '^/tmp/',
      '^/uploads/',
      '^/visualizations/'
    ]
  };

  switch(platform) {
    case 'linux': {
      options.ignore.push('^/lib/(macos|windows)');
      options.platform = 'linux';
      break;
    }
    case 'macos': {
      options.icon = './icons/elmyra.icns';
      options.ignore.push('^/lib/(linux|windows)');
      options.platform = 'darwin';
      break;
    }
    case 'windows': {
      options.icon = './icons/elmyra.ico';
      options.ignore.push('^/lib/(macos|linux)');
      options.platform = 'win32';
      break;
    }
  }

  const packagePaths = await electronPackager(options);
  await fsExtra.ensureDir(path.join(__dirname, 'release'));

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(path.join(__dirname, `release/elmyra-${git.short()}-${platform}.zip`));
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', async () => {
      await fsExtra.remove(path.join(__dirname, packagePaths[0]));
      resolve();
    });

    archive.pipe(output);
    archive.directory(path.join(__dirname, packagePaths[0]), false);
    archive.finalize();
  });
};

const packageLibrary = async () => {
  await fsExtra.ensureDir(path.join(__dirname, 'release'));

  await new Promise((resolve, reject) => {
    const output = fs.createWriteStream(path.join(__dirname, `release/elmyra-lib.zip`));
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => resolve());

    archive.pipe(output);
    archive.directory(path.join(__dirname, 'lib'), false);
    archive.finalize();
  });
};

const build = async () => {
  switch(process.argv.length > 2 ? process.argv[2] : null) {
    case 'package-all':
      await css();
      await js();
      await library('linux');
      await package('linux');
      await library('macos');
      await package('macos');
      await library('windows');
      await package('windows');
      await library(NODE_PLATFORM_MAPPING[process.platform]);
    case 'package-lib':
      packageLibrary();
      break;
    case 'package-linux':
      await css();
      await js();
      await library('linux');
      await package('linux');
      await library(NODE_PLATFORM_MAPPING[process.platform]);
      break;
    case 'package-macos':
      await css();
      await js();
      await library('macos');
      await package('macos');
      await library(NODE_PLATFORM_MAPPING[process.platform]);
      break;
    case 'package-windows':
      await css();
      await js();
      await library('windows');
      await package('windows');
      await library(NODE_PLATFORM_MAPPING[process.platform]);
      break;
    case 'build-dev':
      await css();
      await js();
      await library(NODE_PLATFORM_MAPPING[process.platform]);
      break;
    default:
      console.log('No recognized argument provided.')
  }
};

build();
