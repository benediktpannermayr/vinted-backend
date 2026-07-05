export interface IStorageProvider {
    save(file: Buffer, filename: string): Promise<string>;
    delete(path: string): Promise<void>;
    getUrl(path: string): string;
}
export declare const STORAGE_PROVIDER = "STORAGE_PROVIDER";
