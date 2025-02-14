"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const MostWantedItems_1 = require("./entities/MostWantedItems");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "sqlite",
    database: "./db.sqlite",
    synchronize: true,
    logging: true,
    entities: [MostWantedItems_1.MostWantedItems],
});
//# sourceMappingURL=dataSource.js.map