"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connection_string = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
exports.connection_string = null;
if (process.env.NODE_ENV === "production") {
    exports.connection_string = {
        host: "109.106.254.1",
        user: "u498243179_lms",
        password: "LMS@capstone2",
        database: "u498243179_lms",
        port: 3306,
    };
}
else {
    exports.connection_string = {
        host: "109.106.254.1",
        user: "u498243179_lms",
        password: "LMS@capstone2",
        database: "u498243179_lms",
        port: 3306,
    };
}
const BeginTransaction = (con) => {
    return new Promise((res, rej) => {
        con.beginTransaction((err) => {
            return rej(err);
        });
        return res(res);
    });
};
const QueryPagination = (sql, pagination, connection) => {
    return new Promise((resolve, reject) => {
        const { filters, sort, page } = pagination;
        const { success, message, query } = queryFormat(sql, filters);
        if (!success) {
            if (typeof message !== "undefined") {
                return reject(message);
            }
        }
        const full_query = `
      ${query} 
      ORDER BY ${sort.column} ${sort.direction}` +
            (page
                ? `
    LIMIT ${mysql2_1.default.escape(page.begin)}, ${mysql2_1.default.escape(page.limit)} `
                : "");
        try {
            connection.query(full_query, (err, result) => {
                if (err) {
                    return reject(err);
                }
                else {
                    return resolve(result);
                }
            });
        }
        catch (error) {
            connection.destroy();
            return reject(error);
        }
    });
};
const queryFormat = (query, values) => {
    const formattedQuery = {
        success: true,
        query: query,
    };
    formattedQuery.query = query.replace(/\@(\w+)/g, (str, key) => {
        if (typeof key === "string") {
            if (values.hasOwnProperty(key)) {
                if (values[key] === null || typeof values[key] === "undefined") {
                    return "(NULL)";
                }
                if (values[key] instanceof Array) {
                    const furnished_arr = values[key].filter((v) => !!v);
                    if (furnished_arr.length > 0) {
                        const formatArritem = furnished_arr.map((v) => mysql2_1.default.escape(v));
                        const arr_rep = formatArritem.join(",");
                        return ` (${arr_rep}) `;
                    }
                    else {
                        return ` ('') `;
                    }
                }
                return mysql2_1.default.escape(values[key]);
            }
            else {
                if (typeof formattedQuery.message === "undefined") {
                    formattedQuery.message = `Column value error : ${key} cannot be found`;
                }
                formattedQuery.success = false;
                return str;
            }
        }
        return str;
    });
    return formattedQuery;
};
//# sourceMappingURL=MySqlCon.js.map