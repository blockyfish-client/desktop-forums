const { app, globalShortcut, session, Tray, Menu } = require('electron')

let isSingleInstance = app.requestSingleInstanceLock()
if (!isSingleInstance) {
    console.log('app exists!')
    app.quit()
}

const path = require('path')
const { shell } = require("electron")
const { ElectronBlocker } = require('@cliqz/adblocker-electron')
const fetch = require('cross-fetch')

const { PARAMS, VALUE,  MicaBrowserWindow } = require('mica-electron');
app.commandLine.appendSwitch("enable-transparent-visuals");

process.on("uncaughtException", () => {
    console.log('something really bad happened!')
})

ElectronBlocker.fromPrebuiltAdsAndTracking(fetch).then((blocker) => {
  blocker.enableBlockingInSession(session.defaultSession);
});

function matches(text, partial) {
    return text.toLowerCase().indexOf(partial.toLowerCase()) > -1;
}

const createWindow = () => {
    const win = new MicaBrowserWindow({
        width: 1080,
        height: 720,
        minWidth: 640,
        minHeight: 480,
        show: false,
        webPreferences: {
            nodeIntegration: true,
        },
        frame: false,
        icon: path.join(__dirname, 'img/icon.png'),

        effect: PARAMS.BACKGROUND.AUTO,
        theme: VALUE.THEME.AUTO,
        autoHideMenuBar: true,
    })

    app.on('second-instance', (event, argv, cwd) => {
        if (win) {
          if (win.isMinimized()) win.restore()
          win.focus()
      }
    })

    let isQuiting;
    let tray;
    
    app.on('before-quit', function () {
      isQuiting = true;
    });

    tray = new Tray(path.join(__dirname, 'img/icon16.png'));
    tray.setToolTip('Deeeep.io Forums')
    tray.setContextMenu(Menu.buildFromTemplate([
        {
            label: 'Deeeep.io Forums',
            icon: path.join(__dirname, 'img/icon16.png'),
            enabled: false
        },
        {
            type: 'separator'
        },
        {
            label: 'Quit', click: function () {
                isQuiting = true;
                app.quit();
            }
        }
    ]));
    tray.on('click', () => {
        win.show();
        win.focus();
    })  

    win.on('close', function (event) {
        if (!isQuiting) {
            event.preventDefault();
            win.hide();
            event.returnValue = false;
        }
    });

    win.loadURL('https://beta.deeeep.io/login?return=%2Fforum%2Fen')
    // win.loadFile(path.join(__dirname, 'index.html'))
    win.removeMenu();
    setInterval(function() {
        if (win.webContents.getURL() == 'https://beta.deeeep.io/') {
            // win.loadURL('https://beta.deeeep.io/forum/en')
            win.webContents.goBack()
            win.webContents.goBack()
        }
    }, 250)
    win.webContents.on('did-finish-load', function() {
        // win.webContents.openDevTools()

        globalShortcut.register('Shift+CommandOrControl+I', () => {
            win.webContents.toggleDevTools()
        })

        win.webContents.executeJavaScript(`
        const titlebar_html = document.createElement('div')
        document.body.appendChild(titlebar_html)
        titlebar_html.outerHTML = '<div id="window-controls"> <div class="button" id="min-button"> <img class="icon" srcset="https://blockyfish.netlify.app/assets/titlebar/min-w-10.png 1x, https://blockyfish.netlify.app/assets/titlebar/min-w-12.png 1.25x, https://blockyfish.netlify.app/assets/titlebar/min-w-15.png 1.5x, https://blockyfish.netlify.app/assets/titlebar/min-w-15.png 1.75x, https://blockyfish.netlify.app/assets/titlebar/min-w-20.png 2x, https://blockyfish.netlify.app/assets/titlebar/min-w-20.png 2.25x, https://blockyfish.netlify.app/assets/titlebar/min-w-24.png 2.5x, https://blockyfish.netlify.app/assets/titlebar/min-w-30.png 3x, https://blockyfish.netlify.app/assets/titlebar/min-w-30.png 3.5x" draggable="false"/> </div><div class="button" id="max-button"> <img class="icon" srcset="https://blockyfish.netlify.app/assets/titlebar/max-w-10.png 1x, https://blockyfish.netlify.app/assets/titlebar/max-w-12.png 1.25x, https://blockyfish.netlify.app/assets/titlebar/max-w-15.png 1.5x, https://blockyfish.netlify.app/assets/titlebar/max-w-15.png 1.75x, https://blockyfish.netlify.app/assets/titlebar/max-w-20.png 2x, https://blockyfish.netlify.app/assets/titlebar/max-w-20.png 2.25x, https://blockyfish.netlify.app/assets/titlebar/max-w-24.png 2.5x, https://blockyfish.netlify.app/assets/titlebar/max-w-30.png 3x, https://blockyfish.netlify.app/assets/titlebar/max-w-30.png 3.5x" draggable="false"/> </div><div class="button" id="restore-button" style="display: none;"> <img class="icon" srcset="https://blockyfish.netlify.app/assets/titlebar/restore-w-10.png 1x, https://blockyfish.netlify.app/assets/titlebar/restore-w-12.png 1.25x, https://blockyfish.netlify.app/assets/titlebar/restore-w-15.png 1.5x, https://blockyfish.netlify.app/assets/titlebar/restore-w-15.png 1.75x, https://blockyfish.netlify.app/assets/titlebar/restore-w-20.png 2x, https://blockyfish.netlify.app/assets/titlebar/restore-w-20.png 2.25x, https://blockyfish.netlify.app/assets/titlebar/restore-w-24.png 2.5x, https://blockyfish.netlify.app/assets/titlebar/restore-w-30.png 3x, https://blockyfish.netlify.app/assets/titlebar/restore-w-30.png 3.5x" draggable="false"/> </div><div class="button" id="close-button"> <img class="icon" srcset="https://blockyfish.netlify.app/assets/titlebar/close-w-10.png 1x, https://blockyfish.netlify.app/assets/titlebar/close-w-12.png 1.25x, https://blockyfish.netlify.app/assets/titlebar/close-w-15.png 1.5x, https://blockyfish.netlify.app/assets/titlebar/close-w-15.png 1.75x, https://blockyfish.netlify.app/assets/titlebar/close-w-20.png 2x, https://blockyfish.netlify.app/assets/titlebar/close-w-20.png 2.25x, https://blockyfish.netlify.app/assets/titlebar/close-w-24.png 2.5x, https://blockyfish.netlify.app/assets/titlebar/close-w-30.png 3x, https://blockyfish.netlify.app/assets/titlebar/close-w-30.png 3.5x" draggable="false"/> </div></div>'
    
        const titlebar_style = document.createElement('style')
        document.querySelector('head').appendChild(titlebar_style)
        titlebar_style.innerHTML = '@media (-webkit-device-pixel-ratio:1.5),(device-pixel-ratio:1.5),(-webkit-device-pixel-ratio:2),(device-pixel-ratio:2),(-webkit-device-pixel-ratio:3),(device-pixel-ratio:3){#window-controls .icon{width:10px;height:10px}}#window-controls{z-index:9999999999999999;color:#fff;display:grid;grid-template-columns:repeat(3,46px);position:absolute;top:0;right:5px;height:32px;-webkit-app-region:no-drag}#window-controls .button{grid-row:1/span 1;display:flex;justify-content:center;align-items:center;width:50px;height:100%;user-select:none}#min-button{grid-column:1}#max-button,#restore-button{grid-column:2}#close-button{grid-column:3}#window-controls .button:hover{background:rgba(127,127,127,.1)}#window-controls .button:active{background:rgba(127,127,127,.2)}#close-button:hover{background:#e81123!important}#close-button:active{background:#bb111f!important}'
    
        document.getElementById("max-button").addEventListener("click", () => {
            document.getElementById("max-button").style.display = "none"
            document.getElementById("restore-button").style.display = ""
            console.log('window_action: max')
        })
        document.getElementById("restore-button").addEventListener("click", () => {
            document.getElementById("max-button").style.display = ""
            document.getElementById("restore-button").style.display = "none"
            console.log('window_action: res')
        })
        document.getElementById("min-button").addEventListener("click", () => {
            console.log('window_action: min')
        })
        document.getElementById("close-button").addEventListener("click", () => {
            console.log('window_action: cls')
        })
        `)
        setInterval(() => {
            if (win.isMaximized()) {
                win.webContents.executeJavaScript(`
                document.getElementById("max-button").style.display = "none"
                document.getElementById("restore-button").style.display = ""
                `)
            }
            else {
                win.webContents.executeJavaScript(`
                document.getElementById("max-button").style.display = ""
                document.getElementById("restore-button").style.display = "none"
                `)
            }
        }, 300);

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
        const custom_css = document.createElement('style')
        document.body.appendChild(custom_css)
        custom_css.innerHTML = "textarea {background: #0003 !important;}"
        `)

        win.webContents.executeJavaScript(`
        function setTheme() {
            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.querySelector('html').classList.add('dark')
                document.querySelectorAll('.popover--light').forEach(popoverdark => {
                    popoverdark.classList.remove('popover--light')
                    popoverdark.classList.add('popover--dark')
                });
                document.querySelectorAll('button.white').forEach(graybutton => {
                    graybutton.classList.remove('white')
                    graybutton.classList.add('gray')
                });
                document.querySelectorAll('button.was-el-button--text.white').forEach(whitetextbutton => {
                    whitetextbutton.classList.remove('was-el-button--text')
                    whitetextbutton.classList.add('el-button--text')
                }); 
                document.getElementById("max-button").style.filter = 'invert(0)'
                document.getElementById("min-button").style.filter = 'invert(0)'
                document.getElementById("restore-button").style.filter = 'invert(0)' 
                document.getElementById("close-button").style.filter = 'invert(0) hue-rotate(0deg)'            
            }
            else {
                document.querySelector('html').classList.remove('dark')
                document.querySelectorAll('.popover--dark').forEach(popoverdark => {
                    popoverdark.classList.remove('popover--dark')
                    popoverdark.classList.add('popover--light')
                });
                document.querySelectorAll('button.gray').forEach(graybutton => {
                    graybutton.classList.remove('gray')
                    graybutton.classList.add('white')
                });
                document.querySelectorAll('button.el-button--text.white').forEach(whitetextbutton => {
                    whitetextbutton.classList.remove('el-button--text')
                    whitetextbutton.classList.add('was-el-button--text')
                });
                document.getElementById("max-button").style.filter = 'invert(1)'
                document.getElementById("min-button").style.filter = 'invert(1)'
                document.getElementById("restore-button").style.filter = 'invert(1)' 
                document.getElementById("close-button").style.filter = 'invert(1) hue-rotate(180deg) brightness(0.5) saturate(5)'  
            }
        }
        setTimeout(() => {
            setTheme()
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
                setTheme()
            });
        }, 500);
        setInterval(() => {
            setTheme()
        }, 200)

        document.querySelector('#app > div.ui').remove()
        
        setInterval(function() {
            var forum_modal = document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div')
            var modal_title = document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > span > div.justify-self-center')
            var modal_titlebar = document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > span')
            var back_button = document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > span > button:nth-child(1)')
            var background = document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__overlay.vfm--overlay.vfm--absolute.vfm--inset')
            var modal_close = document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > button')
            
            var forum_page = document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div')
            var forum_post_page = document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div > div')
            
            var profile_background = document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div > div.content')
            var profile_play_bg = document.querySelectorAll('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div > div.content > div.inner > div > div')

            var notif_container = document.querySelector('#el-popper-container-1869 > div.el-popper.is-light.el-popover.popover--no-padding.popover--dark')
            var notif_body = document.querySelector('#el-popper-container-1869 > div.el-popper.is-light.el-popover.popover--no-padding.popover--dark > div')

            var nav_bar = document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div > div > div.nav-bar')

            modal_titlebar.style.height = '33.82px'
            if (back_button) {
                back_button.style.webkitAppRegion = 'none'
            }

            // mica effect
            document.body.style.background = 'none'
            forum_modal.style.background = 'none'
            forum_page.style.background = 'none'
            forum_post_page.style.background = 'none'
            if (profile_background) {
                profile_background.style.background = 'none'
            }
            if (profile_play_bg) {
                profile_play_bg.forEach(bg => {
                    bg.style.background = 'none'
                })
            }
            if (notif_container) {
                notif_container.style.background = '#888d'
                notif_container.style.backdropFilter = 'blur(5px)'
                notif_body.style.background = 'none'
            }
            
            // sticky navbar
            if (nav_bar) {
                Object.assign(nav_bar.style, 
                    {
                        position: 'sticky',
                        top: '0',
                        zIndex: '999999'
                    }
                )
            };
            Object.assign(forum_post_page.style,
                {
                    background: 'none',
                    top: '0',
                    height: 'max-content',
                    minHeight: 'max-content'
                }
            );
            
            if (modal_close) {
                modal_close.remove()
            }
            
            if (modal_title.innerText != 'Login') {
                background.style.background = 'none'
                forum_modal.style.maxHeight = '100vh'
                forum_modal.style.margin = '0px'
                forum_modal.style.padding = '5px'
                forum_modal.style.borderRadius = '0px'
                forum_modal.style.height = '100vh'
                forum_modal.style.width = '100vw'
                
            }
            else {
                background.style.backgroundImage = 'url(https://beta.deeeep.io/img/dpbg6.png)'
                background.style.backgroundSize = 'cover'
                background.style.backgroundPosition = 'bottom'
                background.style.filter = 'brightness(0.8)'
            }
        }, 100)
        `)
        win.webContents.executeJavaScript(`
        const drag = document.createElement('div')
        document.body.insertBefore(drag, document.body.children[0])
        drag.outerHTML = '<div style="-webkit-app-region: drag;width: 100vw;height: 32px;position: absolute;top: 0;left: 0;cursor: move;"></div>'
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
        setTimeout(() => {
            setInterval(() => {
                if (document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div > div > div.footer > button')) {
                    if (isInViewport(document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div > div > div.footer > button'))) {
                        document.querySelector('#app > div.vfm.vfm--inset.vfm--fixed.modal > div.vfm__container.vfm--absolute.vfm--inset.vfm--outline-none.modal-container > div > div > div > div > div.footer > button').click()
                    }
                }
            }, 500)
        }, 1000)
        `)
        win.webContents.on("console-message", (ev, level, message, line, file) => {
            var msg = `${message}`
            console.log(msg);

            if (matches(msg, "window_action:")) {
                msg = msg.replace("window_action: ", "")
                if (msg == "max") win.maximize()
                else if (msg == "res") win.unmaximize()
                else if (msg == "min") win.minimize()
                else if (msg == "cls") win.close()
            }

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

        win.webContents.on('new-window', function(e, url) {
            e.preventDefault();
            require('electron').shell.openExternal(url);
        });
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