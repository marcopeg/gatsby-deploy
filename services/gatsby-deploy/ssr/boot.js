import path from 'path'
import fs from 'fs-extra'
import uuid from 'uuid/v4'
import glob from 'glob'
import * as config from '@marcopeg/utils/lib/config'
import { logInfo, logVerbose } from 'services/logger'
import {
    createHook,
    registerAction,
    createHookApp,
    logBoot,
    SETTINGS,
    FINISH,
} from '@marcopeg/hooks'

const services = [
    require('./services/env'),
    require('./services/logger'),
    require('./services/jwt'),
    require('./services/express'),
]

const features = [
    require('./features/status'),
    require('./features/webhooks'),
]

const getJwtSecret = () => {
    const secret = config.get('JWT_SECRET', '---')
    if (secret !== '---') {
        return secret
    }

    const generatedSecret = uuid()
    logInfo('')
    logInfo('WARNING:')
    logInfo('Gatsby-deploy was started without a JWT_SECRET env var.')
    logInfo('The following value is being generated for this run:')
    logInfo(generatedSecret)
    logInfo('')
    return generatedSecret
}

registerAction({
    hook: SETTINGS,
    name: '♦ boot',
    handler: async ({ settings }) => {

        settings.deploy = {
            cleanOrigin: config.get('KEEP_ORIGIN', '---') === '---'
                ? true
                : config.get('KEEP_ORIGIN') !== 'true',
            cleanTarget: config.get('KEEP_TARGET', '---') === '---'
            ? true
            : config.get('KEEP_TARGET') !== 'true',
        }

        settings.crypto = {
            algorithm: config.get('CRYPTO_ALGORITHM', 'aes-256-ctr'),
        }

        settings.jwt = {
            secret: getJwtSecret(),
            duration: config.get('JWT_DURATION', '1000y'),
        }

        // ---- EXPRESS
        settings.express = {
            nodeEnv: config.get('NODE_ENV'),
            port: '8080',
        }
    },
})

registerAction({
    hook: FINISH,
    name: '♦ boot',
    handler: () => logBoot(),
})

export default createHookApp({
    settings: {},
    services,
    features,
})
