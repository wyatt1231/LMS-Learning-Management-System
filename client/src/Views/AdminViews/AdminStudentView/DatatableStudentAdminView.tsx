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
} from "@material-ui/core";
import { Formik, Form } from "formik";
import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import CustomAvatar from "../../../Component/CustomAvatar";
import DataTableSearch from "../../../Component/DataTableSearch";
import DataTableSort from "../../../Component/DataTableSort";
import FormikCheckbox from "../../../Component/Formik/FormikCheckbox";
import FormikDateField from "../../../Component/Formik/FormikDateField";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { InvalidDateToDefault } from "../../../Hooks/UseDateParser";
import useFilter from "../../../Hooks/useFilter";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import { setStudentDataTableApi } from "../../../Services/Actions/StudentActions";
import ITableColumns from "../../../Services/Interface/ITableColumns";
import ITableInitialSort from "../../../Services/Interface/ITableInitialSort";
import { PaginationModel } from "../../../Services/Models/PaginationModels";
import { StatusMasterModel } from "../../../Services/Models/StatusMasterModel";
import { StudentModel } from "../../../Services/Models/StudentModel";
import { RootStore } from "../../../Services/Store";

interface DataTableStudentAdminViewInterface {}

const initialSearch = {
  search: "",
  grade: ["11", "12"],
  sts_pk: ["FA", "A"],
  encoded_from: null,
  encoded_to: null,
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
    label: "Status",
    width: 50,
    align: "left",
  },
  {
    label: "Encoded At",
    width: 150,
    align: "left",
  },
];

export const DataTableStudentAdminView: FC<DataTableStudentAdminViewInterface> =
  memo(() => {
    const dispatch = useDispatch();

    const table_loading = useSelector(
      (store: RootStore) => store.StudentReducer.fetching_student_data_table
    );
    const data_table: Array<StudentModel & StatusMasterModel> = useSelector(
      (store: RootStore) => store.StudentReducer.student_data_table?.table
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

        dispatch(setStudentDataTableApi(filters));
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
              link: "/admin/student",
              title: "Students",
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
                  FilterComponent={
                    <Formik
                      initialValues={tableSearch}
                      enableReinitialize
                      onSubmit={(form_values) => {
                        const filter_payload = {
                          ...form_values,
                          search: tableSearch.search,
                        };

                        handleSetTableSearch(filter_payload);
                      }}
                    >
                      {() => (
                        <Form className="form">
                          <Grid container spacing={3}>
                            <Grid item xs={12}>
                              <FormikCheckbox
                                row={true}
                                data={[
                                  {
                                    id: "11",
                                    label: "Grade 11",
                                  },
                                  {
                                    id: "12",
                                    label: "Grade 12",
                                  },
                                ]}
                                color="primary"
                                name="grade"
                                label="Grade Level"
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <FormikCheckbox
                                row={true}
                                color="primary"
                                data={[
                                  {
                                    id: "FA",
                                    label: "for approval",
                                  },
                                  {
                                    id: "A",
                                    label: "approved",
                                  },
                                ]}
                                name="sts_pk"
                                label="Status"
                              />
                            </Grid>

                            <Grid item xs={6}>
                              <FormikDateField
                                name="encoded_from"
                                clearable={true}
                                label="Encoded From"
                              />
                            </Grid>
                            <Grid item xs={6}>
                              <FormikDateField
                                name="encoded_to"
                                clearable={true}
                                label="Encoded To"
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <Grid container spacing={2} justify="flex-end">
                                <Grid item>
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    type="button"
                                    onClick={() => {
                                      const filter_payload = {
                                        ...initialSearch,
                                        search: tableSearch.search,
                                      };
                                      handleSetTableSearch(filter_payload);
                                    }}
                                  >
                                    Clear Filters
                                  </Button>
                                </Grid>
                                <Grid item>
                                  <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                  >
                                    Apply Filters
                                  </Button>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </Form>
                      )}
                    </Formik>
                  }
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
                    {data_table?.length < 1 && (
                      <TableRow>
                        <TableCell align="center" colSpan={5}>
                          <span className="empty-rows">No records found.</span>
                        </TableCell>
                      </TableRow>
                    )}
                    {data_table?.map((row, index) => (
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
                              to={`/admin/student/${row.student_pk}/calendar`}
                            >
                              <span style={{ textTransform: "capitalize" }}>
                                {row.firstname} {row.middlename} {row.lastname}{" "}
                                {row.suffix}
                              </span>
                            </NavLink>
                            <div className="sub-title">Grade {row.grade}</div>
                          </div>
                        </TableCell>
                        <TableCell>{row.email}</TableCell>
                        <TableCell>{row.mob_no}</TableCell>
                        <TableCell>
                          <div className="grid-justify-start">
                            <span className="badge badge-blue">
                              <Chip
                                style={{
                                  backgroundColor: `${row?.sts_bgcolor}`,
                                  color: row?.sts_color,
                                  fontSize: `.87em`,
                                }}
                                label={row.sts_desc}
                              />
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
  });

export default DataTableStudentAdminView;
