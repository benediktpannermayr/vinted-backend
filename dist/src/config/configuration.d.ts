export interface AppConfig {
    app: {
        port: number;
        nodeEnv: string;
        corsOrigin: string;
    };
    jwt: {
        secret: string;
        expiresIn: string;
    };
    database: {
        url: string;
    };
    marketplace: {
        vintedBaseUrl: string;
        vintedPerPage: number;
        syncEnabled: boolean;
        syncBatchSize: number;
        syncRequestDelayMs: number;
    };
}
declare const _default: () => AppConfig;
export default _default;
