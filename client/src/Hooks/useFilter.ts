import { useCallback, useEffect, useState } from "react";

const useFilter = (
  defaultSearch: any,
  initialTableSort: any,
  initialLimit: any
) => {
  const [tableSearch, setTableSearch] = useState(defaultSearch);
  const [searchField, setSearchField] = useState("");
  const [tableLimit, setTableLimit] = useState(
    typeof initialLimit === "number" ? initialLimit : 25
  );
  const [tablePage, setTablePage] = useState(0);
  const [tableCount, setTableCount] = useState(0);

  if (initialTableSort.length <= 0) {
    console.error(`please make sure that the sort has value`);
  }

  const [selectedSortIndex, setSelectedSortIndex] = useState(0);
  const [activeSort, setActiveSort] = useState(null);

  const handleChagenSelectedSortIndex = useCallback((index) => {
    setSelectedSortIndex(index);
  }, []);

  const handleSetSearchField = useCallback((value) => {
    setSearchField(value);
  }, []);

  const handleSetTableSearch = useCallback((newState) => {
    setTableSearch(newState);
  }, []);

  const handleSetLimit = useCallback((newLimit) => {
    setTableLimit(newLimit);
  }, []);

  const handleSetPage = useCallback((newPage) => {
    setTablePage(newPage);
  }, []);

  const handleSetCount = useCallback((newCount) => {
    setTableCount(newCount);
  }, []);

  const handleChangePage = useCallback(
    (event, page) => {
      handleSetPage(page);
    },
    [handleSetPage]
  );

  const handleChangeRowsPerPage = useCallback(
    (event) => {
      if (typeof event.target.value !== "undefined") {
        handleSetLimit(parseInt(event.target.value));
        handleSetPage(0);
      }
    },
    [handleSetLimit, handleSetPage]
  );

  useEffect(() => {
    let mounted = true;

    const generateSearchFilters = () => {
      const foundSortItem = initialTableSort[selectedSortIndex];

      if (foundSortItem) {
        if (foundSortItem?.value) {
          setActiveSort(foundSortItem?.value);
        }
      }
    };

    mounted && generateSearchFilters();

    return () => {
      mounted = false;
    };
  }, [initialTableSort, selectedSortIndex]);

  return [
    tableSearch,
    tableLimit,
    tablePage,
    tableCount,
    activeSort,
    searchField,
    selectedSortIndex,
    handleSetTableSearch,
    // handleSetLimit,
    // handleSetPage,
    // handleSetCount,
    handleChangePage,
    handleChangeRowsPerPage,
    handleChagenSelectedSortIndex,
    handleSetSearchField,
  ];
};

export default useFilter;
