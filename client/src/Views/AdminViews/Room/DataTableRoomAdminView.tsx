import {
  Button,
  Chip,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import DataTableSearch from "../../../Component/DataTableSearch";
import DataTableSort from "../../../Component/DataTableSort";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { InvalidDateTimeToDefault } from "../../../Hooks/UseDateParser";
import useFilter from "../../../Hooks/useFilter";
import {
  setGeneralPrompt,
  setPageLinks,
} from "../../../Services/Actions/PageActions";
import RoomActions, {
  setRoomDataTableAction,
} from "../../../Services/Actions/RoomActions";
import ITableColumns from "../../../Services/Interface/ITableColumns";
import ITableInitialSort from "../../../Services/Interface/ITableInitialSort";
import { PaginationModel } from "../../../Services/Models/PaginationModels";
import { RoomModel } from "../../../Services/Models/RoomModel";
import { RootStore } from "../../../Services/Store";
import EditRoomDialog from "./EditRoomDialog";

interface DataTableRoomAdminViewInterface {}

const initialSearch = {
  search: "",
};

const initialTableSort: Array<ITableInitialSort> = [
  {
    label: "Newest first",
    value: {
      column: "encoded_at",
      direction: "desc",
    },
  },
  {
    label: "Oldest first",
    value: {
      column: "encoded_at",
      direction: "asc",
    },
  },
  {
    label: "A-Z",
    value: {
      column: "course_desc",
      direction: "asc",
    },
  },
  {
    label: "Z-A",
    value: {
      column: "course_desc",
      direction: "desc",
    },
  },
];

const tableColumns: Array<ITableColumns> = [
  {
    label: "Room",
    width: 300,
    align: "left",
  },
  {
    label: "Notes",
    width: 150,
    align: "left",
  },
  {
    label: "Active",
    width: 50,
    align: "left",
  },
  {
    label: "Encoded At",
    width: 150,
    align: "left",
  },
  {
    label: "Actions",
    width: 50,
    align: "center",
  },
];

export const DataTableRoomAdminView: FC<DataTableRoomAdminViewInterface> = memo(
  () => {
    const dispatch = useDispatch();

    const table_loading = useSelector(
      (store: RootStore) => store.RoomReducer.fetching_room_data_table
    );
    const data_table: Array<RoomModel> = useSelector(
      (store: RootStore) => store.RoomReducer.room_data_table?.table
    );

    const [selected_room, set_selected_room] = useState<RoomModel | null>(null);
    const [open_edit_room_dialog, set_open_edit_room_dialog] = useState(false);

    const handleOpenRoomDialog = useCallback(() => {
      set_open_edit_room_dialog(true);
    }, []);

    const handleCloseRoomDialog = useCallback(() => {
      set_open_edit_room_dialog(false);
    }, []);

    const [reload_data_table, set_reload_data_table] = useState(0);
    const handleReloadDataTable = useCallback(() => {
      set_reload_data_table((c) => c + 1);
    }, []);

    const handleToggleRoomStatus = useCallback(
      (course_pk: number) => {
        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                RoomActions.toggleRoomStatus(course_pk, (msg: string) => {
                  handleReloadDataTable();
                })
              ),
          })
        );
      },
      [dispatch, handleReloadDataTable]
    );

    const [
      tableSearch,
      tableLimit,
      tablePage,
      tableCount,
      activeSort,
      searchField,
      selectedSortIndex,
      handleSetTableSearch,
      handleChangePage,
      handleChangeRowsPerPage,
      handleChagenSelectedSortIndex,
      handleSetSearchField,
    ] = useFilter(initialSearch, initialTableSort, 50);

    useEffect(() => {
      let mounted = true;
      const fetchTableData = () => {
        const filters: PaginationModel = {
          page: {
            begin: tablePage,
            limit: tableLimit,
          },
          sort: activeSort,
          filters: tableSearch,
        };

        dispatch(setRoomDataTableAction(filters));
      };

      mounted && activeSort && fetchTableData();

      return () => {
        mounted = false;
      };
    }, [
      activeSort,
      dispatch,
      tableLimit,
      tablePage,
      tableSearch,
      reload_data_table,
    ]);

    useEffect(() => {
      let mounted = true;

      const initializingState = () => {
        dispatch(
          setPageLinks([
            {
              link: "/admin/room",
              title: "Rooms",
            },
          ])
        );
      };

      mounted && initializingState();
      return () => {
        mounted = false;
      };
    }, [dispatch]);

    return (
      <Container maxWidth="lg">
        <Grid
          container
          spacing={3}
          style={{
            backgroundColor: `#fff`,
            borderRadius: 10,
            marginTop: `1em`,
            marginBottom: `1em`,
            minHeight: `90vh`,
          }}
        >
          <Grid item xs={12} container justify="flex-end" alignItems="center">
            <Grid item>
              <NavLink to="/admin/room/add">
                <Button disableElevation color="primary" variant="contained">
                  Add Room
                </Button>
              </NavLink>
            </Grid>
          </Grid>
          <Grid
            xs={12}
            item
            container
            spacing={1}
            alignItems="center"
            alignContent="center"
          >
            <Grid
              item
              xs={12}
              md={6}
              container
              spacing={2}
              justify="flex-start"
              alignContent="center"
              alignItems="center"
            >
              <Grid item>
                <TablePagination
                  rowsPerPageOptions={[50, 100, 250]}
                  component="div"
                  count={tableCount}
                  rowsPerPage={tableLimit}
                  page={tablePage}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Grid>
            </Grid>
            <Grid
              item
              xs={12}
              md={6}
              container
              spacing={3}
              alignContent="center"
              alignItems="center"
              justify="flex-end"
            >
              <Grid item>
                <DataTableSort
                  handleChagenSelectedSortIndex={handleChagenSelectedSortIndex}
                  initialTableSort={initialTableSort}
                  selectedSortIndex={selectedSortIndex}
                />
              </Grid>

              <Grid item>
                <DataTableSearch
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSetTableSearch({
                      ...tableSearch,
                      search: searchField,
                    });
                  }}
                  handleSetSearchField={handleSetSearchField}
                  searchField={searchField}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid xs={12} container item spacing={1}>
            <Grid item xs={12}>
              <TableContainer style={{ minHeight: 500, borderRadius: 10 }}>
                <LinearLoadingProgress show={table_loading} />
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      {tableColumns.map((col, index) => (
                        <TableCell
                          key={index}
                          align={col.align}
                          style={{ minWidth: col.width }}
                        >
                          {col.label}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data_table?.length < 1 && (
                      <TableRow>
                        <TableCell align="center" colSpan={5}>
                          <span className="empty-rows">
                            No records has been added yet
                          </span>
                        </TableCell>
                      </TableRow>
                    )}
                    {data_table?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <span style={{ fontWeight: 500 }}>
                            {row.room_desc}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Tooltip title={row.notes ? "-" : "row.notes"}>
                            <span
                              style={{
                                whiteSpace: `nowrap`,
                                overflow: `hidden`,
                                textOverflow: `ellipsis`,
                                fontSize: ".8em",
                              }}
                            >
                              {row.notes}
                            </span>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={row.is_active === 1 ? "Yes" : "No"}
                            style={{
                              backgroundColor:
                                row.is_active === 1 ? "#0d47a1" : "#d50000",
                              color:
                                row.is_active === 1 ? "#e3f2fd" : "#ffebee",
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <div className="datetime">
                            {InvalidDateTimeToDefault(row.encoded_at, "-")}
                          </div>
                        </TableCell>
                        <TableCell align="center">
                          <IconButtonPopper
                            size="small"
                            buttons={[
                              {
                                text: "Edit Info.",
                                handleClick: () => {
                                  set_selected_room(row);
                                  handleOpenRoomDialog();
                                },
                              },
                              {
                                text:
                                  row.is_active === 1
                                    ? "Set to Inactive"
                                    : "Set to Active",
                                handleClick: () => {
                                  handleToggleRoomStatus(row.room_pk);
                                },
                              },
                            ]}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>

        {selected_room && (
          <EditRoomDialog
            initial_form_values={selected_room}
            open={open_edit_room_dialog}
            handleClose={handleCloseRoomDialog}
            handleReloadDataTable={handleReloadDataTable}
          />
        )}
      </Container>
    );
  }
);

export default DataTableRoomAdminView;
