"use strict";

import Platform = NodeJS.Platform;

export interface Os {
    platform(): Platform;
    homedir(): string;
}