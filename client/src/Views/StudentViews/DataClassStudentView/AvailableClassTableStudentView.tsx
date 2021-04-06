import { Chip, Grid, TablePagination } from "@material-ui/core";
import moment from "moment";
import React, { FC, memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import DataTableSearch from "../../../Component/DataTableSearch";
import DataTableSort from "../../../Component/DataTableSort";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import useFilter from "../../../Hooks/useFilter";
import ClassActions, {
  setStudentEnrolledClassTable,
} from "../../../Services/Actions/ClassActions";
import ITableInitialSort from "../../../Services/Interface/ITableInitialSort";
import { ClassModel } from "../../../Services/Models/ClassModel";
import { PaginationModel } from "../../../Services/Models/PaginationModels";
import { RootStore } from "../../../Services/Store";
import { StyledClassContainer } from "../../../Styles/GlobalStyles";

interface IAvailableClassTableStudentView {}

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

export const AvailableClassTableStudentView: FC<IAvailableClassTableStudentView> = memo(
  () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const table_loading = useSelector(
      (store: RootStore) =>
        store.ClassReducer.fetch_student_available_class_table
    );
    const data_table: Array<ClassModel> = useSelector(
      (store: RootStore) =>
        store.ClassReducer.student_available_class_table?.table
    );

    // const enrolled_courses_table: Array<ClassModel> = useSelector(
    //   (store: RootStore) => store.ClassReducer.student_enrolled_class_table
    // );
    // const fetch_enrolled_courses_table = useSelector(
    //   (store: RootStore) =>
    //     store.ClassReducer.fetch_student_enrolled_class_table
    // );

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

        dispatch(ClassActions.getStudentAvailableClassTable(filters));
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

    return (
      <>
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
          alignItems="flex-start"
          alignContent="flex-start"
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
                  // gridTemplateColumns: `repeat(auto-fit, minmax(min(270px, 100%), 1fr))`,
                  gridTemplateColumns: `repeat(auto-fill, minmax(270px, 1fr))`,
                }}
              >
                {data_table?.map((v, i) => (
                  <StyledClassContainer key={i}>
                    <div className="image">
                      {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                      <img
                        src={`data:image/jpg;base64,${v.course_info.picture}`}
                        alt={`no image found`}
                      />
                    </div>

                    <div className="info-container">
                      <NavLink
                        to={`/student/class/${v.class_pk}/session`}
                        className="title"
                      >
                        {v.class_desc}
                        {" - "}
                        {v.course_desc}
                      </NavLink>
                      <div className="status">
                        <div
                          style={{
                            display: `grid`,
                            justifyContent: `start`,
                            justifyItems: `start`,
                            alignItems: `center`,
                            gridAutoFlow: `column`,
                            gridAutoColumns: `1fr auto`,
                          }}
                        >
                          <Chip
                            label={v.status.sts_desc}
                            style={{
                              backgroundColor: v.status.sts_bgcolor,
                              color: v.status.sts_color,
                            }}
                          />
                        </div>
                      </div>

                      <div className="time item">
                        {moment(v.start_time, "HH:mm:ss").format("hh:mma")}
                        {" - "}
                        {moment(v.end_time, "HH:mm:ss").format("hh:mma")}
                      </div>
                      <div
                        className="item"
                        style={{ textTransform: `capitalize` }}
                      >
                        {v.tutor_name}
                      </div>
                      <div className="item">
                        <div className="value">
                          {v.closed_sessions} of {v.session_count} completed
                          sessions
                        </div>
                      </div>
                    </div>
                  </StyledClassContainer>
                ))}
              </div>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
);

export default AvailableClassTableStudentView;
