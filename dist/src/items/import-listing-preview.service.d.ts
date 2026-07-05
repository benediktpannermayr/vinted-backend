import { type IListingRepository } from '../marketplace/listings/repositories/listing.repository.interface';
import { type IMarketplaceProvider } from '../marketplace/providers/marketplace-provider.interface';
import { ImportPreviewResponseDto } from './dto/import-preview-response.dto';
export declare class ImportListingPreviewService {
    private readonly listingRepository;
    private readonly marketplaceProvider;
    constructor(listingRepository: IListingRepository, marketplaceProvider: IMarketplaceProvider);
    preview(listingUrl: string): Promise<ImportPreviewResponseDto>;
}
