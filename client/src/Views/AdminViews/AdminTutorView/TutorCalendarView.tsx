import "@fullcalendar/daygrid/main.css";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import "@fullcalendar/timegrid/main.css";
import { CircularProgress } from "@material-ui/core";
import React, { FC, memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "../../../Component/Calendar/calendar.css";
import ClassSessionActions from "../../../Services/Actions/ClassSessionActions";
import { RootStore } from "../../../Services/Store";

interface ITutorCalendarView {
  tutor_pk: number;
}

export const TutorCalendarView: FC<ITutorCalendarView> = memo(
  ({ tutor_pk }) => {
    const dispatch = useDispatch();

    const tutor_session_cal = useSelector(
      (store: RootStore) => store.ClassSessionReducer.tutor_session_cal
    );

    const fetch_tutor_session_cal = useSelector(
      (store: RootStore) => store.ClassSessionReducer.fetch_tutor_session_cal
    );

    useEffect(() => {
      dispatch(ClassSessionActions.getTutorSessionCal(tutor_pk));
    }, [dispatch, tutor_pk]);

    return (
      <>
        {fetch_tutor_session_cal && !tutor_session_cal ? (
          <CircularProgress />
        ) : (
          <FullCalendar
            schedulerLicenseKey={"CC-Attribution-NonCommercial-NoDerivatives"}
            initialView={"timeGridFourDay"}
            plugins={[resourceTimeGridPlugin, interactionPlugin]}
            views={{
              timeGridFourDay: {
                type: "timeGrid",
                duration: { days: 5 },
                buttonText: "5 day",
              },
            }}
            events={tutor_session_cal}
            eventMinHeight={70}
            stickyHeaderDates={true}
            slotMinTime="07:00"
            slotMaxTime="21:00"
            height={630}
            allDaySlot={false}
            eventContent={(e) => {
              console.log(`e`, e);

              const data = e.event;

              return (
                <div
                  style={{
                    boxShadow: `0 1px 2px rgba(0,0,0,.1)`,
                    backgroundColor: data.backgroundColor,
                    color: data.textColor,
                    padding: `.5em`,
                    fontSize: `.9em`,
                    display: `grid`,
                    gridAutoFlow: `column`,
                    justifyContent: `start`,
                    alignItems: `center`,
                    alignContent: `center`,
                    gridGap: `.87em`,
                    borderRadius: 5,
                    border: `.01em solid rgba(0,0,0,.1)`,
                    letterSpacing: `.3pt`,
                    wordSpacing: `.3pt`,
                  }}
                >
                  <div
                    style={{
                      fontWeight: 900,
                      textTransform: `uppercase`,
                      color: data.backgroundColor,
                      backgroundColor: data.textColor,
                      padding: `5px`,
                      borderRadius: `50%`,
                      height: 20,
                      width: 20,
                      textAlign: `center`,
                      display: `grid`,
                      alignItems: `center`,
                      alignContent: `center`,
                      fontSize: `.8em`,
                    }}
                  >
                    {data.extendedProps.sts_pk}
                  </div>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: `1em`,
                    }}
                  >
                    {data.title}
                  </div>
                </div>
              );
            }}
          />
        )}
      </>
    );
  }
);

export default TutorCalendarView;
