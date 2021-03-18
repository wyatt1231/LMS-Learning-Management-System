interface ITableSortValue {
  column: string;
  direction: string;
}

interface ITableInitialSort {
  label: string;
  value: ITableSortValue;
}

export default ITableInitialSort;
