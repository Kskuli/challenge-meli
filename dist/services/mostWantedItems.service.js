"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopFiveMostWantedItems = void 0;
const dataSource_1 = require("../dataSource");
const MostWantedItems_1 = require("../entities/MostWantedItems");
const errorHandler_1 = require("../errorHandler");
const getTopFiveMostWantedItems = () => __awaiter(void 0, void 0, void 0, function* () {
    const mostWantedRepository = dataSource_1.AppDataSource.getRepository(MostWantedItems_1.MostWantedItems);
    try {
        const topFiveItems = yield mostWantedRepository.find({
            order: {
                count: "DESC",
            },
            take: 5,
        });
        return topFiveItems.map(item => item.itemId);
    }
    catch (error) {
        console.error(error);
        throw new errorHandler_1.CustomError("Error fetching the most wanted items", 500);
    }
});
exports.getTopFiveMostWantedItems = getTopFiveMostWantedItems;
//# sourceMappingURL=mostWantedItems.service.js.map