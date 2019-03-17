
import { build } from './lib/build'
import { logVerbose } from 'services/logger'

export const makeWebhookRoute = (config) => {

    // Super simple lockign mechanism for the build
    let isBuilding = false
    let buildingTimer = null

    const releaseBuild = () => {
        clearTimeout(buildingTimer)
        isBuilding = false
    }

    const lockBuild = () => {
        isBuilding = true

        clearTimeout(buildingTimer)
        buildingTimer = setTimeout(releaseBuild, 1000 * 60)
    }

    return async (req, res) => {
        if (isBuilding) {
            res.status(409)
            res.send('already building')
            return
        }

        // Lock the build and keep refresh the lock every
        // time the log gets fired
        try {
            lockBuild()
            await build({
                ...req.data.token,
                ...config.deploy,
            }, (line) => {
                lockBuild()
                res.write(`${line}\n`)
                logVerbose(line)
            })
        } catch (err) {
            res.write('ERROR\n')
            res.write(err.message)
        }
        
        releaseBuild()
        res.end()
    }
}
