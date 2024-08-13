'use strict';

import * as os from 'os';
import * as fs from 'fs';

export function mktmp(): string {
    try {
        return fs.mkdtempSync(os.tmpdir());
    } catch (e) {
        console.error(`An error has occurred while crating the temp folder. Error: ${e}`);
    }
    return null
}

export function rmtmp(path: string) {
    try {
        fs.rmSync(path, { recursive: true });
    } catch (e) {
        console.error(`An error occurred while removing the temp folder at '${path}'. Error: ${e}`);
    }
}
