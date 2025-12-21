import { Injectable, ConsoleLogger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { LogLevel } from '../constants/log-levels';

export interface IRequest {
  method: string;
  url: string;
  query: Record<string, any>;
  params: Record<string, any>;
  body: any;
}

export interface IResponse {
  statusCode: number;
  statusMessage?: string;
  body?: any;
}

@Injectable()
export class LoggingService extends ConsoleLogger {
  private logDir: string;
  private logFilePath: string;
  private currentLogLevel: LogLevel;
  private maxFileSizeBytes: number;

  constructor(context?: string) {
    super(context || 'Home Library');

    const maxSizeKB = parseInt(process.env.LOG_MAX_FILE_SIZE_KB || '1024');
    this.maxFileSizeBytes = maxSizeKB * 1024;

    this.currentLogLevel =
      (process.env.LOG_LEVEL as LogLevel) || LogLevel.ERROR;

    const levels = this.getLogLevels();
    this.setLogLevels(levels);

    this.logDir = path.join(process.cwd(), 'logs');
    this.logFilePath = path.join(this.logDir, 'app.log');

    this.setupGlobalErrorHandlers();

    this.ensureLogDirAndFileExists();
  }

  private shouldLog(level: LogLevel): boolean {
    const priority = {
      [LogLevel.ERROR]: 0,
      [LogLevel.WARN]: 1,
      [LogLevel.LOG]: 2,
      [LogLevel.DEBUG]: 3,
      [LogLevel.VERBOSE]: 4,
    };

    return priority[level] <= priority[this.currentLogLevel];
  }

  private getLogLevels(): LogLevel[] {
    const levels: LogLevel[] = [LogLevel.ERROR];

    if (this.shouldLog(LogLevel.WARN)) levels.push(LogLevel.WARN);
    if (this.shouldLog(LogLevel.LOG)) levels.push(LogLevel.LOG);
    if (this.shouldLog(LogLevel.DEBUG)) levels.push(LogLevel.DEBUG);
    if (this.shouldLog(LogLevel.VERBOSE)) levels.push(LogLevel.VERBOSE);

    return levels;
  }

  error(message: any) {
    if (this.shouldLog(LogLevel.ERROR)) {
      super.error(message);
      this.writeToFile(
        this.logFilePath,
        `[ERROR] ${typeof message === 'string' ? message : JSON.stringify(message)}`,
      );
    }
  }

  warn(message: any) {
    if (this.shouldLog(LogLevel.WARN)) {
      super.warn(message);
      this.writeToFile(
        this.logFilePath,
        `[WARN] ${typeof message === 'string' ? message : JSON.stringify(message)}`,
      );
    }
  }

  log(message: any) {
    if (this.shouldLog(LogLevel.LOG)) {
      super.log(message);
      this.writeToFile(
        this.logFilePath,
        `[LOG] ${typeof message === 'string' ? message : JSON.stringify(message)}`,
      );
    }
  }

  debug(message: any) {
    if (this.shouldLog(LogLevel.DEBUG)) {
      super.debug(message);
      this.writeToFile(
        this.logFilePath,
        `[DEBUG] ${typeof message === 'string' ? message : JSON.stringify(message)}`,
      );
    }
  }

  verbose(message: any) {
    if (this.shouldLog(LogLevel.VERBOSE)) {
      super.verbose(message);
      this.writeToFile(
        this.logFilePath,
        `[VERBOSE] ${typeof message === 'string' ? message : JSON.stringify(message)}`,
      );
    }
  }

  private setupGlobalErrorHandlers() {
    process.on('uncaughtException', (error: Error) => {
      this.error(`Uncaught Exception: ${error.message}`);
    });

    process.on('unhandledRejection', (reason: any, promise: Promise<any>) => {
      this.error(`Unhandled Rejection at: ${promise}, reason: ${reason}`);
    });
  }

  private ensureLogDirAndFileExists() {
    try {
      if (!fs.existsSync(this.logDir)) {
        fs.mkdirSync(this.logDir, { recursive: true });
        console.log(`Created: ${this.logDir}`);
      }

      if (!fs.existsSync(this.logFilePath)) {
        fs.writeFileSync(this.logFilePath, '', { encoding: 'utf8' });
        console.log(`Created: ${this.logFilePath}`);
      }
    } catch (error) {
      console.error(`Failed to create log file: ${error.message}`);
      throw error;
    }
  }
  writeToFile(filePath: string, message: string) {
    try {
      if (this.shouldRotate(filePath)) {
        this.rotateLogFile(filePath);
      }

      const timestamp = new Date().toISOString();
      const formattedMessage = `[${timestamp}] ${message}\n`;

      fs.appendFileSync(filePath, formattedMessage, { encoding: 'utf8' });
    } catch (error) {
      console.error(
        `Could not write log to file ${filePath}: ${error.message}`,
      );
    }
  }

  private shouldRotate(filePath: string): boolean {
    try {
      const stats = fs.statSync(filePath);
      return stats.size >= this.maxFileSizeBytes;
    } catch {
      return false;
    }
  }

  private rotateLogFile(filePath: string) {
    const dir = path.dirname(filePath);
    const baseName = path.basename(filePath, '.log');
    const maxBackupFiles = 10;

    try {
      const oldestFile = path.join(dir, `${baseName}.${maxBackupFiles}.log`);
      if (fs.existsSync(oldestFile)) {
        fs.unlinkSync(oldestFile);
      }

      for (let i = maxBackupFiles - 1; i >= 1; i--) {
        const currentFile = path.join(dir, `${baseName}.${i}.log`);
        const nextFile = path.join(dir, `${baseName}.${i + 1}.log`);

        if (fs.existsSync(currentFile)) {
          fs.renameSync(currentFile, nextFile);
        }
      }

      const firstBackup = path.join(dir, `${baseName}.1.log`);
      if (fs.existsSync(filePath)) {
        fs.renameSync(filePath, firstBackup);
      }

      fs.writeFileSync(filePath, '', { encoding: 'utf8' });

      console.log(`Log file rotated`);
    } catch (error) {
      console.error(`Failed to rotate file: ${error.message}`);
    }
  }

  logRequest(request: IRequest) {
    const requestData = this.extractReqData(request);
    const logMessage = `[REQUEST] ${JSON.stringify(requestData)}`;

    this.log(logMessage);
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

  logResponse(response: IResponse) {
    const logMessage = `[RESPONSE] ${JSON.stringify(response)}`;

    this.log(logMessage);
  }
}
