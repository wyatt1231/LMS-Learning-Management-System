import { PaginationModel } from "./PaginationModel";

export interface DatabaseConnectionModel {
  Release: () => Promise<void>;
  BeginTransaction: () => Promise<void>;
  Commit: () => Promise<void>;
  Rollback: () => Promise<void>;
  Query: (sql: string, binding: any) => Promise<Array<any>>;
  QuerySingle: (sql: string, binding: any) => Promise<any>;
  QueryPagination: (
    sql: string,
    pagination: PaginationModel
    // binding: any,
    // sort: SqlSort,
    // page: SqlPage
  ) => Promise<Array<any>>;
  Insert: (sql: string, binding: any) => Promise<InsertModel>;
  Modify: (sql: string, binding: any) => Promise<number>;
}

export interface InsertModel {
  affectedRows: number;
  insertedId: number;
}
