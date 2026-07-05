import { validate } from './env.validation';

const validEnv = {
  NODE_ENV: 'development',
  PORT: '3000',
  DATABASE_URL: 'postgresql://user:pass@localhost:5432/db',
  JWT_SECRET: 'some-secret',
  JWT_EXPIRES_IN: '1d',
  CORS_ORIGIN: 'http://localhost:5173',
};

describe('env.validation', () => {
  it('accepts a fully valid configuration', () => {
    expect(() => validate({ ...validEnv })).not.toThrow();
  });

  it('throws when DATABASE_URL is missing', () => {
    const rest = { ...validEnv, DATABASE_URL: undefined };
    expect(() => validate(rest)).toThrow(
      /Environment variable validation failed/,
    );
  });

  it('throws when JWT_SECRET is missing', () => {
    const rest = { ...validEnv, JWT_SECRET: undefined };
    expect(() => validate(rest)).toThrow(
      /Environment variable validation failed/,
    );
  });

  it('throws when NODE_ENV has an invalid value', () => {
    expect(() => validate({ ...validEnv, NODE_ENV: 'staging' })).toThrow(
      /Environment variable validation failed/,
    );
  });

  it('throws when PORT is out of range', () => {
    expect(() => validate({ ...validEnv, PORT: '99999' })).toThrow(
      /Environment variable validation failed/,
    );
  });
});
