// https://www.richardkotze.com/coding/unit-test-mock-vs-code-extension-api-jest

const path = require("node:path");

const vscode = {
    workspace: {
        getConfiguration: jest.fn().mockReturnValue(null)
    },
    window: {
        withProgress: jest.fn((_opts, task) => task({ report: jest.fn() })),
        showInformationMessage: jest.fn(),
        showErrorMessage: jest.fn(),
    },
    ProgressLocation: { Notification: 0 },
    Uri: {
        joinPath: jest.fn((base, relative) => path.join(base, relative).fsPath),
    },
    ExtensionContext: {
        secrets: {
            store: jest.fn().mockResolvedValue(true),
            get: jest.fn().mockResolvedValue(undefined),
            delete: jest.fn().mockResolvedValue(true),
        },
    },
};

module.exports = vscode;
