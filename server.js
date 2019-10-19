const bodyParser = require('body-parser');
const childProcess = require('child_process');
const express = require('express');
const fs = require('fs');
const moment = require('moment');
const multer = require('multer');
const path = require('path');
const uuidV4 = require('uuid/v4');

const camelCaseToDashCase = key => key.replace(/[A-Z]/g, capital => '-' + capital.toLowerCase());

// Set working directory to elmyra's root directory
process.chdir(__dirname)

var library
var app = express()

var storage = multer.diskStorage({
  destination: path.join(__dirname, 'uploads'),
  filename: function (req, file, cb) {
    cb(null, uuidV4() + path.extname(file.originalname))
  }
})

var upload = multer({ storage: storage })

app.use('/static', express.static('static'))

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'static', 'index.html'))
})

app.post('/api/generate', bodyParser.json(), function(req, res) {
  arguments = [
    '--background',
    '--python', 'blender_generate.py',
    '--'
  ]

  for(const key in req.body) {
    arguments.push(`--${camelCaseToDashCase(key)}`, req.body[key])
  }

  var process = childProcess.spawn(library.blender, arguments)

  process.on('close', function() {
    res.sendStatus(200)
  })
})

app.post('/api/import', upload.single('file'), function(req, res) {
  var id = uuidV4()
  var url = req.body.url ? req.body.url : req.file.path

  var arguments = [
    '--background',
    '--python', 'blender_import.py',
    '--',
    '--url', url,
    '--id', id
  ]

  var process = childProcess.spawn(library.blender, arguments)

  process.on('close', () => {
    fs.access(path.join('imports', id), fs.F_OK, (err) => {
        if(!err) {
          res.json({ importId: id })
        } else {
          res.sendStatus(404)
        }
    })
  })
})

app.get('/api/preview/:id', (req, res) => {
  importPreviewObj = path.join(__dirname, 'imports', req.params.id, 'preview.obj')

  res.sendFile(importPreviewObj)
})

app.post('/api/upload/:id', upload.single('blendfile'), (req, res) => {
  var arguments = [
    '--background',
    '--python', 'blender_update.py',
    '--'
  ]

  arguments.push('--id', req.params.id)
  arguments.push('--blend', req.file.path)

  var process = childProcess.spawn(library.blender, arguments)

  process.on('close', () => {
    res.sendStatus(200)
  })
})

app.get('/api/visualizations', (req, res) => {
  fs.readdir('visualizations', async (err, vizDirs) => {
    const readVersions = id => new Promise(resolve => {
      fs.readdir(path.join('visualizations', id), async (err, verDirs) => {
        const readMeta = version => new Promise(resolve => {
          const meta = {
            id: id,
            version: path.basename(version)
          };

          const metaPath = path.join('visualizations', id, version, 'meta.json');

          fs.readFile(metaPath, (err, data) => {
            if(!err) {
              Object.assign(meta, JSON.parse(data));
            }

            resolve(meta);
          });
        });

        const metaData = await Promise.all(verDirs.sort().reverse().map(readMeta));

        resolve({ versions: metaData });
      });
    });

    const versions = await Promise.all(vizDirs.map(readVersions));

    res.json({ visualizations: versions });
  });
});

function serveMedia(res, id, unresolvedVersion, format) {
  var vizPath = path.join(__dirname, 'visualizations', id)

  function serveVersion(version) {
    function sendMedia(filename, downloadFilename) {
      var filePath = path.join(vizPath, version, filename)

      fs.access(filePath, fs.F_OK, (err) => {
          if(err) {
            res.sendStatus(404)
          } else {
            if(downloadFilename === undefined) {
              res.sendFile(filePath)
            } else {
              res.download(filePath, downloadFilename)
            }
          }
      })
    }

    if(format === undefined) {
      var metaPath = path.join(vizPath, version, 'meta.json')

      fs.readFile(metaPath, (err, data) => {
        var meta = JSON.parse(data)

        if(meta.mediaType === 'still') {
          sendMedia('exported.png')
        } else if(meta.mediaType === 'animation') {
          sendMedia('exported.mp4')
        } else if(meta.mediaType === 'web3d') {
          sendMedia('exported.html')
        }
      })
    } else if(format === 'thumbnail') {
      sendMedia('thumbnail.png')
    } else if(format === 'blend') {
      sendMedia('scene.blend', `${id}.blend`)
    } else {
      sendMedia(`exported.${format}`, `${id}.${format}`)
    }
  }

  if(unresolvedVersion === 'latest') {
    fs.readdir(vizPath, (err, verDirs) => {
      serveVersion(verDirs.sort()[verDirs.length - 1])
    })
  } else {
    serveVersion(unresolvedVersion)
  }
}

app.get('/:id/:version', (req, res) => {
  serveMedia(res, req.params.id, req.params.version)
})

app.get('/:id/:version/:format', (req, res) => {
  serveMedia(res, req.params.id, req.params.version, req.params.format)
})

function run(callback) {
  fs.readFile('library.json', (err, data) => {
    if(err) {
      console.log('Could not read library.json')
      process.exit(1)
    } else {
      library = JSON.parse(data)
      app.listen(5000, callback)
    }
  })
}

function stop() {
  app.close()
}

if(require.main === module) {
  run()
}

module.exports = {
  run: run,
  stop: stop
}
