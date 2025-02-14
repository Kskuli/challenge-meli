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
Object.defineProperty(exports, "__esModule", { value: true });
exports.MostWantedItems = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
let MostWantedItems = class MostWantedItems {
    constructor(itemId, count = 0) {
        this.itemId = itemId;
        this.count = count;
    }
};
exports.MostWantedItems = MostWantedItems;
__decorate([
    (0, typeorm_1.PrimaryColumn)("varchar") // Especificamos el tipo 'varchar' para itemId
    ,
    __metadata("design:type", String)
], MostWantedItems.prototype, "itemId", void 0);
__decorate([
    (0, typeorm_1.Column)("int", { default: 0 }),
    __metadata("design:type", Number)
], MostWantedItems.prototype, "count", void 0);
exports.MostWantedItems = MostWantedItems = __decorate([
    (0, typeorm_1.Entity)(),
    __metadata("design:paramtypes", [String, Number])
], MostWantedItems);
//# sourceMappingURL=MostWantedItems.js.map