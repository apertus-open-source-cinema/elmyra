const async = require('async'),
      bodyParser = require('body-parser'),
      childProcess = require('child_process'),
      express = require('express'),
      fs = require('fs'),
      moment = require('moment'),
      multer  = require('multer'),
      path = require('path')
      uuidV4 = require('uuid/v4')

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
  fs.readdir('visualizations', (err, vizDirs) => {
    function readVersions(id, callback) {
      fs.readdir(path.join('visualizations', id), (err, verDirs) => {
        function readMeta(version, callback) {
          var meta = {
            id: id,
            version: path.basename(version)
          }

          var metaPath = path.join('visualizations', id, version, 'meta.json')

          fs.readFile(metaPath, (err, data) => {
            if(!err) {
              Object.assign(meta, JSON.parse(data))
            }

            callback(null, meta)
          })
        }

        async.map(verDirs.sort().reverse(), readMeta, function(err, metaData) {
          callback(null, { versions: metaData })
        })
      })
    }

    async.map(vizDirs, readVersions, function(err, versions) {
      res.json({ visualizations: versions })
    })
  })
})

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
