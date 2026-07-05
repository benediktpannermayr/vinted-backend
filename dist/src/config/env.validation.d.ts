import 'reflect-metadata';
declare class EnvironmentVariables {
    NODE_ENV: string;
    PORT: number;
    DATABASE_URL: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
    CORS_ORIGIN: string;
}
export declare function validate(config: Record<string, unknown>): EnvironmentVariables;
export {};
