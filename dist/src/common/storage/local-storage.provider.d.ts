import { IStorageProvider } from '../interfaces/storage-provider.interface';
export declare class LocalStorageProvider implements IStorageProvider {
    private readonly uploadsRoot;
    save(file: Buffer, filename: string): Promise<string>;
    delete(path: string): Promise<void>;
    getUrl(path: string): string;
}
