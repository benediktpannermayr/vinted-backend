// Placeholder abstraction for item image storage. Not wired to any endpoint
// yet — will be injected into the Items module in Phase 2, allowing the
// backing implementation (local disk, S3, MinIO, ...) to change without
// touching call sites.
export interface IStorageProvider {
  save(file: Buffer, filename: string): Promise<string>;
  delete(path: string): Promise<void>;
  getUrl(path: string): string;
}

export const STORAGE_PROVIDER = 'STORAGE_PROVIDER';
