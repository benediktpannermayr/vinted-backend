"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalStorageProvider = void 0;
const common_1 = require("@nestjs/common");
const promises_1 = require("node:fs/promises");
const node_path_1 = require("node:path");
let LocalStorageProvider = class LocalStorageProvider {
    uploadsRoot = (0, node_path_1.join)(process.cwd(), 'uploads');
    async save(file, filename) {
        const relativePath = (0, node_path_1.join)('items', filename);
        const absolutePath = (0, node_path_1.join)(this.uploadsRoot, relativePath);
        await (0, promises_1.mkdir)((0, node_path_1.dirname)(absolutePath), { recursive: true });
        await (0, promises_1.writeFile)(absolutePath, file);
        return relativePath;
    }
    async delete(path) {
        await (0, promises_1.unlink)((0, node_path_1.join)(this.uploadsRoot, path));
    }
    getUrl(path) {
        return `/uploads/${path}`;
    }
};
exports.LocalStorageProvider = LocalStorageProvider;
exports.LocalStorageProvider = LocalStorageProvider = __decorate([
    (0, common_1.Injectable)()
], LocalStorageProvider);
//# sourceMappingURL=local-storage.provider.js.map