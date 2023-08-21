const chalk = require('chalk')

module.exports = {
    log: (msg, moduleName, msgType) => {
        switch (msgType) {
            case 'error': 
                console.log(chalk.red(`[${moduleName}] ${msg}`))
                break
            case 'warning': 
                console.log(chalk.yellow(`[${moduleName}] ${msg}`))
                break
            case 'success':
            default:
                console.log(chalk.green(`[${moduleName}] ${msg}`))
                break
        }
    }
}