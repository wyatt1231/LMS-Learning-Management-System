import mysql from "mysql2";
import { parseInvalidDateToDefault } from "./useDateParser";

const DateWhereClause = (column_name: string, sign: string, value: string) => {
  if (!!column_name && !!value && !!sign) {
    let where = "";

    const date = parseInvalidDateToDefault(value);

    where =
      where +
      ` AND DATE(${column_name}) ${sign} ${
        !!date ? mysql.escape(date) : column_name
      } `;

    console.log(`where`, where);
    return where;
  }

  return "";
};

export default {
  DateWhereClause,
};
