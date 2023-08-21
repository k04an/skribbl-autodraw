const puppeteer = require('puppeteer')
const eventEmitter = require('events')
const logger = require('./logger')
const { log } = require('console')
const browserEmitter = new eventEmitter() 

const moduleName = 'Browser'

module.exports = browserEmitter

// Обертка для async/await
const main = async () => {
    logger.log('Launching browser...', moduleName)
    const browser = await puppeteer.launch({ headless: false, args: ['--start-maximized'], defaultViewport: null })

    // При закрытии браузера убиваем весь процесс
    browser.on('disconnected', () => {
        logger.log('Browser has been closed!', moduleName, 'warning')
        browserEmitter.emit('browserClose')
    })

    logger.log('Setting up page...', moduleName)
    let page
    try {
        page = await browser.newPage()

        // Проверяем указанна ли ссылка для приватной комнаты
        const privateUrl = process.argv
        privateUrl.splice(0, 2)

        await page.goto(privateUrl[0] ? privateUrl[0] : 'https://skribbl.io/')
    } catch (e) {
        logger.log('Failed to load page', moduleName, 'error')
        process.exit()
    }

    logger.log('Injecting code to game page...', moduleName)
    // Инджектим на страницу кастомное окно и сопутствующую логику 
    await page.evaluate(injectWindow)
    await page.evaluate(injectLogic)

    logger.log('Game page is ready!', moduleName)

    browser.on('disconnected', () => {
        logger.log('Browser has been closed!', moduleName, 'warning')
        browserEmitter.emit('browserClose')
    })

    // При получении команды на отрисовку...
    browserEmitter.on('startDraw', async (array) => {
        logger.log('Start drawing...', moduleName)
        let xOffset = 0, yOffset = 0

        array.forEach(row => {
            row.forEach(pixel => {
                let palletRow
                if (pixel.row === 't') palletRow = '.top'
                else palletRow = '.bottom'

                page.evaluate((obj) => {
                    let colorEvent = new PointerEvent('pointerdown')
                    let drawEvent = new PointerEvent('pointerdown', {
                        clientX: 540 + obj.x,
                        clientY: 200 + obj.y,
                        pointerType: 'mouse',
                        button: 0,
                        buttons: 1
                    })
                    console.log('drawing at', 400 + obj.x, 300 + obj.y)

                    document.querySelector(`.colors > ${obj.row} > div:nth-child(${obj.num})`).dispatchEvent(colorEvent)
                    document.querySelector('#game-canvas > canvas').dispatchEvent(drawEvent)
                    document.dispatchEvent(new PointerEvent('pointerup', {
                        pointerType: 'mouse'
                    }))
                }, {row: palletRow, num: pixel.num, x: xOffset, y: yOffset})

                xOffset += 5
            })
            xOffset = 0
            yOffset += 5
        })
        logger.log('Drawing complete', moduleName)
    })
}
main()
// #game-canvas > canvas - Сам холст
// .colors > .top > div:nth-child() - Выбор цвета
const injectWindow = () => {
    let injectElem = document.createElement('div')
            injectElem.innerHTML = `<div class="inject-window" style="z-index: 1000; top: 0; left: 0; position: absolute; width: 300px; border-radius: 5px; border: 1px solid black; box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2); font-family: 'Courier New', monospace;"> <div class="winhead" style="background-color: #EA1179; padding: 5px; display: flex;"> <span>niggaso v0.1</span> <div style="margin-left: auto;"> <svg id="min-win" style="cursor: pointer" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-dash" viewBox="0 0 16 16"> <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8z"/> </svg> </div></div><div class="winbody" style="height: 350px; background-color: white; padding: 5px;"> <div class="imgUpload" style="display: flex; padding: 25px 10px; flex-direction: column; align-items: center;"> <div style="opacity: 0.5;"> <svg xmlns="http://www.w3.org/2000/svg" width="72" height="72" fill="#EA1179" class="bi bi-file-earmark-image" viewBox="0 0 16 16"> <path d="M6.502 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z"/> <path d="M14 14a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h5.5L14 4.5V14zM4 1a1 1 0 0 0-1 1v10l2.224-2.224a.5.5 0 0 1 .61-.075L8 11l2.157-3.02a.5.5 0 0 1 .76-.063L13 10V4.5h-2A1.5 1.5 0 0 1 9.5 3V1H4z"/> </svg> </div><p style="color: #EA1179">Find an image you want to draw. Right click on it and choose copy an image. Then press ctrl + v on this page to pass it to this script.</p><div id="nofileerr" style="background-color: #C70039; width: 100%; padding: 10px 7px; color: white; display: none;"> <span>No files passed</span> </div><div id="noimgerr" style="background-color: #C70039; width: 100%; padding: 10px 7px; color: white; display: none;"> <span>No image data detected</span> </div><div id="filesucc" style="background-color: #54B435; width: 100%; padding: 10px 7px; color: white; display: none;"> <span>Image detected!</span> <button>Start drawing</button> </div></div></div></div>`
            document.body.append(injectElem)

            let injectMinElem = document.createElement('div')
            injectMinElem.innerHTML = `<div class="min-window" style="display: none; align-items: center; position: fixed; right: 10px; bottom: 0; width: 300px; padding: 5px; background-color: #EA1179; z-index: 1000; box-shadow: 4px 4px 8px 0px rgba(34, 60, 80, 0.2); font-family: 'Courier New', monospace; border-radius: 5px; border: 1px solid black;"> <span>niggaso v.0.1</span> <svg id="max-win" style="margin-left: auto; cursor: pointer" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-fullscreen" viewBox="0 0 16 16"> <path d="M1.5 1a.5.5 0 0 0-.5.5v4a.5.5 0 0 1-1 0v-4A1.5 1.5 0 0 1 1.5 0h4a.5.5 0 0 1 0 1h-4zM10 .5a.5.5 0 0 1 .5-.5h4A1.5 1.5 0 0 1 16 1.5v4a.5.5 0 0 1-1 0v-4a.5.5 0 0 0-.5-.5h-4a.5.5 0 0 1-.5-.5zM.5 10a.5.5 0 0 1 .5.5v4a.5.5 0 0 0 .5.5h4a.5.5 0 0 1 0 1h-4A1.5 1.5 0 0 1 0 14.5v-4a.5.5 0 0 1 .5-.5zm15 0a.5.5 0 0 1 .5.5v4a1.5 1.5 0 0 1-1.5 1.5h-4a.5.5 0 0 1 0-1h4a.5.5 0 0 0 .5-.5v-4a.5.5 0 0 1 .5-.5z"/> </svg> </div>`
            document.body.append(injectMinElem)

            let winHeader = document.querySelector('.winhead'),
                win = document.querySelector('.inject-window'),
                minWin = document.querySelector('.min-window')
                minBtn = document.querySelector('#min-win')
                maxBtn = document.querySelector('#max-win')
            
            minBtn.addEventListener('click', () => {
                win.style.display = 'none'
                minWin.style.display = 'flex'
            })

            maxBtn.addEventListener('click', () => {
                win.style.display = 'block'
                minWin.style.display = 'none'
            })

            let originPos = {}
            winHeader.addEventListener('mousedown', (e) => {
                e.preventDefault()
                originPos.left = win.offsetLeft - e.clientX 
                originPos.top = win.offsetTop - e.clientY
                document.addEventListener('mousemove', drag)
            })
            document.addEventListener('mouseup', (e) => {
                e.preventDefault()
                document.removeEventListener('mousemove', drag)
            })

            const drag = (event) => {
                event.preventDefault()
                win.style.left = event.clientX + originPos.left + 'px'
                win.style.top = event.clientY + originPos.top + 'px'
            }
}

const injectLogic = async () => {
    const socket = io('http://localhost:1111')
    let file

    document.querySelector('#filesucc > button').addEventListener('click', (e) => {
        let reader = new FileReader();
        reader.readAsDataURL(file)
        reader.onload = () => {
            socket.emit('imageCommand', reader.result)
        }
    })

    document.addEventListener('paste', (event) => {
        file = event.clipboardData.files[0]

        if (file === undefined) {
            showStatusMsg('nofile')
            return
        }

        switch (file.type) {
            case 'image/jpeg':
            case 'image/png':
                showStatusMsg()
                break
            
            default:
                showStatusMsg('noimg')
                return
                break
        }
    })

    let showStatusMsg = (status) => {
        let nofileMsg = document.querySelector('#nofileerr'),
            noimgMsg = document.querySelector('#noimgerr'),
            succMsg = document.querySelector('#filesucc')

        let clearMsg = () => {
            nofileMsg.style.display = 'none'
            noimgMsg.style.display = 'none'
            succMsg.style.display = 'none'
        }


        switch (status) {
            case 'nofile':
                clearMsg()
                nofileMsg.style.display = 'block'
                break

            case 'noimg':
                clearMsg()
                noimgMsg.style.display = 'block'
                break

            case 'success':
            default:
                clearMsg()
                succMsg.style.display = 'block'
                break
        }
    }
}