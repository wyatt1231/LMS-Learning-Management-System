import {
  Button,
  Chip,
  Container,
  Grid,
  TablePagination,
} from "@material-ui/core";
import moment from "moment";
import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import DataTableSearch from "../../../Component/DataTableSearch";
import DataTableSort from "../../../Component/DataTableSort";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import useFilter from "../../../Hooks/useFilter";
import { setClassDataTableAction } from "../../../Services/Actions/ClassActions";
import { setPageLinks } from "../../../Services/Actions/PageActions";
import ITableInitialSort from "../../../Services/Interface/ITableInitialSort";
import { ClassModel } from "../../../Services/Models/ClassModel";
import { PaginationModel } from "../../../Services/Models/PaginationModels";
import { StatusMasterModel } from "../../../Services/Models/StatusMasterModel";
import { RootStore } from "../../../Services/Store";
import { StyledClassContainer } from "../../../Styles/GlobalStyles";

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

export const DataTableClassAdminView: FC<DataTableClassAdminInterface> = memo(
  () => {
    const dispatch = useDispatch();

    const table_loading = useSelector(
      (store: RootStore) => store.ClassReducer.fetching_class_data_table
    );
    const data_table: Array<ClassModel & StatusMasterModel> = useSelector(
      (store: RootStore) => store.ClassReducer.class_data_table?.table
    );

    console.log(data_table);

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

        dispatch(setClassDataTableAction(filters));
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
              link: "/admin/class",
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
        <Grid container spacing={3}>
          <Grid item xs={12} container justify="flex-end" alignItems="center">
            <Grid item>
              <NavLink to="/admin/class/add">
                <Button disableElevation color="primary" variant="contained">
                  Add Class
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
                  gridGap: `1em`,
                  alignItems: `start`,
                  alignContent: `start`,
                  gridTemplateColumns: `repeat(auto-fill, minmax(min(15rem, 100%), 1fr))`,
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
                        to={`/admin/class/${v.class_pk}`}
                        className="title"
                      >
                        {v.class_desc}
                        {" - "}
                        {v.course_desc}
                      </NavLink>

                      <div className="time">
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
                          {v.sts_pk === "fa" && (
                            <IconButtonPopper
                              style={{}}
                              buttons={[
                                {
                                  text: "Cancel class",
                                  color: "secondary",
                                },
                              ]}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </StyledClassContainer>
                ))}
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    );
  }
);

export default DataTableClassAdminView;
