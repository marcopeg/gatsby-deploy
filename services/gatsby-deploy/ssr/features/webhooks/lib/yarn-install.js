import { spawn } from './spawn'

export const yarnInstall = (targetPath, options = {}) =>
    spawn(`yarn install`, {
        ...options,
        cwd: targetPath,
    })