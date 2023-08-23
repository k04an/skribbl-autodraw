const chalk = require('chalk')

let config = {
    privateRoom: false,
    optimise: false,
    pixelateLevel: 80
}

let args = process.argv
args.splice(0, 2)

args.forEach(arg => {
    switch (arg) {
        case '-p':
        case '--private':
            config.privateRoom = args[args.indexOf(arg) + 1]
            break
        
        case '-o':
        case '--optimise':
            config.optimise = true
            break

        case '-pl':
        case '--pixelate-level':
            config.pixelateLevel = args[args.indexOf(arg) + 1]
            break

        case '-h':
        case '--help':
            console.log(chalk.magentaBright('╔═════════════════════════════════════════════════════════════════════════╗'))
            console.log(chalk.magentaBright('║                            Nigative v1.1beta                            ║'))
            console.log(chalk.magentaBright('╠═════════════════════════════════════════════════════════════════════════╝'))
            console.log(chalk.magentaBright('╠═  -p or --private <url>  - Specifies link to go when browser page is open'))
            console.log(chalk.magentaBright('║                            Use it to join private room'))
            console.log(chalk.magentaBright('╠═    -o or --optimise     - Use optimisation when drawing to print image'))
            console.log(chalk.magentaBright('║                            faster. DONT MOVE YOUR MOUSE UNTIL IT IS DONE'))
            console.log(chalk.magentaBright('╠═ -pl or --pixelate-level - Level of pixelation. Higher the number'))
            console.log(chalk.magentaBright('║                            more detailed image will be drawn'))
            console.log(chalk.magentaBright('╚═      -h or --help       - Displays this message'))
            console.log()
            console.log(chalk.magentaBright('Also check out our GitHub page:'), chalk.cyan('https://github.com/k04an/skribbl-autodraw'))
            process.exit()
            break
    }
})

module.exports = config