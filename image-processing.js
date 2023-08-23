const Jimp = require('jimp')
const logger = require('./logger')
const config = require('./config')
const moduleName = 'Image processor'

module.exports = {
    getArray: async (imgBuffer) => {
        logger.log('New image processing request', moduleName)
        logger.log('Reading image...', moduleName)
        let img = await Jimp.read(imgBuffer)
        let pixelLevel = Math.round(img.getWidth() / config.pixelateLevel)

        logger.log('Pixelating image...', moduleName)
        await img.pixelate(pixelLevel, 0, 0, img.getWidth(), img.getHeight())

        logger.log('Reading colors of pixels...', moduleName)
        let colorArray = []
        for (let y = 0; y < img.getHeight() / pixelLevel; y++) {
            let buffer = []
            for (let x = 0; x < img.getWidth() / pixelLevel; x++) {
                buffer.push(Jimp.intToRGBA(img.getPixelColor(x * pixelLevel, y * pixelLevel)))
            }
            colorArray.push(buffer)
        }

        const skribblePallet = [
            { r: 0, g: 0, b: 0 },
            { r: 255, g: 255, b: 255 },
            { r: 80, g: 80, b: 80 },
            { r: 193, g: 193, b: 193 },
            { r: 116, g: 11, b: 7 },
            { r: 239, g: 19, b: 11 },
            { r: 194, g: 56, b: 0 },
            { r: 255, g: 113, b: 0 },
            { r: 232, g: 162, b: 0 },
            { r: 255, g: 228, b: 0 },
            { r: 0, g: 70, b: 25 },
            { r: 0, g: 204, b: 0 },
            { r: 0, g: 120, b: 93 },
            { r: 1, g: 255, b: 145 },
            { r: 0, g: 86, b: 158 },
            { r: 0, g: 178, b: 255 },
            { r: 14, g: 8, b: 101 },
            { r: 35, g: 31, b: 211 },
            { r: 85, g: 0, b: 105 },
            { r: 163, g: 0, b: 186 },
            { r: 135, g: 53, b: 84 },
            { r: 223, g: 105, b: 167 },
            { r: 204, g: 119, b: 77 },
            { r: 255, g: 172, b: 142 },
            { r: 99, g: 48, b: 13 },
            { r: 160, g: 82, b: 45 }
        ]

        const browserPallet = [
            {row: 'b', num: 1},
            {row: 't', num: 1},
            {row: 'b', num: 2},
            {row: 't', num: 2},
            {row: 'b', num: 3},
            {row: 't', num: 3},
            {row: 'b', num: 4},
            {row: 't', num: 4},
            {row: 'b', num: 5},
            {row: 't', num: 5},
            {row: 'b', num: 6},
            {row: 't', num: 6},
            {row: 'b', num: 7},
            {row: 't', num: 7},
            {row: 'b', num: 8},
            {row: 't', num: 8},
            {row: 'b', num: 9},
            {row: 't', num: 9},
            {row: 'b', num: 10},
            {row: 't', num: 10},
            {row: 'b', num: 11},
            {row: 't', num: 11},
            {row: 'b', num: 12},
            {row: 't', num: 12},
            {row: 'b', num: 13},
            {row: 't', num: 13},
        ]

        logger.log('Converting colors to skribble pallet...', moduleName)
        const convertToPallet = (color) => {
            let rates = []
            skribblePallet.forEach(palletColor => {
                rates.push(Math.sqrt(Math.pow((palletColor.r - color.r), 2) + Math.pow((palletColor.g - color.g), 2) + Math.pow((palletColor.b - color.b), 2)))
            })
            return browserPallet[rates.indexOf(Math.min.apply(null, rates))]
        }

        logger.log('Converting colors to browser instructions...', moduleName)
        let browserArray = []
        colorArray.forEach(row => {
            let buffer = []
            row.forEach(pixel => {
                buffer.push(convertToPallet({r: pixel.r, g: pixel.g, b: pixel.b}))
            })
            browserArray.push(buffer)
        })
        logger.log('Done!', moduleName)
        return browserArray
    }
}