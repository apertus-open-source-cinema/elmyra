const {app, BrowserWindow} = require('electron'),
      childProcess = require('child_process'),
      fs = require('fs'),
      path = require('path'),
      server = require('./server.js'),
      winston = require('winston')

// Set working directory to elmyra's root directory
process.chdir(__dirname)

var rendererProcess

let win

var rendererLog = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({ filename: 'renderer.log' })
  ]
})

var serverLog = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    new (winston.transports.File)({ filename: 'server.log' })
  ]
})

function createWindow() {
  win = new BrowserWindow({
    height: 720,
    webPreferences: {
      nodeIntegration: false
    },
    width: 1280
  })

  if(process.platform !== 'darwin') {
    win.setIcon(path.join('icons', 'elmyra.png'))
  }

  win.setMenu(null)
  win.loadURL('http://localhost:5000')

  // win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

function startRenderer() {
  fs.readFile('library.json', (err, data) => {
    if(err) {
      console.log('Could not read library.json')
      process.exit(1)
    }

    library = JSON.parse(data)

    arguments = [
      '--background',
      '--python', 'blender_renderer.py',
      '--',
      '--device', 'GPU',
      '--target_time', '60'
    ]

    rendererProcess = childProcess.spawn(library.blender, arguments)

    rendererProcess.stdout.on('data', (data) => {
      rendererLog.info(data.toString())
    })

    rendererProcess.stderr.on('data', (data) => {
      rendererLog.error(data.toString())
    })
  })
}

app.on('ready', () => {
  startRenderer()
  server.run(createWindow)
})

app.on('window-all-closed', () => {
  app.quit()
})

app.on('will-quit', () => {
  rendererProcess.kill()
  rendererProcess = null

  server.stop()
})
