'use strict';

import * as vscode from 'vscode';

import * as opencl from "./opencl";

interface WordMap {
    [index: string]: boolean;
}

function addCompletions(items: vscode.CompletionItem[], completions: string[], kind: vscode.CompletionItemKind, detail: string) {
    for (let i = 0; i < completions.length; i++) {
        let word = completions[i];
        let item = new vscode.CompletionItem(word);
        item.kind = kind
        item.detail = detail;
        items.push(item);
    }
}

function addLanguageCompletions(items: vscode.CompletionItem[]) {
    addCompletions(items, opencl.KEYWORDS, vscode.CompletionItemKind.Keyword, "opencl keyword");
    addCompletions(items, opencl.FUNCTIONS, vscode.CompletionItemKind.Function, "opencl built-in function");
    addCompletions(items, opencl.CONSTS, vscode.CompletionItemKind.Value, "opencl built-in constant");
    addCompletions(items, opencl.MACROS, vscode.CompletionItemKind.Value, "opencl built-in macro");
    addCompletions(items, opencl.ENUMS, vscode.CompletionItemKind.Enum, "opencl built-in enum");
}

export class OpenCLCompletionItemProvider implements vscode.CompletionItemProvider {
	public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.CompletionItem[]> {
        let items: vscode.CompletionItem[] = [];
        addLanguageCompletions(items);
        return items;
	}
}