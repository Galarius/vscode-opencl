'use strict';

/**
 * Example usage:
 * const cli = new OpenCLLanguageServerCLI("opencl-language-server")
 * .setEnableFileLogging(true)
 * .setLogFile("custom-log-file.log")
 * .setLogLevel(3)
 * .setSubcommand("clinfo");
 * console.log(cli.buildCommand());
 * Output: "opencl-language-server" --enable-file-logging --log-file "custom-log-file.log" --log-level 3 clinfo
 */
export class OpenCLLanguageServerCLI {
    private serverPath: string;
    private options: Record<string, string | boolean | number | undefined> = {};
    private subcommand: string | undefined;

    constructor(serverPath: string) {
        this.serverPath = serverPath;
        this.options = {
            includeExecutable: true,
            enableFileLogging: false,
            logFile: undefined,
            logLevel: undefined
        };
    }

    setEnableFileLogging(enable: boolean): this {
        this.options.enableFileLogging = enable;
        return this;
    }

    setLogFile(path: string): this {
        this.options.logFile = path;
        return this;
    }

    setLogLevel(level: number): this {
        if (level < 0 || level > 5) {
            throw new Error("Log level must be between 0 and 5.");
        }
        this.options.logLevel = level;
        return this;
    }

    excludeExecutable(): this {
        this.options.includeExecutable = false;
        return this;
    }

    setSubcommand(subcommand: string): this {
        if (subcommand != "clinfo" && subcommand != "--version") {
            throw new Error(`Unsupported subcommand ${subcommand}.`);
        }
        this.subcommand = subcommand;
        return this;
    }

    buildCommand(): string {
        let args = this.buildArgs();
        return `${args.join(" ")}`.trim();
    }

    buildArgs(): string[] {
        var command: string[] = []; 
        if (this.options.includeExecutable) {
            command.push(`"${this.serverPath}"`);
        }
        if (this.options.enableFileLogging) {
            command.push("--enable-file-logging");
            if (this.options.logFile) {
                command.push("--log-file");
                command.push(`"${this.options.logFile}"`);
            }
            if (this.options.logLevel !== undefined) {
                command.push("--log-level");
                command.push(`${this.options.logLevel}`);
            }
        }
        if (!!this.subcommand) {
            command.push(this.subcommand);
        }
        return command;
    }
}
