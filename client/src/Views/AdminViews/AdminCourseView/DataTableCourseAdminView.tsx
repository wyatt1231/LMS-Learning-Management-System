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
import { Formik, Form } from "formik";
import React, { FC, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import CustomAvatar from "../../../Component/CustomAvatar";
import DataTableSearch from "../../../Component/DataTableSearch";
import DataTableSort from "../../../Component/DataTableSort";
import FormikCheckbox from "../../../Component/Formik/FormikCheckbox";
import FormikDateField from "../../../Component/Formik/FormikDateField";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import { InvalidDateToDefault } from "../../../Hooks/UseDateParser";
import useFilter from "../../../Hooks/useFilter";
import CourseActions, {
  setCourseDataTableAction,
} from "../../../Services/Actions/CourseActions";
import {
  setGeneralPrompt,
  setPageLinks,
} from "../../../Services/Actions/PageActions";
import ITableColumns from "../../../Services/Interface/ITableColumns";
import ITableInitialSort from "../../../Services/Interface/ITableInitialSort";
import { CourseModel } from "../../../Services/Models/CourseModel";
import { PaginationModel } from "../../../Services/Models/PaginationModels";
import { RootStore } from "../../../Services/Store";
import { DbCourseDurations } from "../../../Storage/LocalDatabase";
import EditCourseDialog from "./EditCourseDialog";
import EditCourseImageDialog from "./EditCourseImageDialog";

interface DataTableCourseAdminViewInterface {}

const initialSearch = {
  search: "",
  est_duration: DbCourseDurations.map((d) => d.id),
  is_active: ["1", "0"],
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
    label: "Course Details",
    width: 300,
    align: "left",
  },
  {
    label: "Duration",
    width: 100,
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

export const DataTableCourseAdminView: FC<DataTableCourseAdminViewInterface> =
  memo(() => {
    const dispatch = useDispatch();

    const table_loading = useSelector(
      (store: RootStore) => store.CourseReducer.fetching_course_data_table
    );
    const data_table: Array<CourseModel> = useSelector(
      (store: RootStore) => store.CourseReducer.course_data_table?.table
    );

    const [selected_course, set_selected_course] =
      useState<null | CourseModel>(null);

    const [open_edit_course, set_open_edit_course] = useState(false);

    const [reload_data_table, set_reload_data_table] = useState(0);

    const handleOpenEditCourse = useCallback(() => {
      set_open_edit_course(true);
    }, []);
    const handleCloseEditCourse = useCallback(() => {
      set_open_edit_course(false);
    }, []);

    const [open_change_image, set_open_change_image] = useState(false);

    const handleOpenChangeCourse = useCallback(() => {
      set_open_change_image(true);
    }, []);
    const handleCloseChangeCourseImage = useCallback(() => {
      set_open_change_image(false);
    }, []);

    const handleReloadDataTable = useCallback(() => {
      set_reload_data_table((c) => c + 1);
    }, []);

    const handleToggleActiveStatus = useCallback(
      (course_pk: number) => {
        dispatch(
          setGeneralPrompt({
            open: true,
            continue_callback: () =>
              dispatch(
                CourseActions.toggleCourseStatus(course_pk, (msg: string) => {
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

        dispatch(setCourseDataTableAction(filters));
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
              link: "/admin/course",
              title: "Courses",
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
          style={{
            backgroundColor: `#fff`,
            borderRadius: 10,
            marginTop: `1em`,
            marginBottom: `1em`,
            minHeight: `90vh`,
          }}
          spacing={3}
        >
          <Grid item xs={12} container justify="flex-end" alignItems="center">
            <Grid item>
              <NavLink to="/admin/course/add">
                <Button disableElevation color="primary" variant="contained">
                  Add Course
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
                                data={DbCourseDurations}
                                color="primary"
                                name="est_duration"
                                label="Duration"
                              />
                            </Grid>

                            <Grid item xs={12}>
                              <FormikCheckbox
                                row={true}
                                color="primary"
                                data={[
                                  {
                                    id: "1",
                                    label: "Yes",
                                  },
                                  {
                                    id: "0",
                                    label: "No",
                                  },
                                ]}
                                name="is_active"
                                label="Active"
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
              <TableContainer style={{ height: "100%", minHeight: 500 }}>
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
                          <div className="table-cell-profile no-sub">
                            <CustomAvatar
                              className="image"
                              src={`${row.picture}`}
                              errorMessage={`${row.course_desc?.charAt(0)}`}
                            />
                            <div className="title">
                              <span style={{ textTransform: "capitalize" }}>
                                {row.course_desc}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{row.est_duration} mins</TableCell>
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
                            {InvalidDateToDefault(row.encoded_at, "-")}
                          </div>
                        </TableCell>

                        <TableCell align="center">
                          <IconButtonPopper
                            size="small"
                            buttons={[
                              {
                                text: "Edit Info.",
                                handleClick: () => {
                                  set_selected_course(row);
                                  handleOpenEditCourse();
                                },
                              },
                              {
                                text: "Change Image",
                                handleClick: () => {
                                  set_selected_course(row);
                                  handleOpenChangeCourse();
                                },
                              },
                              {
                                text:
                                  row.is_active === 1
                                    ? "Set to Inactive"
                                    : "Set to Active",
                                handleClick: () =>
                                  handleToggleActiveStatus(row.course_pk),
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

        {selected_course && (
          <>
            <EditCourseDialog
              initial_form_values={selected_course}
              open={open_edit_course}
              handleClose={handleCloseEditCourse}
              handleReloadDataTable={handleReloadDataTable}
            />

            <EditCourseImageDialog
              initial_form_values={selected_course}
              open={open_change_image}
              handleClose={handleCloseChangeCourseImage}
              handleReloadDataTable={handleReloadDataTable}
            />
          </>
        )}
      </Container>
    );
  });

export default DataTableCourseAdminView;
