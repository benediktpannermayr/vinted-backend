import { Injectable } from '@nestjs/common';
import { mkdir, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { IStorageProvider } from '../interfaces/storage-provider.interface';

// Local-disk implementation of IStorageProvider. Not yet injected anywhere —
// prepared ahead of the Items module (Phase 2), which will inject
// STORAGE_PROVIDER and swap this for S3/MinIO later without call-site changes.
@Injectable()
export class LocalStorageProvider implements IStorageProvider {
  private readonly uploadsRoot = join(process.cwd(), 'uploads');

  async save(file: Buffer, filename: string): Promise<string> {
    const relativePath = join('items', filename);
    const absolutePath = join(this.uploadsRoot, relativePath);
    await mkdir(dirname(absolutePath), { recursive: true });
    await writeFile(absolutePath, file);
    return relativePath;
  }

  async delete(path: string): Promise<void> {
    await unlink(join(this.uploadsRoot, path));
  }

  getUrl(path: string): string {
    return `/uploads/${path}`;
  }
}
