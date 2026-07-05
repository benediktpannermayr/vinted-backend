"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var VintedProvider_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.VintedProvider = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const nest_winston_1 = require("nest-winston");
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36';
let VintedProvider = VintedProvider_1 = class VintedProvider {
    configService;
    source = 'VINTED';
    logger;
    baseUrl;
    perPage;
    constructor(configService, logger) {
        this.configService = configService;
        this.logger = logger;
        this.baseUrl = this.configService.get('marketplace.vintedBaseUrl');
        this.perPage = this.configService.get('marketplace.vintedPerPage');
    }
    search(criteria) {
        const url = this.buildSearchUrl(criteria);
        return this.fetchAndMap(url, criteria.profileName);
    }
    searchByText(text) {
        const params = new URLSearchParams();
        params.set('search_text', text);
        params.set('order', 'newest_first');
        params.set('per_page', String(this.perPage));
        params.set('page', '1');
        const url = `${this.baseUrl}/api/v2/catalog/items?${params.toString()}`;
        return this.fetchAndMap(url, `free-text: "${text}"`);
    }
    async fetchAndMap(url, logLabel) {
        try {
            const cookie = await this.fetchSessionCookie();
            const response = await fetch(url, {
                headers: {
                    'User-Agent': USER_AGENT,
                    Accept: 'application/json',
                    Cookie: cookie,
                },
            });
            if (!response.ok) {
                this.logger.warn(`Vinted search returned ${response.status} for ${logLabel} — skipping this run.`, VintedProvider_1.name);
                return [];
            }
            const data = (await response.json());
            return (data.items ?? [])
                .map((item) => this.mapItem(item))
                .filter(Boolean);
        }
        catch (error) {
            this.logger.warn(`Vinted search failed for ${logLabel}: ${error instanceof Error ? error.message : String(error)}`, VintedProvider_1.name);
            return [];
        }
    }
    buildSearchUrl(criteria) {
        const params = new URLSearchParams();
        const searchTextParts = [
            criteria.productTitle,
            criteria.brand,
            criteria.category,
            ...criteria.sizes,
            ...criteria.colors,
        ].filter(Boolean);
        if (searchTextParts.length > 0) {
            params.set('search_text', searchTextParts.join(' '));
        }
        if (criteria.maxPrice) {
            params.set('price_to', String(criteria.maxPrice));
        }
        params.set('order', 'newest_first');
        params.set('per_page', String(this.perPage));
        params.set('page', '1');
        return `${this.baseUrl}/api/v2/catalog/items?${params.toString()}`;
    }
    async fetchSessionCookie() {
        const response = await fetch(this.baseUrl, {
            headers: { 'User-Agent': USER_AGENT },
        });
        const cookies = response.headers.getSetCookie?.() ?? [];
        const jar = new Map();
        for (const cookie of cookies) {
            const pair = cookie.split(';')[0];
            const separatorIndex = pair.indexOf('=');
            if (separatorIndex === -1)
                continue;
            const name = pair.slice(0, separatorIndex);
            jar.set(name, pair);
        }
        return [...jar.values()].join('; ');
    }
    mapItem(item) {
        if (!item.title || !item.url) {
            return null;
        }
        const rawPrice = typeof item.price === 'object' ? item.price?.amount : item.price;
        const price = Number(rawPrice ?? 0);
        if (!Number.isFinite(price) || price <= 0) {
            return null;
        }
        const images = [
            item.photo?.full_size_url ?? item.photo?.url,
            ...(item.photos?.map((photo) => photo.full_size_url ?? photo.url) ?? []),
        ].filter((url) => Boolean(url));
        return {
            externalId: item.id != null ? String(item.id) : null,
            title: item.title,
            price,
            brand: item.brand_title ?? null,
            category: null,
            size: item.size_title ?? null,
            color: null,
            condition: item.status ?? null,
            images: [...new Set(images)],
            listingUrl: item.url,
            seller: item.user?.login ?? null,
            publishedAt: null,
        };
    }
};
exports.VintedProvider = VintedProvider;
exports.VintedProvider = VintedProvider = VintedProvider_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)(nest_winston_1.WINSTON_MODULE_NEST_PROVIDER)),
    __metadata("design:paramtypes", [config_1.ConfigService, Object])
], VintedProvider);
//# sourceMappingURL=vinted.provider.js.map