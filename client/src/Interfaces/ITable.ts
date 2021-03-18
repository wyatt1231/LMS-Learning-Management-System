export interface ITableFilter {
  search: object;
  sort: ITableSort;
  limit: number;
  page: number;
}

export interface ITableSearchColumn {
  field: string;
  value: string;
}

export interface ITableSort {
  key: string;
  direction: string;
}

export interface ITableData {
  data: object;
  totalFiltered: number;
  currentPage: number;
  pageCount: number;
}

export interface IColumnItem {
  active: boolean;
  label: any;
  key: string;
  direction?: "desc" | "asc" | undefined;
  align?: "left" | "center" | "right" | "justify" | "inherit" | undefined;
  padding?: "none" | "default" | "checkbox";
  sortDirection?: false | "desc" | "asc";
  minWidth?: string;
}
