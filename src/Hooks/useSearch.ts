import mysql from "mysql2";
export const GenerateSearch = (search: string, column: string): string => {
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
      sql + ` ${column} LIKE CONCAT('%',${mysql.escape(searchArray[i])},'%') `;
  }

  return sql;
};
