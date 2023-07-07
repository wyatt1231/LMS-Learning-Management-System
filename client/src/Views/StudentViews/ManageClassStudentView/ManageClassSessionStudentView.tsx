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
import { useHistory } from "react-router-dom";
import IconButtonPopper from "../../../Component/IconButtonPopper/IconButtonPopper";
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

export const ManageClassSessionStudentView: FC<ManageClassSessionTutorInterface> =
  memo(({ class_pk }) => {
    const dispatch = useDispatch();
    const history = useHistory();

    const class_sessions = useSelector(
      (store: RootStore) => store.ClassSessionReducer.class_sessions
    );
    const fetch_class_sessions = useSelector(
      (store: RootStore) => store.ClassSessionReducer.fetch_class_sessions
    );

    console.log(`class_sessions`, class_sessions);
    console.log(`params`, class_pk);

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
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width="20%">Sched Date</TableCell>
                <TableCell width="15%">Status</TableCell>
                <TableCell width="20%">Began At</TableCell>
                <TableCell width="20%">Ended At</TableCell>
                <TableCell width="10%">Rating</TableCell>
                <TableCell align="center" width="5%">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {class_sessions?.map((session, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <span style={{ fontWeight: 500 }}>
                      {parseDateAndDayOfWeekOrDefault(session.start_date, "")}
                    </span>
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
                  <TableCell align="center">
                    <IconButtonPopper
                      style={{ justifySelf: `end` }}
                      buttons={[
                        {
                          disabled: session.sts_pk !== "s",
                          text: "Enter into this session",
                          handleClick: () => {
                            history.push(
                              `/student/class/11/session/${session.session_pk}`
                            );
                          },
                        },
                        {
                          text: "Write an absent note",
                          disabled: session.sts_pk !== "fa",
                          handleClick: () => console.log(``),
                          color: `secondary`,
                        },
                      ]}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  });

export default ManageClassSessionStudentView;
