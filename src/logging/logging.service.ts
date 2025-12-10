import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface IRequest {
  method: string;
  url: string;
  query: Record<string, any>;
  params: Record<string, any>;
  body: any;
}

@Injectable()
export class LoggingService extends ConsoleLogger {
  private logDir: string;
  private logFilePath: string;

  constructor(context?: string) {
    super(context || 'Home Library');

    this.logDir = path.join(process.cwd(), 'logs');
    this.logFilePath = path.join(this.logDir, 'app.log');

    this.ensureLogDirExists();

    this.setLogLevels(['error']);
  }

  private ensureLogDirExists() {
    if (!fs.existsSync(this.logDir)) {
      try {
        fs.mkdirSync(this.logDir, { recursive: true });
        this.log(`Log directory was created: ${this.logDir}`);
      } catch (error) {
        console.error(`Could not create log directory: ${error.message}`);
      }
    }
  }

  writeToFile(filePath: string, message: string) {
    try {
      const timestamp = new Date().toISOString();
      const formattedMessage = `[${timestamp}] ${message}\n`;

      fs.appendFileSync(filePath, formattedMessage, { encoding: 'utf8' });
    } catch (error) {
      console.error(
        `Could not write log to file ${filePath}: ${error.message}`,
      );
    }
  }

  logRequest(request: IRequest) {
    const requestData = this.extractReqData(request);
    const logMessage = `[REQUEST] ${JSON.stringify(requestData)}`;

    this.log(logMessage);
    this.writeToFile(this.logFilePath, logMessage);
  }

  private extractReqData(request: IRequest) {
    let params = {};

    if (request.params && request.params['0']) {
      const parts = request.params['0'].split('/');
      if (parts.length === 2) {
        params = { id: parts[1] };
      }
    }

    return {
      method: request.method,
      url: request.url,
      query: request.query,
      params,
      body: this.removeSensetiveFields(request.body),
    };
  }

  private removeSensetiveFields(body: any) {
    if (!body || typeof body !== 'object') {
      return body;
    }

    const sensetiveFields = ['password', 'token', 'secret', 'authorization'];

    const cleanBody = { ...body };

    sensetiveFields.forEach((field) => {
      if (cleanBody[field]) {
        cleanBody[field] = 'Sensetive data';
      }
    });

    return cleanBody;
  }
}
