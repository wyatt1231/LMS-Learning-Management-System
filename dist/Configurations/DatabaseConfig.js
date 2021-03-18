"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = exports.DatabaseConnection = exports.DatabaseConfig = void 0;
const mysql_1 = __importDefault(require("mysql"));
exports.DatabaseConfig = mysql_1.default.createPool({
    host: "localhost",
    user: "id16408595_mymentor",
    password: "PT8@Xq!/!L6/canD",
    database: "id16408595_lms",
    port: 3306,
});
const DatabaseConnection = () => {
    return new Promise((resolve, reject) => {
        exports.DatabaseConfig.getConnection((error, connection) => {
            if (error) {
                console.log(`error`, error);
                reject(error);
            }
            const Query = (sql, binding) => {
                return new Promise((resolve, reject) => {
                    const { success, message, query } = queryFormat(sql, binding);
                    if (!success) {
                        if (typeof message !== "undefined") {
                            return reject(message);
                        }
                    }
                    connection.query(query, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
            };
            const QueryPagination = (sql, pagination
            // binding: any,
            // sort: SqlSort,
            // page: SqlPage
            ) => {
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
          ORDER BY ${sort.column} ${sort.direction}
          LIMIT ${mysql_1.default.escape(page.begin)}, ${mysql_1.default.escape(page.limit)} `;
                    connection.query(full_query, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
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
                    connection.query(query, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result.affectedRows);
                        }
                    });
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
                    connection.query(query, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve({
                                affectedRows: result.affectedRows,
                                insertedId: result.insertId,
                            });
                        }
                    });
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
                    connection.query(query, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            if (result.length > 0) {
                                resolve(result[0]);
                            }
                            else {
                                resolve(null);
                            }
                        }
                    });
                });
            };
            const BeginTransaction = () => {
                return new Promise((resolve, reject) => {
                    connection.beginTransaction((err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                });
            };
            const Commit = () => {
                return new Promise((resolve, reject) => {
                    connection.commit((err) => {
                        connection.release();
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve();
                        }
                    });
                });
            };
            const Rollback = () => {
                return new Promise((resolve) => {
                    connection.rollback(() => {
                        connection.release();
                        resolve();
                    });
                });
            };
            const Release = () => {
                return new Promise((resolve) => {
                    resolve(connection.release());
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
    });
};
exports.DatabaseConnection = DatabaseConnection;
// const queryFormat = (query: string, values: any): QueryFormatModel => {
//   const formattedQuery: QueryFormatModel = {
//     success: true,
//     query: query,
//   };
//   formattedQuery.query = query.replace(
//     /\@(\w+)/g,
//     (str: string, key: string | Array<string>) => {
//       if (typeof key === "string") {
//         if (values.hasOwnProperty(key)) {
//           if (values[key]) {
//             return mysql.escape(values[key]);
//           } else {
//             return "(NULL)";
//           }
//         } else {
//           if (typeof formattedQuery.message === "undefined") {
//             formattedQuery.message = `Column value error : ${key} cannot be found`;
//           }
//           formattedQuery.success = false;
//           return str;
//         }
//       }
//       if (key instanceof Array) {
//         for (let i = 0; i < key.length; i++) {
//           key[i] = mysql.escape(key[i]);
//         }
//         const joined_arr = key.join(",");
//         return joined_arr;
//       }
//       return str;
//     }
//   );
//   return formattedQuery;
// };
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
                    const formatArritem = values[key].map((v) => mysql_1.default.escape(v));
                    const arr_rep = formatArritem.join(",");
                    return ` (${arr_rep}) `;
                }
                return mysql_1.default.escape(values[key]);
            }
            else {
                if (typeof formattedQuery.message === "undefined") {
                    formattedQuery.message = `Column value error : ${key} cannot be found`;
                }
                formattedQuery.success = false;
                return str;
            }
        }
        if (key instanceof Array) {
            for (let i = 0; i < key.length; i++) {
                key[i] = mysql_1.default.escape(key[i]);
            }
            const joined_arr = key.join(",");
            return joined_arr;
        }
        return str;
    });
    return formattedQuery;
};
const query = (sql, binding) => {
    return new Promise((resolve, reject) => {
        exports.DatabaseConfig.query(sql, binding, (err, result) => {
            if (err)
                reject(err);
            resolve(result);
        });
    });
};
exports.query = query;
// const generateSearch = (search_data, defaultSearch) => {
//     let finalSearchQuery = "";
//     if (!defaultSearch || defaultSearch == null) {
//       defaultSearch = "";
//     }
//     if (search_data.length > 0) {
//       let searchArray = [];
//       search_data.forEach((field) => {
//         if (field.field && field.value !== "") {
//           searchArray.push(
//             ` ${mysql.escapeId(field.key)} LIKE CONCAT('%',${pool.escape(
//               field.value
//             )},'%') `
//           );
//         }
//       });
//       var searchQuery = searchArray.join(" and ");
//       if (searchQuery.trim() !== "" && defaultSearch !== "") {
//         searchQuery = searchQuery + " and " + defaultSearch;
//       }
//       if (searchQuery.trim() !== "") {
//         searchQuery = " where " + searchQuery;
//       }
//     }
//     if (searchQuery.trim() === "" && defaultSearch.trim() !== "") {
//       return " where " + defaultSearch;
//     } else {
//       return searchQuery;
//     }
//   };
//   const generateLimit = (begin, limit) => {
//     if (limit == null || begin == null) {
//       return "";
//     }
//     const limitQuery = ` limit ${mysql.escape(begin)}, ${mysql.escape(limit)} `;
//     return limitQuery;
//   };
//   const nullableColumns = (replacementObject, listFieldToRemove) => {
//     var NULL = {
//       toSqlString: function () {
//         return "NULL";
//       },
//     };
//     for (var key of Object.keys(replacementObject)) {
//       if (
//         listFieldToRemove.includes(key) &&
//         replacementObject[key].toString().trim() === ""
//       ) {
//         // delete replacementObject[key];
//         replacementObject[key] = NULL;
//       }
//     }
//     return replacementObject;
//   };
//# sourceMappingURL=DatabaseConfig.js.map