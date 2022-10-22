const createWindowsInstaller = require('electron-winstaller').createWindowsInstaller
const path = require('path')
const version = '1.0.0'

getInstallerConfig()
  .then(createWindowsInstaller)
  .catch((error) => {
    console.error(error.message || error)
    process.exit(1)
  })

function getInstallerConfig () {
  console.log('creating windows installer')
  const rootPath = path.join('./')
  const outPath = path.join(rootPath, 'release-builds')

  return Promise.resolve({
    appDirectory: path.join(outPath, 'Deeeepio-Forums-win32-x64/'),
    authors: 'Pi',
    noMsi: true,
    outputDirectory: path.join(outPath, 'windows-installer'),
    exe: 'Deeeepio-Forums.exe',
    setupExe: 'Pi-deeeepioforums-setup-v' + version + '.exe',
    setupIcon: path.join(rootPath, 'img', 'icons', 'win', 'icon.ico'),
    iconUrl: "https://raw.githubusercontent.com/blockyfish-client/Desktop-Forums/master/img/icons/win/icon.ico",
    loadingGif: path.join(rootPath, 'img', 'loading.gif'),
  })
}