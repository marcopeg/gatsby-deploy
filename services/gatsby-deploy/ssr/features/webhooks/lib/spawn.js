import { spawn as spawnCmd } from 'child_process'

export const spawn = (cmd, options = {}) =>
    new Promise((resolve, reject) => {
        const tokens = cmd.split(' ')
        const { log, ...otherOptions } = options
        
        const process = spawnCmd(tokens.shift(), tokens, otherOptions)

        process.stdout.on('data', data => {
            log(data.toString().trim())
        })
        
        process.stderr.on('data', data => {
            log(data.toString().trim())
        })

        process.on('close', code => {
            log('done', code)
            if (code === 0) {
                resolve()
            }
        })

        process.on('error', err => {
            log(err.message)
            reject(err)
        })
    })
