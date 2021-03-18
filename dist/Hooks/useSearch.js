"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateSearch = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
const GenerateSearch = (search, column) => {
    const searchArray = search.trim().split(" ");
    let sql = ``;
    for (let i = 0; i < searchArray.length; i++) {
        if (i == 0) {
            sql = sql + ` WHERE `;
        }
        if (i !== 0 && i !== searchArray.length - 1) {
            sql = sql + ` and `;
        }
        sql =
            sql + ` ${column} LIKE CONCAT('%',${mysql2_1.default.escape(searchArray[i])},'%') `;
    }
    return sql;
};
exports.GenerateSearch = GenerateSearch;
//# sourceMappingURL=useSearch.js.map