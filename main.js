const {app, BrowserWindow} = require('electron'),
      childProcess = require('child_process'),
      fs = require('fs'),
      path = require('path'),
      server = require('./server.js'),
      winston = require('winston')

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
    icon: path.join(__dirname, 'icons', 'elmyra.png'),
    webPreferences: {
      nodeIntegration: false
    },
    width: 1280
  })

  win.setMenu(null)
  win.loadURL('http://localhost:5000')
  win.maximize()

  // win.webContents.openDevTools()

  win.on('closed', () => {
    win = null
  })
}

function startRenderer() {
  fs.readFile(path.join(__dirname, 'library.json'), (err, data) => {
    if(err) {
      console.log('Could not read library.json')
      process.exit(1)
    }

    library = JSON.parse(data)

    arguments = [
      '--background',
      '--python', path.join(__dirname, 'blender_renderer.py'),
      '--',
      '--device', 'GPU',
      '--target_time', '60'
    ]

    rendererProcess = childProcess.spawn(
      path.join(__dirname, library.blender),
      arguments
    )

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