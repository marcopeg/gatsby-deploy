import crypto from 'crypto'

export const makeDecryptJwt = (settings) => {
    return async (req, res, next) => {
        try {
            // decrypt user's password from jwt
            const decipher = crypto.createDecipher(settings.crypto.algorithm, settings.jwt.secret)        
            req.data.github.auth.password = decipher.update(req.data.github.auth.password, 'hex')
            req.data.github.auth.password += decipher.final();

            next()
        } catch (err) {
            console.log(err)
            res.status(400).send('decrypt failed')
        }
    }
}