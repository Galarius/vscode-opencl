'use strict';

import * as vscode from 'vscode';

import * as opencl from "./opencl";

interface WordMap {
    [index: string]: boolean;
}

function addCompletions(items: vscode.CompletionItem[], 
                        words: WordMap, 
                        completions: string[], 
                        kind: vscode.CompletionItemKind, 
                        detail: string) 
{
    for (let i = 0; i < completions.length; i++) {
        let word = completions[i];
        delete words[word];
        let item = new vscode.CompletionItem(word);
        item.kind = kind;
        item.detail = detail;
        items.push(item);
    }
}

function addLanguageCompletions(items: vscode.CompletionItem[], words: WordMap) 
{
    addCompletions(items, words, opencl.KEYWORDS, vscode.CompletionItemKind.Keyword, "opencl keyword");
    addCompletions(items, words, opencl.FUNCTIONS, vscode.CompletionItemKind.Function, "opencl built-in function");
    addCompletions(items, words, opencl.CONSTS, vscode.CompletionItemKind.Value, "opencl built-in constant");
    addCompletions(items, words, opencl.MACROS, vscode.CompletionItemKind.Value, "opencl built-in macro");
}

export class OpenCLCompletionItemProvider implements vscode.CompletionItemProvider {
    public async provideCompletionItems(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Promise<vscode.CompletionItem[]> 
    {
        // based on: https://raw.githubusercontent.com/henriiik/vscode-perl/master/src/completions.ts
        let words: WordMap = {};
        let text = document.getText();
        let word: RegExpExecArray;
        while (word = opencl.CONFIG.wordPattern.exec(text)) {
            words[word[0]] = true;
        }

        let currentWordRange = document.getWordRangeAtPosition(position);
        let currentWord = document.getText(currentWordRange);
        delete words[currentWord];

        let items: vscode.CompletionItem[] = [];
        addLanguageCompletions(items, words);

        let keys = Object.keys(words);
        for (let i = 0; i < keys.length; i++) {
            let item = new vscode.CompletionItem(keys[i]);
            item.kind = vscode.CompletionItemKind.Text;
            items.push(item);
        }
        return items;
	}
}