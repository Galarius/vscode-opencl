const fs = require('fs')
const path = require('path')
const util = require('util')
const cp = require('child_process')

const exists = util.promisify(fs.exists)

/**
 * Scan parents folders for file
 * 
 * @param {string} current Current directory to start looking from
 * @param {string} fileName The name of the file to search for
 * @return {Promise<string> | undefined} absolute file path or undefined
 */
const scanParentFolders = async (current, fileName) => {
	const file = path.join(current, fileName)
	if (await exists(file))
		return file
	
	const parent = path.dirname(current)
	if (parent === current)
		return undefined

	return scanParentFolders(parent, fileName)
}

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

export { exists, killTree, scanParentFolders }