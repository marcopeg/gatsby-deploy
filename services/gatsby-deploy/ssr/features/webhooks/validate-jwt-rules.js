import * as jwt from 'services/jwt'
import { logVerbose } from 'services/logger'

export const makeValidateJwtRules = (settings) => {
    return async (req, res, next) => {
        const { token, github } = req.data

        if (token.origin.event
            && token.origin.event !== github.event
        ) {
            logVerbose(`expected event "${token.origin.event}" but got "${github.event}"`)
            res.send('wrong github event')
            return
        }

        if (github.branch !== token.origin.branch) {
            logVerbose(`expected branch "${token.origin.branch}" but got "${github.branch}"`)
            res.send('wrong branch')
            return
        }
        
        next()
    }
}