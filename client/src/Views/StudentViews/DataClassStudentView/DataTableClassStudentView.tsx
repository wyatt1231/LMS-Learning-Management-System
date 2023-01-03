import {
  Button,
  Container,
  Grid,
  Paper,
  TablePagination,
} from "@material-ui/core";
import moment from "moment";
import React, { FC, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import CustomAvatar from "../../../Component/CustomAvatar";
import DataTableSearch from "../../../Component/DataTableSearch";
import DataTableSort from "../../../Component/DataTableSort";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import {
  InvalidDateToDefault,
  parseTimeOrDefault,
} from "../../../Hooks/UseDateParser";
import useFilter from "../../../Hooks/useFilter";
import {
  setStudentEnrolledClassTable,
  setStudentUnenrolledClassTable,
} from "../../../Services/Actions/ClassActions";
import ClassStudentActions from "../../../Services/Actions/ClassStudentActions";
import {
  setGeneralPrompt,
  setPageLinks,
} from "../../../Services/Actions/PageActions";
import ITableInitialSort from "../../../Services/Interface/ITableInitialSort";
import { ClassModel } from "../../../Services/Models/ClassModel";
import { ClassStudentModel } from "../../../Services/Models/ClassStudentModel";
import { PaginationModel } from "../../../Services/Models/PaginationModels";
import { StatusMasterModel } from "../../../Services/Models/StatusMasterModel";
import { RootStore } from "../../../Services/Store";
import {
  StyledClassContainer,
  StyledEnrolledClass,
} from "../../../Styles/GlobalStyles";

interface DataTableClassAdminInterface {}

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
      column: "class_desc",
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

export const DataTableClassStudentView: FC<DataTableClassAdminInterface> = memo(
  () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const table_loading = useSelector(
      (store: RootStore) =>
        store.ClassReducer.fetch_student_unenrolled_class_table
    );
    const data_table: Array<ClassModel & StatusMasterModel> = useSelector(
      (store: RootStore) =>
        store.ClassReducer.student_unenrolled_class_table?.table
    );

    const enrolled_courses_table: Array<ClassModel> = useSelector(
      (store: RootStore) => store.ClassReducer.student_enrolled_class_table
    );
    const fetch_enrolled_courses_table = useSelector(
      (store: RootStore) =>
        store.ClassReducer.fetch_student_enrolled_class_table
    );

    const [refetchUnenrolledClasses, setRefetchUnenrolledClasses] = useState(0);

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

        dispatch(setStudentUnenrolledClassTable(filters));
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
      refetchUnenrolledClasses,
    ]);

    useEffect(() => {
      let mounted = true;
      const fetchTableData = () => {
        dispatch(setStudentEnrolledClassTable());
      };

      mounted && fetchTableData();

      return () => {
        mounted = false;
      };
    }, [dispatch]);

    useEffect(() => {
      let mounted = true;

      const initializingState = () => {
        dispatch(
          setPageLinks([
            {
              link: "/student/class",
              title: "Classes",
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
      <Container maxWidth="xl">
        <Grid item container spacing={3}>
          <Grid item xs={12} sm={10} md={9}>
            <Paper style={{ padding: `1em`, minHeight: `85vh` }}>
              <LinearLoadingProgress show={table_loading} />
              <div className="paper-title">
                Available Courses (Not Enrolled)
              </div>
              <Grid item container spacing={2}>
                <Grid item xs={12} container justify="flex-end">
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
                item
                container
                spacing={1}
                alignItems="center"
                alignContent="center"
              >
                <Grid item>
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
                <Grid item>
                  <Grid item>
                    <DataTableSort
                      handleChagenSelectedSortIndex={
                        handleChagenSelectedSortIndex
                      }
                      initialTableSort={initialTableSort}
                      selectedSortIndex={selectedSortIndex}
                    />
                  </Grid>
                </Grid>

                <Grid xs={12} container item spacing={3}>
                  <LinearLoadingProgress show={table_loading} />
                  {data_table?.length < 1 && (
                    <span className="empty-rows">No records found!</span>
                  )}

                  <Grid item xs={12}>
                    <div
                      className="class-container"
                      style={{
                        display: `grid`,
                        gridGap: `2em`,
                        alignItems: `start`,
                        alignContent: `start`,
                        gridTemplateColumns: `repeat(auto-fill, minmax(300px, 1fr))`,
                      }}
                    >
                      {data_table?.map((v, i) => (
                        <StyledClassContainer key={i}>
                          <div className="image">
                            {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                            <img
                              src={`data:image/jpg;base64,${v.course_pic}`}
                              alt={`no image found`}
                            />
                          </div>

                          <div className="info-container">
                            <div
                              // to={``}
                              className="title"
                            >
                              <div className="main">{v.class_desc}</div>
                              <div className="sub">{v.course_desc}</div>
                            </div>

                            <div
                              className="item tutor"
                              style={{ textTransform: `capitalize` }}
                            >
                              <CustomAvatar
                                src={v.tutor_pic}
                                errorMessage={v?.tutor_name?.charAt(0)}
                              />
                              {v.tutor_name}
                            </div>

                            <div className="details">
                              <div className="time">
                                The class will start on{" "}
                                <span style={{ fontWeight: 500 }}>
                                  {InvalidDateToDefault(v.start_date, "-")}.
                                </span>
                              </div>
                              <div className="time">
                                The time interval is{" "}
                                <span style={{ fontWeight: 500 }}>
                                  {" "}
                                  {moment(v.start_time, "HH:mm:ss").format(
                                    "hh:mma"
                                  )}
                                  {" - "}
                                  {moment(v.end_time, "HH:mm:ss").format(
                                    "hh:mma"
                                  )}
                                  .
                                </span>
                              </div>
                            </div>

                            <div className="footer-ctnr">
                              <Button
                                // color="primary"
                                onClick={() =>
                                  history.push(`/student/class/${v.class_pk}`)
                                }
                              >
                                View
                              </Button>
                              <Button
                                color="primary"
                                onClick={() => {
                                  const payload: ClassStudentModel = {
                                    class_pk: v.class_pk,
                                  };

                                  dispatch(
                                    setGeneralPrompt({
                                      open: true,
                                      continue_callback: () =>
                                        dispatch(
                                          ClassStudentActions.joinStudentToClassAction(
                                            payload,
                                            (msg: string) => {
                                              setRefetchUnenrolledClasses(
                                                (prev) => prev + 1
                                              );
                                              dispatch(
                                                setStudentEnrolledClassTable()
                                              );
                                            }
                                          )
                                        ),
                                    })
                                  );
                                }}
                              >
                                Enroll
                              </Button>
                            </div>
                          </div>
                        </StyledClassContainer>
                      ))}
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={2} md={3}>
            <Paper style={{ padding: `1em`, minHeight: `85vh` }}>
              <LinearLoadingProgress show={fetch_enrolled_courses_table} />
              <StyledEnrolledClass>
                <div className="paper-title">Enrolled Classes</div>
                <div className="enrolled-classes">
                  {enrolled_courses_table?.map((c, i) => (
                    <div className="class-item">
                      <div className="tutor">
                        <CustomAvatar
                          className="img"
                          src={c.tutor_pic}
                          errorMessage={c.tutor_name?.charAt(0)}
                        />
                        <div className="name">{c.tutor_name}</div>
                      </div>
                      <NavLink
                        to={`/student/class/${c.class_pk}/session`}
                        className="class-title"
                      >
                        {c.is_ongoing === 1 && <span className="circle"></span>}
                        <div className="label">{c.class_desc}</div>
                      </NavLink>
                      <div className="sub-title">{c.course_desc}</div>

                      <div className="time">
                        {parseTimeOrDefault(c.start_time, "")} -{" "}
                        {parseTimeOrDefault(c.end_time, "")}
                      </div>
                    </div>
                  ))}
                </div>
              </StyledEnrolledClass>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  }
);

export default DataTableClassStudentView;
