"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    app: {
        port: parseInt(process.env.PORT ?? '3000', 10),
        nodeEnv: process.env.NODE_ENV ?? 'development',
        corsOrigin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
    },
    jwt: {
        secret: process.env.JWT_SECRET ?? '',
        expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
    },
    database: {
        url: process.env.DATABASE_URL ?? '',
    },
    marketplace: {
        vintedBaseUrl: process.env.VINTED_BASE_URL ?? 'https://www.vinted.de',
        vintedPerPage: parseInt(process.env.VINTED_PER_PAGE ?? '48', 10),
        syncEnabled: (process.env.MARKETPLACE_SYNC_ENABLED ?? 'true') === 'true',
        syncBatchSize: parseInt(process.env.MARKETPLACE_SYNC_BATCH_SIZE ?? '3', 10),
        syncRequestDelayMs: parseInt(process.env.MARKETPLACE_SYNC_REQUEST_DELAY_MS ?? '1500', 10),
    },
});
//# sourceMappingURL=configuration.js.map