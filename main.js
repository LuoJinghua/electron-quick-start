// Modules to control application life and create native browser window
const {app, BrowserWindow, protocol} = require('electron')
const path = require('path')
const url = require('url')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const PORT = process.env.PORT || 5000

function startHttpServer() {
  const express = require("express")

  const app = express()
  app.use("/", express.static(path.join(__dirname, "public")))
  app.listen(PORT, function () {
    console.log(`Express server listening on port ${PORT}`)
  })
}

startHttpServer()

protocol.registerSchemesAsPrivileged([{
  scheme: 'demo',
  privileges: {
    bypassCSP: true,
    secure: true,
    standard: true,
    supportFetchAPI: true,
    allowServiceWorkers: true,
    corsEnabled: false
  }
}])

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    }
  })

  const session = mainWindow.webContents.session
  session.protocol.registerHttpProtocol('demo',
    (request, _callback) => {
      console.log(url)
      const parsed = new url.URL(request.url)
      const redirectedUrl = `http://localhost:${PORT}` + parsed.pathname
      _callback({
        url: redirectedUrl,
        session: session,
        method: request.method,
        uploadData: request.uploadData
      })
    }
  )

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
