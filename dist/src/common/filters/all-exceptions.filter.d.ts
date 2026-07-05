import { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import type { LoggerService } from '@nestjs/common';
export declare class AllExceptionsFilter implements ExceptionFilter {
    private readonly logger;
    constructor(logger: LoggerService);
    catch(exception: unknown, host: ArgumentsHost): void;
}
