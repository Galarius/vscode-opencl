// https://www.richardkotze.com/coding/unit-test-mock-vs-code-extension-api-jest

const workspace = {
    getConfiguration: jest.fn()
};

const vscode = {
    workspace
};

module.exports = vscode;