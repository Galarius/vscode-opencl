import { OpenCLLanguageServerCLI } from '../../../src/providers/server/cli'

describe('Server Provider CLI Tests', () => {
    let serverPath = 'C:\\Users\\Name Surname\\.vscode\\extensions\\opencl-language-server';
    test(`Should return '"${serverPath}" clinfo'`, () => {
        expect(
            new OpenCLLanguageServerCLI(serverPath).setSubcommand("clinfo").buildCommand()
        ).toBe(`"${serverPath}" clinfo`);
    })

    test(`Should return '"${serverPath}" --version'`, () => {
        expect(
            new OpenCLLanguageServerCLI(serverPath).setSubcommand("--version").buildCommand()
        ).toBe(`"${serverPath}" --version`);
    })

    let logPath = 'C:\\Users\\Name Surname\\tmp\\opencl-language-server.log';
    test(`Should return '"${serverPath}" --enable-file-logging --log-file "${logPath}" --log-level 0 clinfo'`, () => {
        expect(
            new OpenCLLanguageServerCLI(serverPath)
                .setEnableFileLogging(true)
                .setLogFile(logPath)
                .setLogLevel(0)
                .setSubcommand("clinfo").buildCommand()
        ).toBe(`"${serverPath}" --enable-file-logging --log-file "${logPath}" --log-level 0 clinfo`);
    })

    test(`Should return '"${serverPath}" clinfo when file logging disabled'`, () => {
        expect(
            new OpenCLLanguageServerCLI(serverPath)
                .setEnableFileLogging(false)
                .setLogFile(logPath)
                .setLogLevel(0)
                .setSubcommand("clinfo").buildCommand()
        ).toBe(`"${serverPath}" clinfo`);
    })

    test(`Should return '"${serverPath}" clinfo'`, () => {
        expect(
            new OpenCLLanguageServerCLI(serverPath)
                .setEnableFileLogging(false)
                .setLogLevel(4)
                .setSubcommand("clinfo").buildCommand()
        ).toBe(`"${serverPath}" clinfo`);
    })

    test(`Should throw when log level is larger than 5'`, () => {
        expect(() => {
            new OpenCLLanguageServerCLI(serverPath).setLogLevel(6)
        }).toThrow("Log level must be between 0 and 5.");
    })

    test(`Should throw when log level is less than 0'`, () => {
        expect(() => {
            new OpenCLLanguageServerCLI(serverPath).setLogLevel(-1)
        }).toThrow("Log level must be between 0 and 5.");
    })

    test(`Should throw when subcommand is not equal to 'clinfo''`, () => {
        expect(() => {
            new OpenCLLanguageServerCLI(serverPath).setSubcommand("diagnostics")
        }).toThrow("Unsupported subcommand diagnostics.");
    })
})