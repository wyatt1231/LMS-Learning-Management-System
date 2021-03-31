import FullCalendar from "@fullcalendar/react";

import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/daygrid/main.css";
import "../../../Component/Calendar/calendar.css";
import React, { memo, FC } from "react";
import moment from "moment";

interface ITutorCalendarView {
  tutor_pk: number;
}

export const TutorCalendarView: FC<ITutorCalendarView> = memo(
  ({ tutor_pk }) => {
    return (
      <>
        <FullCalendar
          schedulerLicenseKey={"CC-Attribution-NonCommercial-NoDerivatives"}
          initialView={"timeGridFourDay"}
          plugins={[resourceTimeGridPlugin, interactionPlugin]}
          views={{
            timeGridFourDay: {
              type: "timeGrid",
              duration: { days: 3 },
              buttonText: "3 day",
            },
          }}
          events={[
            {
              id: "1",
              start: moment(new Date()).add(40, "minute").toDate(),
              end: moment(new Date()).add(45, "minute").toDate(),
              title: "Session 2",
            },
            {
              id: "2",
              start: moment(new Date()).add(30, "minute").toDate(),
              end: moment(new Date()).add(35, "minute").toDate(),
              title: "Session 1",
            },
            {
              id: "3",
              start: moment(new Date()).add(200, "minutes").toDate(),
              end: moment(new Date()).add(250, "minutes").toDate(),
              title: "Session 3",
            },
          ]}
          eventMinHeight={70}
          stickyHeaderDates={true}
          slotMinTime="07:00"
          slotMaxTime="21:00"
          height={630}
          allDaySlot={false}
        />
      </>
    );
  }
);

export default TutorCalendarView;
