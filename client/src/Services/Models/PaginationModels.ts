export interface TableFilterModel {
  search: string;
}

export interface SqlSort {
  column: string;
  direction: "asc" | "desc";
}
export interface SqlPage {
  begin: number;
  limit: number;
}

export interface PaginationModel {
  page: SqlPage;
  sort: SqlSort;
  filters: TableFilterModel;
}
