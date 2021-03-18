import React, { useEffect } from "react";
import { ITableSort } from "../Interfaces/ITable";
import IServerResponse from "../Services/Interface/IServerResponse";

interface IUseDataTable {
  search: any;
  page: number;
  sort: ITableSort;
  limit: number;
  handleSetCount: (newCount: number) => void;
  handleApiFetch: (tableFilters: object) => Promise<IServerResponse>;
  handleSetTableLoading: (newLoading: boolean) => void;
  handleSetTableData: (data: Array<object>) => void;
}

const UseDataTable = (props: IUseDataTable): any => {
  const {
    search,
    page,
    limit,
    sort,
    handleSetCount,
    handleApiFetch,
    handleSetTableLoading,
    handleSetTableData,
  } = props;

  useEffect(() => {
    let mounted = true;
    const fetchTableData = async () => {
      handleSetTableLoading(true);
      const tableData = await handleApiFetch({
        search: search,
        page: page,
        limit: limit,
        sort: sort,
      });

      if (tableData.success) {
        handleSetCount(tableData.data.count);
        handleSetTableData(tableData.data.data);
        handleSetTableLoading(false);
      }
    };

    mounted && fetchTableData();

    return () => {
      mounted = false;
    };
  }, [
    handleApiFetch,
    handleSetCount,
    handleSetTableData,
    handleSetTableLoading,
    limit,
    page,
    search,
    sort,
  ]);
};

export default UseDataTable;
