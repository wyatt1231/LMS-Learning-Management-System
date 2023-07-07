import { MenuItem, TextField } from "@material-ui/core";
import React, { memo, FC } from "react";

interface IDataTableSort {
  selectedSortIndex: string | number;
  handleChagenSelectedSortIndex: (e: any) => void;
  initialTableSort: any;
}

export const DataTableSort: FC<IDataTableSort> = memo(
  ({ selectedSortIndex, handleChagenSelectedSortIndex, initialTableSort }) => {
    return (
      <div
        style={{
          display: `grid`,
          gridAutoFlow: "column",
          alignItems: `center`,
          alignContent: `center`,
          gridGap: `.5em`,
          justifyContent: `start`,
          justifyItems: `start`,
          gridAutoColumns: `auto 120px`,
        }}
      >
        <div
          style={{
            fontWeight: 400,
            fontSize: `.87em`,
          }}
        >
          Order By:
        </div>

        <TextField
          select
          fullWidth
          value={selectedSortIndex}
          SelectProps={{
            disableUnderline: true,
            style: {
              fontSize: `.87em`,
            },
          }}
          style={{
            minWidth: 100,
          }}
          onChange={(e) => {
            handleChagenSelectedSortIndex(e.target.value);
          }}
        >
          {initialTableSort.map((sort, index) => (
            <MenuItem key={index} className="sort-item" value={index}>
              {sort.label}
            </MenuItem>
          ))}
        </TextField>
      </div>
    );
  }
);

export default DataTableSort;
