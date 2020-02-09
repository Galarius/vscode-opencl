const fs = require('fs')
const path = require('path')
const util = require('util')
const cp = require('child_process')

const exists = util.promisify(fs.exists)

const killTree = async (processId) => {
	try {
		if (process.platform === 'win32') {
			cp.execSync(`C:\\Windows\\System32\\taskkill.exe /F /T /PID ${processId}`)
		} else {
			const cmd = path.join(__dirname, '../../scripts/terminate.sh')
			cp.spawnSync(cmd, [processId.toString()])
		}
	} catch (err) {
		console.log('Error killing process tree: ' + err)
	}
}

export { exists, killTree }