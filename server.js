const http = require('http')
const { Server } = require('socket.io')
const httpServer = http.createServer()
const logger = require('./logger')
const browserEmitter = require('./browser')
const { getArray } = require('./image-processing')
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
})


const moduleName = 'Local server'
const PORT = 1111


logger.log('Launching local server...', moduleName)

io.on('connection', (socket) => {
    logger.log(`Web client successfuly connected!`, moduleName)

    socket.on('imageCommand', async (base64Img) => {
        logger.log('Got new image!', moduleName)
        let imgBuffer = await Buffer.from(base64Img.split(',')[1], 'base64')
        logger.log('Converting image...', moduleName)
        let browserArray = await getArray(imgBuffer)
        browserEmitter.emit('startDraw', browserArray)
    })
})



httpServer.listen(PORT, () => {
    logger.log(`Local server is listening on port ${PORT}`, moduleName)
})

browserEmitter.on('browserClose', () => {
    logger.log('Killing main process...', moduleName)
    process.exit()
})