"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const useDateParser_1 = require("./useDateParser");
const DateWhereClause = (column_name, sign, value) => {
    if (!!column_name && !!value && !!sign) {
        let where = "";
        const date = (0, useDateParser_1.parseInvalidDateToDefault)(value);
        where =
            where +
                ` AND DATE(${column_name}) ${sign} ${!!date ? mysql2_1.default.escape(date) : column_name} `;
        console.log(`where`, where);
        return where;
    }
    return "";
};
exports.default = {
    DateWhereClause,
};
//# sourceMappingURL=useSql.js.map