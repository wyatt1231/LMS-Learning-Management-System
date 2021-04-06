import {
  Avatar,
  Button,
  Container,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@material-ui/core";
import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import CustomAvatar from "../../../Component/CustomAvatar";
import DataTableSearch from "../../../Component/DataTableSearch";
import DataTableSort from "../../../Component/DataTableSort";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { InvalidDateToDefault } from "../../../Hooks/UseDateParser";
import useFilter from "../../../Hooks/useFilter";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import { setTutorDataTableAction } from "../../../Services/Actions/TutorActions";
import ITableColumns from "../../../Services/Interface/ITableColumns";
import ITableInitialSort from "../../../Services/Interface/ITableInitialSort";
import { PaginationModel } from "../../../Services/Models/PaginationModels";
import { TutorModel } from "../../../Services/Models/TutorModels";
import { RootStore } from "../../../Services/Store";

interface DataTableAdminTutorViewInterface {}

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
      column: "firstname",
      direction: "asc",
    },
  },
  {
    label: "Z-A",
    value: {
      column: "firstname",
      direction: "desc",
    },
  },
];

const tableColumns: Array<ITableColumns> = [
  {
    label: "Profile",
    width: 250,
    align: "left",
  },
  {
    label: "Email Address",
    width: 150,
    align: "left",
  },
  {
    label: "Mobile Number",
    width: 90,
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
];

export const DataTableAdminTutorView: FC<DataTableAdminTutorViewInterface> = memo(
  () => {
    const dispatch = useDispatch();

    const table_loading = useSelector(
      (store: RootStore) => store.TutorReducer.fetching_tutor_data_table
    );
    const tutor_table: Array<TutorModel> = useSelector(
      (store: RootStore) => store.TutorReducer.tutor_data_table?.table
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

        dispatch(setTutorDataTableAction(filters));
      };

      mounted && activeSort && fetchTableData();

      return () => {
        mounted = false;
      };
    }, [activeSort, dispatch, tableLimit, tablePage, tableSearch]);

    useEffect(() => {
      let mounted = true;

      const initializingState = () => {
        dispatch(
          setPageLinks([
            {
              link: "/admin/tutors",
              title: "Tutors",
            },
          ])
        );
      };

      mounted && initializingState();
      return () => (mounted = false);
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
              <NavLink to="/admin/tutor/add">
                <Button disableElevation color="primary" variant="contained">
                  Add Tutor
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
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
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

          <Grid
            xs={12}
            container
            item
            spacing={1}
            style={{ height: `100%`, overflowX: "auto" }}
          >
            <Grid item xs={12}>
              <TableContainer
                style={{ height: "100%", minHeight: 500, borderRadius: 10 }}
              >
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
                    {tutor_table?.length < 1 && (
                      <TableRow>
                        <TableCell align="center" colSpan={5}>
                          <span className="empty-rows">
                            No records has been added yet
                          </span>
                        </TableCell>
                      </TableRow>
                    )}
                    {tutor_table?.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="table-cell-profile">
                            <CustomAvatar
                              className="image"
                              src={`${row.picture}`}
                              errorMessage={`${row.firstname?.charAt(
                                0
                              )}${row.lastname?.charAt(0)}`}
                            />
                            <NavLink
                              className="title"
                              to={`/admin/tutor/${row.tutor_pk}/calendar`}
                            >
                              <span style={{ textTransform: "capitalize" }}>
                                {row.prefix} {row.firstname} {row.middlename}{" "}
                                {row.lastname} {row.suffix}
                              </span>
                            </NavLink>
                            <div className="sub-title">{row.position}</div>
                          </div>
                        </TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.mob_no}</TableCell>
                        <TableCell>
                          <div className="grid-justify-start">
                            <span className="badge badge-blue">
                              {row.is_active === "y" ? "Yes" : "No"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="datetime">
                            {InvalidDateToDefault(row.encoded_at, "-")}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }
);

export default DataTableAdminTutorView;
