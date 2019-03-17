import crypto from 'crypto'
import * as jwt from 'services/jwt'

export const makeEncryptRoute = (settings) => {
    return async (req, res) => {

        const cipher = crypto.createCipher(settings.crypto.algorithm, settings.jwt.secret)
        let crypted = cipher.update(req.data.github.auth.password, 'utf8', 'hex')
        crypted += cipher.final('hex')

        req.data.github.auth.password = crypted

        res.send(await jwt.sign(req.data.github))
    }
}
