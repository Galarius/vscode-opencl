const fs = require('fs')
const path = require('path')
const util = require('util')
const { exec, spawn } = require('promisify-child-process')

const exists = util.promisify(fs.exists)

const killTree = async (processId) => {
	if (process.platform === 'win32') {
		try {
            const { stdout, stderr } = await exec(`C:\\Windows\\System32\\taskkill.exe /F /T /PID ${processId}`)
            console.log('stdout:', stdout)
            console.log('stderr:', stderr)
		} catch (err) {
			console.log('Error killing process tree: ' + err)
		}
	} else {
		try {
			const cmd = path.join(__dirname, '../../scripts/terminate.sh')
			await spawn(cmd, [processId.toString()])
		} catch (err) {
			console.log('Error killing process tree: ' + err);
		}
	}
}

export { exists, killTree }