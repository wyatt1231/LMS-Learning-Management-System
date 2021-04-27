"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseConnection = void 0;
const mysql2_1 = __importDefault(require("mysql2"));
let con = null;
if (process.env.NODE_ENV === "production") {
    con = {
        host: "109.106.254.1",
        user: "u498243179_lms",
        password: "LMS@capstone2",
        database: "u498243179_lms",
        port: 3306,
    };
}
else {
    con = {
        host: "109.106.254.1",
        user: "u498243179_lms",
        password: "LMS@capstone2",
        database: "u498243179_lms",
        port: 3306,
    };
}
const DatabaseConnection = () => {
    return new Promise((resolve, reject) => {
        try {
            let DatabaseConfig = mysql2_1.default.createPool(con);
            DatabaseConfig.getConnection((error, connection) => {
                if (error) {
                    // connection.release();
                    // connection.destroy();
                    return reject(error);
                }
                const Query = (sql, binding) => {
                    return new Promise((resolve, reject) => {
                        const { success, message, query } = queryFormat(sql, binding);
                        if (!success) {
                            if (typeof message !== "undefined") {
                                return reject(message);
                            }
                        }
                        try {
                            connection.query(query, (err, result) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    resolve(result);
                                }
                            });
                        }
                        catch (error) {
                            reject(error);
                        }
                    });
                };
                const QueryPagination = (sql, pagination) => {
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
                            connection.release();
                            return reject(error);
                        }
                    });
                };
                const Modify = (sql, binding) => {
                    return new Promise((resolve, reject) => {
                        const { success, message, query } = queryFormat(sql, binding);
                        if (!success) {
                            if (typeof message !== "undefined") {
                                return reject(message);
                            }
                        }
                        try {
                            connection.query(query, (err, result) => {
                                if (err) {
                                    return reject(err);
                                }
                                else {
                                    return resolve(result.affectedRows);
                                }
                            });
                        }
                        catch (error) {
                            connection.destroy();
                            connection.release();
                            return reject(error);
                        }
                    });
                };
                const Insert = (sql, binding) => {
                    return new Promise((resolve, reject) => {
                        const { success, message, query } = queryFormat(sql, binding);
                        if (!success) {
                            if (typeof message !== "undefined") {
                                return reject(message);
                            }
                        }
                        try {
                            connection.query(query, (err, result) => {
                                if (err) {
                                    return reject(err);
                                }
                                else {
                                    return resolve({
                                        affectedRows: result.affectedRows,
                                        insertedId: result.insertId,
                                    });
                                }
                            });
                        }
                        catch (error) {
                            connection.destroy();
                            connection.release();
                            reject(error);
                        }
                    });
                };
                const QuerySingle = (sql, binding) => {
                    return new Promise((resolve, reject) => {
                        const { success, message, query } = queryFormat(sql, binding);
                        if (!success) {
                            if (typeof message !== "undefined") {
                                return reject(message);
                            }
                        }
                        try {
                            connection.query(query, (err, result) => {
                                if (err) {
                                    reject(err);
                                }
                                else {
                                    if (result.length > 0) {
                                        return resolve(result[0]);
                                    }
                                    else {
                                        return resolve(null);
                                    }
                                }
                            });
                        }
                        catch (error) {
                            connection.destroy();
                            connection.release();
                            return reject(error);
                        }
                    });
                };
                const BeginTransaction = () => {
                    return new Promise((resolve, reject) => {
                        try {
                            connection.beginTransaction((err) => {
                                if (err) {
                                    // connection.release();
                                    // connection.destroy();
                                }
                                resolve();
                            });
                        }
                        catch (error) {
                            reject(error);
                        }
                    });
                };
                const Commit = () => {
                    return new Promise((resolve, reject) => {
                        try {
                            connection.commit((err) => {
                                connection.release();
                                connection.destroy();
                                resolve();
                            });
                        }
                        catch (error) {
                            connection.release();
                            connection.destroy();
                            reject(error);
                        }
                    });
                };
                const Rollback = () => {
                    return new Promise((resolve, reject) => {
                        try {
                            connection.rollback(() => {
                                connection.release();
                                connection.destroy();
                                resolve();
                            });
                        }
                        catch (error) {
                            reject(error);
                        }
                    });
                };
                const Release = () => {
                    return new Promise((resolve, reject) => {
                        try {
                            connection.release();
                            connection.destroy();
                            resolve();
                        }
                        catch (error) {
                            reject(error);
                        }
                    });
                };
                resolve({
                    Release,
                    Commit,
                    Rollback,
                    BeginTransaction,
                    Query,
                    QuerySingle,
                    QueryPagination,
                    Modify,
                    Insert,
                });
            });
        }
        catch (error) {
            reject(error);
        }
    });
};
exports.DatabaseConnection = DatabaseConnection;
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
//# sourceMappingURL=DatabaseConfig.js.map