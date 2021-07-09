'use strict';

import { HoverProvider, Hover, MarkdownString, TextDocument, CancellationToken, Position } from 'vscode';
import fs = require('fs');
import apiDoc = require('./openclMan');

export class OpenCLHoverProvider implements HoverProvider {

	public provideHover(document: TextDocument, position: Position, _token: CancellationToken): Hover | undefined {
		
		let wordRange = document.getWordRangeAtPosition(position);
		if (!wordRange) {
			return undefined;
		}

		let name = document.getText(wordRange);

		var entry = apiDoc.OpenCLSignatures[name];
		if (entry && entry.description) {
			let brief = new MarkdownString(entry.brief);
			let signature = fs.readFileSync(entry.signature, 'utf8');
			let codeBlock = new MarkdownString();
			codeBlock.appendCodeblock(signature, 'opencl')
			let md = fs.readFileSync(entry.description, 'utf8');
			let description = new MarkdownString(md);
			let reference = new MarkdownString('Reference: ' + entry.reference);
			let contents: MarkdownString[] = [
				brief,
				codeBlock,
				description,
				reference
			];
			return new Hover(contents, wordRange);
		}

		return undefined;
	}
}