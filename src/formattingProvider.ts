'use strict'

import * as cp from 'child_process';
import * as vscode from 'vscode'
import * as cmd from './cmd'
import * as path from 'path'
import * as fs from 'fs';
import * as os from "os"

export class OpenCLDocumentFormattingEditProvider implements vscode.DocumentFormattingEditProvider {
    
    public provideDocumentFormattingEdits(document: vscode.TextDocument, 
        options: vscode.FormattingOptions, token: vscode.CancellationToken): vscode.TextEdit[] 
    {                
        let result: vscode.TextEdit[] = [];

        // opencl settings
        let app  : string = vscode.workspace.getConfiguration().get('opencl.formatting.name', '')
        let args : Array<string> = vscode.workspace.getConfiguration().get('opencl.formatting.options', [])

        // if workspace is opened, check if .clang-format exists
        let workspaceRoot = vscode.workspace.rootPath;
        let formatFileExists = false
        if(workspaceRoot) {                
            formatFileExists = fs.existsSync(path.join(workspaceRoot, '.clang-format'))    
        }

        if(!app || !app.length || app == 'clang-format')
        {
            // Default 'clang-format' (shipped with ms-vscode.cpptools)
            var cpptoolsExtension = vscode.extensions.getExtension ("ms-vscode.cpptools");
            if(cpptoolsExtension) 
            {
                // get clang-format binary
                var ext = "";
                if(os.platform() == "darwin") {
                    ext = ".darwin";
                } else if(os.platform() == "win32") {
                    ext = ".exe";
                }
                let clangFormat = path.join(cpptoolsExtension.extensionPath, 
                    'LLVM', 'bin', `clang-format${ext}`);
                
                // if binary was found
                if(fs.existsSync(clangFormat)) 
                {
                    if(args.length > 0) 
                    {
                        // Default 'clang-format' with user-defined args
                        this.runFormatter(clangFormat, args, document);
                    }
                    else
                    {
                        var fallbackStyle = vscode.workspace.getConfiguration().get('C_Cpp.clang_format_fallbackStyle', 'LLVM');
                        var style = vscode.workspace.getConfiguration().get('C_Cpp.clang_format_style', 'file');
                        let vs_style = '{UseTab: Never, IndentWidth: 4, BreakBeforeBraces: Allman, AllowShortIfStatementsOnASingleLine: false, IndentCaseLabels: false, ColumnLimit: 0}';

                        // "Visual Studio" is not an official style yet
                        if(fallbackStyle == "Visual Studio") {
                            fallbackStyle = 'LLVM';
                        }

                        // if style is "Visual Studio" or '.clang-format' is not found in the project's root
                        if(style == "Visual Studio" || (style == "file" && !formatFileExists)) {
                            style = vs_style;
                        }
                
                        // build an argument list
                        args = ['-verbose',`-style="${style}"`,`-fallback-style="${fallbackStyle}"`,'-i']

                        // run default formatter utility
                        this.runFormatter(clangFormat, args, document);
                    }
                } 
                else
                {
                    vscode.window.showErrorMessage("Error: Failed to find 'clang-format' binary in 'ms-vscode.cpptools' extension!");
                }
            } 
            else 
            {
                // User-defined clang-format
                this.runFormatter(app, args, document);
            }
        } 
        else
        {
            // User-defined formatter
            this.runFormatter(app, args, document);
        }
        
        return result;
    }

    static _channel: vscode.OutputChannel;
    private getOutputChannel(): vscode.OutputChannel {
	if (!OpenCLDocumentFormattingEditProvider._channel) {
		OpenCLDocumentFormattingEditProvider._channel = vscode.window.createOutputChannel('OpenCL Formatting');
	}
	return OpenCLDocumentFormattingEditProvider._channel;
}

    private runFormatter(app: string, args: Array<string>, document: vscode.TextDocument): vscode.TextEdit[] {
        
        let result: vscode.TextEdit[] = []
    
        let workspaceRoot = vscode.workspace.rootPath;
        if (workspaceRoot) {
            args.forEach((item, index) => {
                args[index] = item.replace("${workspaceRoot}", workspaceRoot);
            });    
        }
        args.push(document.fileName)
        args = [app].concat(args)
        let commandLine = cmd.buildCommand(args)

        cp.exec(commandLine, { cwd: workspaceRoot }, (error, stdout, stderr) => {
            if (stdout && stdout.length > 0) {
                this.getOutputChannel().appendLine(stdout);
            } 
            if (stderr && stderr.length > 0) {
                this.getOutputChannel().appendLine(stderr);
            } 
            if ((stdout && stdout.length > 0) || (stderr && stderr.length > 0)) {
                this.getOutputChannel().show(true);
            }
        });

        return result;
    }
}		
