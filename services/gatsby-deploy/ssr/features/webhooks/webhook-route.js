
import { build } from './lib/build'
import { logVerbose } from 'services/logger'


export const makeWebhookRoute = (config) => {
    return async (req, res) => {
        try {
            await build(req.data.token, (line) => {
                res.write(`${line}\n`)
                logVerbose(line)
            })
        } catch (err) {
            res.write('ERROR\n')
            res.write(err.message)
        }
        
        res.end()
    }
}
