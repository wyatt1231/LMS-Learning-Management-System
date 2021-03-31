import {
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton,
} from "@material-ui/core";
import React, { memo, FC } from "react";
import SearchRoundedIcon from "@material-ui/icons/SearchRounded";

interface IDataTableSearch {
  onSubmit: (values: any) => void;
  handleSetSearchField: (value: string) => void;
  searchField: string;
}

export const DataTableSearch: FC<IDataTableSearch> = memo(
  ({ onSubmit, searchField, handleSetSearchField }) => {
    return (
      <form onSubmit={onSubmit}>
        <FormControl fullWidth variant="outlined" size="small">
          <OutlinedInput
            style={{ borderRadius: `30px` }}
            id="outlined-adornment-amount"
            placeholder="Enter the keywords to search"
            endAdornment={
              <InputAdornment position="start">
                <IconButton type="submit">
                  <SearchRoundedIcon color="primary" />
                </IconButton>
              </InputAdornment>
            }
            autoFocus
            value={searchField}
            onChange={(e) => {
              handleSetSearchField(e.target.value);
            }}
          />
        </FormControl>
      </form>
    );
  }
);

export default DataTableSearch;
