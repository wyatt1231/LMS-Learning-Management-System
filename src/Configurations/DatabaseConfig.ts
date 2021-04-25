import mysql, { OkPacket, RowDataPacket } from "mysql2";
import { DatabaseConnectionModel, InsertModel } from "../Models/DatabaseModel";
import { PaginationModel } from "../Models/PaginationModel";

let con: mysql.PoolOptions | null = null;

if (process.env.NODE_ENV === "production") {
  con = {
    host: "31.170.167.52",
    user: "u498243179_lms",
    password: "LMS@capstone22",
    database: "u498243179_lms",
    port: 3306,
  };
} else {
  // con = {
  //   host: "sql6.freemysqlhosting.net",
  //   user: "sql6403664",
  //   password: "tZkb3jBQbm",
  //   database: "sql6403664",
  //   port: 3306,
  //   connectionLimit: 10,
  //   waitForConnections: true,
  // };
  con = {
    host: "31.170.167.52",
    user: "u498243179_lms",
    password: "LMS@capstone2",
    database: "u498243179_lms",
    port: 3306,
  };
}

export const DatabaseConnection = (): Promise<DatabaseConnectionModel> => {
  return new Promise((resolve, reject) => {
    try {
      let DatabaseConfig = mysql.createPool(con);
      DatabaseConfig.getConnection((error, connection) => {
        if (error) {
          // connection.release();
          // connection.destroy();
          return reject(error);
        }

        const Query = (
          sql: string,
          binding: any
        ): Promise<RowDataPacket[][]> => {
          return new Promise((resolve, reject) => {
            const { success, message, query } = queryFormat(sql, binding);

            if (!success) {
              if (typeof message !== "undefined") {
                return reject(message);
              }
            }

            try {
              connection.query(query, (err, result: RowDataPacket[][]) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(result);
                }
              });
            } catch (error) {
              reject(error);
            }
          });
        };

        const QueryPagination = (
          sql: string,
          pagination: PaginationModel
        ): Promise<Array<any>> => {
          return new Promise((resolve, reject) => {
            const { filters, sort, page } = pagination;
            const { success, message, query } = queryFormat(sql, filters);

            if (!success) {
              if (typeof message !== "undefined") {
                return reject(message);
              }
            }

            const full_query =
              `
            ${query} 
            ORDER BY ${sort.column} ${sort.direction}` +
              (page
                ? `
          LIMIT ${mysql.escape(page.begin)}, ${mysql.escape(page.limit)} `
                : "");

            try {
              connection.query(full_query, (err, result: RowDataPacket[][]) => {
                if (err) {
                  return reject(err);
                } else {
                  return resolve(result);
                }
              });
            } catch (error) {
              connection.destroy();
              connection.release();
              return reject(error);
            }
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
            try {
              connection.query(query, (err, result: OkPacket) => {
                if (err) {
                  return reject(err);
                } else {
                  return resolve(result.affectedRows);
                }
              });
            } catch (error) {
              connection.destroy();
              connection.release();
              return reject(error);
            }
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
            try {
              connection.query(query, (err, result: OkPacket) => {
                if (err) {
                  return reject(err);
                } else {
                  return resolve({
                    affectedRows: result.affectedRows,
                    insertedId: result.insertId,
                  });
                }
              });
            } catch (error) {
              connection.destroy();
              connection.release();
              reject(error);
            }
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

            try {
              connection.query(query, (err, result: RowDataPacket) => {
                if (err) {
                  reject(err);
                } else {
                  if (result.length > 0) {
                    // console.log(`result[0]`, result[0]);
                    return resolve(result[0]);
                  } else {
                    return resolve(null);
                  }
                }
              });
            } catch (error) {
              connection.destroy();
              connection.release();
              return reject(error);
            }
          });
        };
        const BeginTransaction = (): Promise<void> => {
          return new Promise((resolve, reject) => {
            try {
              connection.beginTransaction((err) => {
                if (err) {
                  // connection.release();
                  // connection.destroy();
                }
                resolve();
              });
            } catch (error) {
              reject(error);
            }
          });
        };
        const Commit = (): Promise<void> => {
          return new Promise((resolve, reject) => {
            try {
              connection.commit((err) => {
                connection.release();
                connection.destroy();
                resolve();
              });
            } catch (error) {
              connection.release();
              connection.destroy();
              reject(error);
            }
          });
        };
        const Rollback = (): Promise<void> => {
          return new Promise((resolve, reject) => {
            try {
              connection.rollback(() => {
                connection.release();
                connection.destroy();
                resolve();
              });
            } catch (error) {
              reject(error);
            }
          });
        };
        const Release = (): Promise<void> => {
          return new Promise((resolve, reject) => {
            try {
              connection.release();
              connection.destroy();
              resolve();
            } catch (error) {
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
    } catch (error) {
      console.log(`error ---------------------------------------`, error);
      reject(error);
    }
  });
};
interface QueryFormatModel {
  success: boolean;
  message?: string;
  query: string;
}

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
            const furnished_arr = values[key].filter((v) => !!v);

            if (furnished_arr.length > 0) {
              const formatArritem = furnished_arr.map((v) => mysql.escape(v));
              const arr_rep: string = formatArritem.join(",");
              return ` (${arr_rep}) `;
            } else {
              return ` ('') `;
            }
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

      return str;
    }
  );

  // console.log(`formattedQuery`, formattedQuery);

  return formattedQuery;
};
