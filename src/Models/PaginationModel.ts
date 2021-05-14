export interface TableFilterModel {
  search: string;
}

export interface SqlSort {
  column: string;
  direction: "ASC" | "DESC";
}
export interface SqlPage {
  begin: number;
  limit: number;
}

export interface PaginationModel {
  page: SqlPage;
  sort: SqlSort;
  filters: any;
}

export interface DataTableResult {
  limit: number;
  page: number;
  count: number;
  table: any;
}
