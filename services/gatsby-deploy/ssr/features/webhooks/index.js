import bodyParser from 'body-parser'
import { EXPRESS_MIDDLEWARE, EXPRESS_ROUTE } from 'services/express/hooks'
import { FEATURE_NAME } from './hooks'
import { makeDetectGithubPing } from './detect-github-ping'
import { makeDetectGithubInfo } from './detect-github-info'
import { makeValidateJwt } from './validate-jwt'
import { makeValidateJwtRules } from './validate-jwt-rules'
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
            app.post('/hook/:token', [
                makeDetectGithubPing(settings),
                makeDetectGithubInfo(settings),
                makeValidateJwt(settings),
                makeValidateJwtRules(settings),
                makeDecryptJwt(settings),
                makeWebhookRoute(settings),
            ])
            app.get('/hook/:token', [
                makeValidateJwt(settings),
                makeDecryptJwt(settings),
                makeWebhookRoute(settings),
            ])
            app.get('/encrypt/:token', [
                makeValidateJwt(settings),
                makeEncryptRoute(settings),
            ])
        },
    })

}