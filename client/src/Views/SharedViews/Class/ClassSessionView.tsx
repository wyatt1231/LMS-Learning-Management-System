import {
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@material-ui/core";
import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import LinearLoadingProgress from "../../../Component/LinearLoadingProgress";
import {
  parseDateAndDayOfWeekOrDefault,
  parseDateTimeOrDefault,
} from "../../../Hooks/UseDateParser";
import { getClassSessionsAction } from "../../../Services/Actions/ClassSessionActions";
import { RootStore } from "../../../Services/Store";

interface ManageClassSessionTutorInterface {
  class_pk: number;
}

export const ClassSessionView: FC<ManageClassSessionTutorInterface> = memo(
  ({ class_pk }) => {
    const dispatch = useDispatch();
    const params = useParams<any>();
    const history = useHistory();

    const user_type = useSelector(
      (store: RootStore) => store.UserReducer.user.user_type
    );

    const class_sessions = useSelector(
      (store: RootStore) => store.ClassSessionReducer.class_sessions
    );
    const fetch_class_sessions = useSelector(
      (store: RootStore) => store.ClassSessionReducer.fetch_class_sessions
    );

    useEffect(() => {
      let mounted = true;

      const fetch_data = () => {
        dispatch(getClassSessionsAction(class_pk));
      };

      mounted && fetch_data();

      return () => {
        mounted = false;
      };
    }, [class_pk, dispatch]);

    return (
      <div className="class-tab">
        <LinearLoadingProgress show={fetch_class_sessions} />
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell width="auto">Sched Date</TableCell>
                <TableCell width="auto">Status</TableCell>
                <TableCell width="auto">Began At</TableCell>
                <TableCell width="auto">Ended At</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {class_sessions?.map((session, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {user_type === "admin" ? (
                      <span style={{ fontWeight: 500 }}>
                        {parseDateAndDayOfWeekOrDefault(session.start_date, "")}
                      </span>
                    ) : (
                      <NavLink
                        to={`/${user_type}/class/${class_pk}/session/${session.session_pk}`}
                        style={{ fontWeight: 500 }}
                      >
                        {parseDateAndDayOfWeekOrDefault(session.start_date, "")}
                      </NavLink>
                    )}
                  </TableCell>

                  <TableCell>
                    <Chip
                      style={{
                        backgroundColor: session.sts_bgcolor,
                        color: session.sts_color,
                      }}
                      label={session.sts_desc}
                    />
                  </TableCell>
                  <TableCell>
                    {session?.began ? (
                      <Chip
                        size="small"
                        style={{
                          backgroundColor: `#f5f5f5`,
                          color: `blue`,
                        }}
                        variant="outlined"
                        label={parseDateTimeOrDefault(
                          session.began,
                          "to be decided"
                        )}
                      />
                    ) : (
                      <Chip
                        size="small"
                        style={{
                          backgroundColor: `#fff`,
                        }}
                        variant="outlined"
                        label="to be decided"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {session?.ended ? (
                      <Chip
                        style={{
                          backgroundColor: `#f5f5f5`,
                          color: `blue`,
                        }}
                        size="small"
                        variant="outlined"
                        label={parseDateTimeOrDefault(
                          session.ended,
                          "to be decided"
                        )}
                      />
                    ) : (
                      <Chip
                        size="small"
                        style={{
                          backgroundColor: `#fff`,
                        }}
                        variant="outlined"
                        label="to be decided"
                      />
                    )}
                  </TableCell>
                  {/* {user_type !== "admin" && (
                    <TableCell align="center">
                      <IconButtonPopper
                        style={{ justifySelf: `end` }}
                        buttons={[
                          {
                            text: "Enter into this session",
                            handleClick: () => {
                              history.push(
                                
                              );
                            },
                          },
                        ]}
                      />
                    </TableCell>
                  )} */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  }
);

export default ClassSessionView;
