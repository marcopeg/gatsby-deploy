import bodyParser from 'body-parser'
import { EXPRESS_MIDDLEWARE, EXPRESS_ROUTE } from 'services/express/hooks'
import { FEATURE_NAME } from './hooks'
import { makeValidateJwt } from './validate-jwt'
import { makeDecryptJwt } from './decrypt-jwt'
import { makeWebhookRoute } from './webhook-route'
import { makeEncryptRoute } from './encrypt-route'

export const register = ({ registerAction, settings }) => {
    registerAction({
        hook: EXPRESS_MIDDLEWARE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ app }) =>
            app.use(bodyParser.json()),
    })
    registerAction({
        hook: EXPRESS_ROUTE,
        name: FEATURE_NAME,
        trace: __filename,
        handler: ({ app }) => {
            app.post('/build', [
                makeValidateJwt(settings),
                makeDecryptJwt(settings),
                makeWebhookRoute(settings),
            ])
            app.get('/build', [
                makeValidateJwt(settings),
                makeDecryptJwt(settings),
                makeWebhookRoute(settings),
            ])
            app.get('/encrypt', [
                makeValidateJwt(settings),
                makeEncryptRoute(settings),
            ])
        },
    })

}