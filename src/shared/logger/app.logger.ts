import { Logger } from '@nestjs/common';

import { LoggerOptionsModel } from '../models/logger-options.model';

export class AppLogger extends Logger {
    constructor(public context: string) {
        super(context);
    }

    log(options: LoggerOptionsModel): void {
        let log = `[Method: ${options.action}] `;

        if (options.user) log += `[ID: ${options.user.id}, USERNAME: ${options.user.username}] `;

        log += `Data - ${options.data ? JSON.stringify(options.data) : 'NULL'}`;

        super.log(log);
    }
}
