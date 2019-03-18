import md5 from 'md5'
import { logInfo, logError } from 'services/logger'
import { build } from './lib/build'

const queueList = []
const queueMap = {}

const anonymizeBuildData = (data) => {
    try {
        const copy = JSON.parse(JSON.stringify(data))
        copy.token.auth.password = 'xxx'
        return copy
    } catch (err) {
        return { error: err.message }
    }
}

const removeBuild = (buildId) => {
    queueList.splice(queueList.indexOf(buildId), 1)
    delete queueMap[buildId]
}

const runBuild = (buildId, log, end) =>
    new Promise(async (resolve) => {
        const buildData = queueMap[buildId]
        const buildConfig = {
            ...buildData.token,
            config: buildData.config,
        }

        // Lock the build
        buildData.isRunning = true

        try {
            const report = await build(buildConfig, log)
            log('Have a nice day ;-)')
            logInfo(`Build ${buildId} succeded in ${report.elapsedStr}`)
            end()
            resolve({
                success: true,
                report,
            })
        } catch (error) {
            log(`Build failed: ${error.message}`)
            logError(`Build failed: ${buildId} failed - ${error.message}`)
            logError(anonymizeBuildData(buildData))
            end()
            resolve({
                success: false,
                error,
            })
        } finally {
            removeBuild(buildId)
        }
    })

export const start = () => {

}

export const addBuild = (settings, log, end) => {
    const buildId = `build-${md5(JSON.stringify(settings.token))}`
    log(`id: ${buildId}`)

    // Check if already queued
    if (queueList.includes(buildId)) {
        log(`queued at position ${queueList.indexOf(buildId)}`)
        end()
        return
    }

    // Queue the build
    queueList.push(buildId)
    queueMap[buildId] = settings

    // Show info about the queue being queued in case the queue
    // is long, or in case the request came from a GitHub webook
    if (queueList.length > 1 || settings.githup) {
        log(`queued at position ${queueList.indexOf(buildId)}`)
        end()
        return
    }

    // Run the build right away and attach the logs to the output stream
    runBuild(buildId, log, end)
}
