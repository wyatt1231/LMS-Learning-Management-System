import mysql, { OkPacket, RowDataPacket } from "mysql2";
import Connection from "mysql2/typings/mysql/lib/Connection";
import { DatabaseConnectionModel, InsertModel } from "../Models/DatabaseModel";
import { PaginationModel } from "../Models/PaginationModel";

export let connection_string: mysql.PoolOptions | null = null;

if (process.env.NODE_ENV === "production") {
  connection_string = {
    host: "109.106.254.1",
    user: "u498243179_lms",
    password: "LMS@capstone2",
    database: "u498243179_lms",
    port: 3306,
  };
} else {
  connection_string = {
    host: "109.106.254.1",
    user: "u498243179_lms",
    password: "LMS@capstone2",
    database: "u498243179_lms",
    port: 3306,
  };
}

const BeginTransaction = (con: mysql.Connection) => {
  return new Promise((res, rej) => {
    con.beginTransaction((err) => {
      return rej(err);
    });

    return res(res);
  });
};

const QueryPagination = (
  sql: string,
  pagination: PaginationModel,
  connection: Connection
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
      return reject(error);
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

  return formattedQuery;
};
