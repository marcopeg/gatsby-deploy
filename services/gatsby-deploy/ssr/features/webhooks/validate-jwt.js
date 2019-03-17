import * as jwt from 'services/jwt'

export const makeValidateJwt = (settings) => {
    return async (req, res, next) => {
        try {
            req.data.github = await jwt.verify(req.query.token)
            next()
        } catch (err) {
            console.log(err)
            res.status(400).send('unacceptable jwt')
        }
    }
}