const vscode = require('vscode')

const cppExtension = () => vscode.extensions.getExtension ("ms-vscode.cpptools")

const isCppExtensionInstalled = () => typeof cppExtension() !== 'undefined'

export { cppExtension, isCppExtensionInstalled }