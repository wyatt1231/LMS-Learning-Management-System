import {
  Chip,
  Container,
  Grid,
  Paper,
  TablePagination,
} from "@material-ui/core";
import moment from "moment";
import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import DataTableSearch from "../../../Component/DataTableSearch";
import DataTableSort from "../../../Component/DataTableSort";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import useFilter from "../../../Hooks/useFilter";
import { setTutorClassTableAction } from "../../../Services/Actions/ClassActions";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import ITableInitialSort from "../../../Services/Interface/ITableInitialSort";
import { ClassModel } from "../../../Services/Models/ClassModel";
import { PaginationModel } from "../../../Services/Models/PaginationModels";
import { StatusMasterModel } from "../../../Services/Models/StatusMasterModel";
import { RootStore } from "../../../Services/Store";
import { StyledClassContainer } from "../../../Styles/GlobalStyles";

interface DataClassTutorViewInterface {}

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

export const DataClassTutorView: FC<DataClassTutorViewInterface> = memo(() => {
  const dispatch = useDispatch();

  const history = useHistory();

  const table_loading = useSelector(
    (store: RootStore) => store.ClassReducer.fetch_tutor_class_table
  );
  const data_table: Array<ClassModel & StatusMasterModel> = useSelector(
    (store: RootStore) => store.ClassReducer.tutor_class_table?.table
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

      dispatch(setTutorClassTableAction(filters));
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
            link: "/tutor/class",
            title: "Classes",
          },
        ])
      );
    };

    mounted && initializingState();
    return () => (mounted = false);
  }, [dispatch]);

  return (
    <Container maxWidth="lg">
      <LinearLoadingProgress show={table_loading} />

      <Grid
        container
        component={Paper}
        style={{
          padding: `1em`,
          minHeight: `90vh`,
          alignItems: `start`,
          alignContent: `start`,
        }}
        spacing={2}
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

        <Grid xs={12} container item spacing={1}>
          {data_table?.length < 1 && (
            <span className="empty-rows">No records found!</span>
          )}
          <Grid item xs={12}>
            <div
              className="class-container"
              style={{
                display: `grid`,
                gridGap: `3em`,
                alignItems: `start`,
                alignContent: `start`,
                justifyContent: `start`,
                gridTemplateColumns: `repeat(auto-fill, minmax(300px, 1fr))`,
              }}
            >
              {data_table?.map((v, i) => (
                <StyledClassContainer key={i}>
                  <div className="image">
                    {/* eslint-disable-next-line jsx-a11y/img-redundant-alt */}
                    <img
                      src={`data:image/jpg;base64,${v.pic}`}
                      alt={`no image found`}
                    />
                  </div>

                  <div className="info-container">
                    <NavLink
                      to={`/tutor/class/${v.class_pk}/session`}
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
                          label={v.sts_desc}
                          style={{
                            backgroundColor: v.sts_bgcolor,
                            color: v.sts_color,
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

              {/* {data_table?.map((v, i) => (
                <StyledClassContainer key={i}>
                  <div className="image">
                    <img src={`data:image/jpg;base64,${v.pic}`} alt="" />
                  </div>

                  <div className="info-container">
                    <div className="title">
                      <div className="main">{v.class_desc}</div>
                      <div className="sub">{v.course_desc}</div>
                    </div>

                    <div className="details">
                      <div className="item">
                        The current status is{" "}
                        <Chip
                          label={v.sts_desc}
                          size="small"
                          style={{
                            backgroundColor: v.sts_bgcolor,
                            color: v.sts_color,
                          }}
                        />
                      </div>

                      <div className="time">
                        The time interval is{" "}
                        <span style={{ fontWeight: 500 }}>
                          {" "}
                          {moment(v.start_time, "HH:mm:ss").format("hh:mma")}
                          {" - "}
                          {moment(v.end_time, "HH:mm:ss").format("hh:mma")}.
                        </span>
                      </div>

                      <div className="item">
                        <span style={{ fontWeight: 500 }}>
                          {v.closed_sessions} of {v.session_count}
                        </span>{" "}
                        session are completed.
                      </div>
                    </div>

                    <div className="footer-ctnr">
                      <Button
                        // color="primary"
                        onClick={() =>
                          history.push(`/tutor/class/${v.class_pk}/session`)
                        }
                        // variant="outlined"
                        color="primary"
                      >
                        View
                      </Button>
                      {v.sts_pk === "fa" && (
                        <>
                          <Button
                            color="primary"
                            onClick={() => handleApproveClass(v.class_pk)}
                          >
                            Accept
                          </Button>
                          <Button color="secondary">Decline</Button>
                        </>
                      )}
                    </div>
                  </div>
                </StyledClassContainer>
              ))} */}
            </div>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
});

export default DataClassTutorView;
