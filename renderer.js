// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const md5 = require('./md5')

function handleDownload(buttonId, textId, fileName) {
  const button = document.getElementById(buttonId)
  button.onclick = async function onDownloadClicked() {
    const response = await fetch('demo://demo/' + fileName)
    const t = await response.text()
    const checksum = md5(t)
    const element = document.getElementById(textId)
    if (element) {
      element.innerText = 'calculated md5: ' + checksum
    }
  }
  button.click()
}
handleDownload('download-button', 'checksum', 'web.js')
handleDownload('download-button2', 'checksum2', 'hello.js')
