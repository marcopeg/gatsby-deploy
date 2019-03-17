import ms from 'ms'
import path from 'path'
import fs from 'fs-extra'

import { gitClone } from './git-clone'
import { gitCommit } from './git-commit'
import { gitPush } from './git-push'
import { gitIdentity } from './git-identity'
import { yarnInstall } from './yarn-install'
import { yarnBuild } from './yarn-build'
import { fsEmptyDir } from './fs-empty-dir'
import { fsMoveFiles } from './fs-move-files'

export const build = async (config, log = () => {}) => {
    const start = new Date()
    log('build start')

    const originPath = '/tmp/gatsby-deploy/origin'
    const targetPath = '/tmp/gatsby-deploy/target'

    log('=======================\n\n')
    log('Cleaning up temp folders...\n')
    await fs.remove(originPath)
    await fs.remove(targetPath)
    await fs.ensureDir(originPath)

    log('=======================\n\n')
    log('## Cloning origin repo...\n')
    await gitClone({
        ...config.auth,
        ...config.origin,
        target: originPath,
    }, { log })
    
    log('=======================\n\n')
    log('## Cloning target repo...\n')
    await gitClone({
        ...config.auth,
        ...config.target,
        target: targetPath,
    }, { log })

    log('=======================\n\n')
    log('## Installing dependencies...\n')
    await yarnInstall(originPath, { log })
    
    log('=======================\n\n')
    log('## Building the project...\n')
    await yarnBuild(originPath, { log })
    
    log('=======================\n\n')
    log('## Moving artifacts...\n')
    await fsEmptyDir(targetPath, [ '.git' ])
    await fsMoveFiles(path.join(originPath, config.origin.build), targetPath, [ '.git' ])

    log('=======================\n\n')
    log('## Publishing...\n')
    await fs.writeJSON(path.join(targetPath, 'gatsby-deploy.json'), {
        lastDeploy: new Date(),
        duration: new Date() - start,
    })
    await gitIdentity(config.auth)
    await gitCommit(targetPath, `publish ${(new Date()).toISOString()}`)
    await gitPush({
        ...config.auth,
        ...config.target,
        target: targetPath,
    }, { log })

    log('=======================\n\n')
    log('## Cleaning up temp folders...\n')
    await fs.remove(originPath)
    await fs.remove(targetPath)

    const elapsed = new Date() - start
    const elapsedStr = ms(elapsed)

    log('=======================\n\n')
    log(`## Build went through in ${elapsedStr}\n`)

    return {
        elapsed,
        elapsedStr,
    }
}
