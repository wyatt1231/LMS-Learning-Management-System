import mysql, { OkPacket, RowDataPacket } from "mysql";
import { DatabaseConnectionModel, InsertModel } from "../Models/DatabaseModel";
import { PaginationModel } from "../Models/PaginationModel";

let DatabaseConfig: mysql.PoolOptions | null = null;

// export const DatabaseConfig = mysql.createPool({
//   host: "us-cdbr-east-03.cleardb.com",
//   user: "b25793f72a1e8c",
//   password: "7b71cb24",
//   database: "heroku_fda4a2166dd220a",
//   port: 3306,
// });

if (process.env.NODE_ENV === "production") {
  console.log(`prod`);
  DatabaseConfig = {
    host: "sql6.freemysqlhosting.net",
    user: "sql6403664",
    password: "tZkb3jBQbm",
    database: "sql6403664",
    port: 3306,
  };
} else {
  console.log(`dev`);
  DatabaseConfig = {
    host: "localhost",
    user: "root",
    password: "root sa",
    database: "lms",
    port: 3309,
  };
}

export const DatabaseConnection = (): Promise<DatabaseConnectionModel> => {
  return new Promise((resolve, reject) => {
    DatabaseConfig.getConnection((error, connection) => {
      if (error) {
        console.log(`error`, error);
        reject(error);
      }

      const Query = (sql: string, binding: any): Promise<RowDataPacket[][]> => {
        return new Promise((resolve, reject) => {
          const { success, message, query } = queryFormat(sql, binding);

          if (!success) {
            if (typeof message !== "undefined") {
              return reject(message);
            }
          }

          connection.query(query, (err, result: RowDataPacket[][]) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      };

      const QueryPagination = (
        sql: string,
        pagination: PaginationModel
        // binding: any,
        // sort: SqlSort,
        // page: SqlPage
      ): Promise<Array<any>> => {
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
          LIMIT ${mysql.escape(page.begin)}, ${mysql.escape(page.limit)} `;

          connection.query(full_query, (err, result: RowDataPacket[][]) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        });
      };

      const Modify = (sql: string, binding: any): Promise<number> => {
        return new Promise((resolve, reject) => {
          const { success, message, query } = queryFormat(sql, binding);

          if (!success) {
            if (typeof message !== "undefined") {
              return reject(message);
            }
          }

          connection.query(query, (err, result: OkPacket) => {
            if (err) {
              reject(err);
            } else {
              resolve(result.affectedRows);
            }
          });
        });
      };

      const Insert = (sql: string, binding: any): Promise<InsertModel> => {
        return new Promise((resolve, reject) => {
          const { success, message, query } = queryFormat(sql, binding);

          if (!success) {
            if (typeof message !== "undefined") {
              return reject(message);
            }
          }

          connection.query(query, (err, result: OkPacket) => {
            if (err) {
              reject(err);
            } else {
              resolve({
                affectedRows: result.affectedRows,
                insertedId: result.insertId,
              });
            }
          });
        });
      };

      const QuerySingle = (sql: string, binding: any): Promise<any> => {
        return new Promise((resolve, reject) => {
          const { success, message, query } = queryFormat(sql, binding);

          if (!success) {
            if (typeof message !== "undefined") {
              return reject(message);
            }
          }

          connection.query(query, (err, result: RowDataPacket) => {
            if (err) {
              reject(err);
            } else {
              if (result.length > 0) {
                resolve(result[0]);
              } else {
                resolve(null);
              }
            }
          });
        });
      };

      const BeginTransaction = (): Promise<void> => {
        return new Promise((resolve, reject) => {
          connection.beginTransaction((err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      };

      const Commit = (): Promise<void> => {
        return new Promise((resolve, reject) => {
          connection.commit((err) => {
            connection.release();
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        });
      };

      const Rollback = (): Promise<void> => {
        return new Promise((resolve) => {
          connection.rollback(() => {
            connection.release();
            resolve();
          });
        });
      };

      const Release = (): Promise<void> => {
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

interface QueryFormatModel {
  success: boolean;
  message?: string;
  query: string;
}

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

const queryFormat = (query: string, values: any): QueryFormatModel => {
  const formattedQuery: QueryFormatModel = {
    success: true,
    query: query,
  };

  formattedQuery.query = query.replace(
    /\@(\w+)/g,
    (str: string, key: string | Array<string>) => {
      if (typeof key === "string") {
        if (values.hasOwnProperty(key)) {
          if (values[key] === null || typeof values[key] === "undefined") {
            return "(NULL)";
          }

          if (values[key] instanceof Array) {
            const formatArritem = values[key].map((v) => mysql.escape(v));
            const arr_rep: string = formatArritem.join(",");
            return ` (${arr_rep}) `;
          }

          return mysql.escape(values[key]);
        } else {
          if (typeof formattedQuery.message === "undefined") {
            formattedQuery.message = `Column value error : ${key} cannot be found`;
          }
          formattedQuery.success = false;
          return str;
        }
      }

      if (key instanceof Array) {
        for (let i = 0; i < key.length; i++) {
          key[i] = mysql.escape(key[i]);
        }
        const joined_arr = key.join(",");

        return joined_arr;
      }

      return str;
    }
  );

  return formattedQuery;
};

export const query = (sql: any, binding: any) => {
  return new Promise((resolve, reject) => {
    DatabaseConfig.query(sql, binding, (err: any, result: any) => {
      if (err) reject(err);
      resolve(result);
    });
  });
};

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
