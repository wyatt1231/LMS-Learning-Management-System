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
          gridGap: `.7em`,
        }}
      >
        <div
          style={{
            fontWeight: 500,
            fontSize: `.9em`,
          }}
        >
          Sort By:
        </div>

        <TextField
          InputLabelProps={{
            shrink: true,
          }}
          select
          // size="small"
          fullWidth
          value={selectedSortIndex}
          style={{ width: 150 }}
          SelectProps={{
            disableUnderline: true,
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
