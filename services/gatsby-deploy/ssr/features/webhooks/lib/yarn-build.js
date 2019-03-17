import { spawn } from './spawn'

export const yarnBuild = (targetPath, options = {}) =>
    spawn(`yarn build`, {
        ...options,
        cwd: targetPath,
    })