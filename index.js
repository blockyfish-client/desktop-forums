const { app, BrowserWindow, session } = require('electron')
const path = require('path')
const { shell } = require("electron")
const { ElectronBlocker } = require('@cliqz/adblocker-electron')
const fetch = require('cross-fetch') // required 'fetch'
const { Client } = require("discord-rpc");

ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
  blocker.enableBlockingInSession(session.defaultSession);
});

function matches(text, partial) {
    return text.toLowerCase().indexOf(partial.toLowerCase()) > -1;
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1080,
        height: 720,
        show: false,
        webPreferences: {
            nodeIntegration: true,
        },
        frame: false,
        icon: path.join(__dirname, 'img/icon.png'),
    })

    win.loadURL('https://beta.deeeep.io/login?return=%2Fforum%2Fen')
    win.removeMenu();
    setInterval(function() {
        if (win.webContents.getURL() == 'https://beta.deeeep.io/') {
            // win.loadURL('https://beta.deeeep.io/forum/en')
            win.webContents.goBack()
            win.webContents.goBack()
        }
    }, 250)
    win.webContents.on('did-finish-load', function() {
        win.webContents.openDevTools()
        win.webContents.setBackgroundThrottling(false)
        win.webContents.executeJavaScript(`
        setInterval(function() {
            if (document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div > div > div.nav-bar > div.forum-notifications-popover > div > span') != null) {
                console.log("notifs: " + document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div > div > div.nav-bar > div.forum-notifications-popover > div > span').innerText)
            }
            else {
                console.log("notifs: 0")
            }
        }, 5000)
        `)
        win.webContents.executeJavaScript(`
        document.querySelector('#app > div.ui').remove()
        modalCloseEvent = false
        setInterval(function() {
            var forum_modal = document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div')
            var modal_title = document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > span > div.justify-self-center')
            var modal_close = document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > button')
            var background = document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__overlay.vfm--overlay.vfm--absolute.vfm--inset')
            modal_close.style.webkitAppRegion = 'no-drag'
            if (modal_title.innerText == 'Forum') {
                forum_modal.style.maxHeight = '100vh'
                forum_modal.style.margin = '0px'
                forum_modal.style.padding = '5px'
                forum_modal.style.borderRadius = '0px'
                forum_modal.style.height = '100vh'
                forum_modal.style.width = '100vw'
            }
            else {
                forum_modal.style.maxHeight = ''
                forum_modal.style.margin = ''
                forum_modal.style.padding = ''
                forum_modal.style.borderRadius = ''
                forum_modal.style.height = ''
                forum_modal.style.width = ''
            }
            background.style.backgroundImage = 'url(https://beta.deeeep.io/img/dpbg6.png)'
            background.style.backgroundSize = 'cover'
            background.style.backgroundPosition = 'bottom'
            background.style.filter = 'brightness(0.8)'
            if (modalCloseEvent == false && modal_close != null) {
                modal_close.addEventListener("mouseup", () => {
                    if (modal_title.innerText == 'Forum') {
                        console.log('request_app_quit_now')
                    }
                })
                modalCloseEvent = true
            }
        }, 100)
        `)
        win.webContents.executeJavaScript(`
        const drag = document.createElement('div')
        document.body.insertBefore(drag, document.body.children[0])
        drag.outerHTML = '<div style="-webkit-app-region: drag;width: 100vw;height: 40px;position: absolute;top: 0;left: 0;cursor: move;"></div>'
        `)
        win.webContents.executeJavaScript(`
        function isInViewport(e) {
            const rect = e.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        }
        document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div').addEventListener("scroll", function() {
            if (isInViewport(document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div > div > div.footer > button'))) {
                document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div > div > div.footer > button').click()
            }
        })
        `)
        win.webContents.on("console-message", (ev, level, message, line, file) => {
            var msg = `${message}`
            console.log(msg);
            if (matches(msg, "notifs:")) {
                if (msg.length < 10) {
                    const msg_num = msg.charAt(msg.length - 1);
                    if (msg_num != 0) {
                        win.setOverlayIcon(path.join(__dirname, 'img/' + msg_num + '.png'), 'Over ' + msg_num + ' notifications')
                    }
                    else {
                        win.setOverlayIcon(null, '')
                    }
                }
                else {
                    win.setOverlayIcon(path.join(__dirname, 'img/9_plus.png'), 'Over 9 notifications')
                }
            }
            if (matches(msg, "request_app_quit_now")) {
                app.quit()
            }
        });

        win.show()
    });
}

app.whenReady().then(async () => {

    createWindow()

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})