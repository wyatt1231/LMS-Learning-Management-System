import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import { IconButton, Tooltip } from "@material-ui/core";
import { useTheme } from "@material-ui/core/styles";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import DateRangeIcon from "@material-ui/icons/DateRange";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import TodayIcon from "@material-ui/icons/Today";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { StyledCalendarTools } from "./StyledCalendar";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/daygrid/main.css";
import "./calendar.css";
import moment from "moment";

import clsx from "clsx";

interface ICalendarComponent {
  ManageTools: any;
  HandleSetSelectedDateId?: (dateId: number | string | null) => void;
  SelectedDateId: number | string | null;
  HandleSetCalendarDates: (dates: ICalendarDate) => void;
  Events: any;
  Resources: any;
  CalendarLoading: boolean;
}

export interface ICalendarDate {
  month: number;
  year: number;
}

const CalendarComponent: React.FC<ICalendarComponent> = memo(
  ({
    ManageTools,
    HandleSetSelectedDateId,
    SelectedDateId,
    HandleSetCalendarDates,
    Events,
    Resources,
    CalendarLoading,
  }) => {
    const theme = useTheme();
    const calendarComponentRef = useRef<any>();

    const getCalendarDate = useCallback(
      (calendar: any) => {
        HandleSetCalendarDates({
          month: new Date(calendar.getDate()).getMonth() + 1,
          year: new Date(calendar.getDate()).getFullYear(),
        });

        console.log(`calendarApi`, {
          month: new Date(calendar.getDate()).getMonth() + 1,
          year: new Date(calendar.getDate()).getFullYear(),
        });
      },
      [HandleSetCalendarDates]
    );

    const prev = useCallback(() => {
      let calendarApi = calendarComponentRef.current.getApi();
      calendarApi.prev();
      getCalendarDate(calendarApi);
      setCalendarTitle(calendarApi.view.title);
    }, [getCalendarDate]);

    const next = useCallback(() => {
      let calendarApi = calendarComponentRef.current.getApi();
      calendarApi.next();
      setCalendarTitle(calendarApi.view.title);
      getCalendarDate(calendarApi);
    }, [getCalendarDate, calendarComponentRef]);

    const today = useCallback(() => {
      let calendarApi = calendarComponentRef.current.getApi();
      calendarApi.today();
      getCalendarDate(calendarApi);
    }, [getCalendarDate, calendarComponentRef]);

    const handleViewMonth = useCallback(() => {
      let calendarApi = calendarComponentRef.current.getApi();
      calendarApi.changeView("dayGridMonth");
      setCalendarTitle(calendarApi.view.title);
    }, [calendarComponentRef]);

    const handleViewResource = useCallback(() => {
      let calendarApi = calendarComponentRef.current.getApi();
      calendarApi.changeView("resourceTimeline");
      setCalendarTitle(calendarApi.view.title);
    }, [calendarComponentRef]);

    const [calenderTitle, setCalendarTitle] = useState("");

    const calendarTitle = () => {
      if (!calendarComponentRef.current) {
        return;
      }
      let calendarApi = calendarComponentRef.current.getApi();
      setCalendarTitle(calendarApi.view.title);
    };

    useEffect(() => {
      calendarTitle();
      handleViewMonth();
    }, [handleViewMonth]);

    return (
      <div
        style={{
          height: "100%",
        }}
      >
        <StyledCalendarTools theme={theme}>
          <div className="calendar-tools">
            <div className="nav">
              <Tooltip title="Go to Previous" onClick={prev}>
                <IconButton>
                  <ArrowBackIosIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Today" onClick={today}>
                <IconButton>
                  <TodayIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Go to Next" onClick={next}>
                <IconButton>
                  <ArrowForwardIosIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="view">
              <Tooltip title="Calendar View" onClick={handleViewMonth}>
                <IconButton>
                  <DateRangeIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>

              <Tooltip title="Resouce View" onClick={handleViewResource}>
                <IconButton>
                  <FormatListBulletedIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
            <div className="title">{calenderTitle}</div>
          </div>
          <div className="manage-tools">{ManageTools}</div>
        </StyledCalendarTools>
        <div className="demo-app-calendar">
          <FullCalendar
            ref={calendarComponentRef}
            schedulerLicenseKey={"CC-Attribution-NonCommercial-NoDerivatives"}
            plugins={[resourceTimelinePlugin, dayGridPlugin]}
            events={Events}
            resources={Resources}
            headerToolbar={{
              start: "",
              left: "",
              center: "",
              right: "",
            }}
            slotMinWidth={90}
            // resourceAreaWidth="150px"
            height={"900px"}
            dayMaxEventRows={4}
            expandRows={true}
            slotEventOverlap={true}
            fixedWeekCount={false}
            // aspectRatio={2.5}
            loading={() => CalendarLoading}
            eventClick={(params: any) => {
              const dateId = params.event.id;

              if (
                typeof dateId !== "undefined" &&
                typeof HandleSetSelectedDateId !== "undefined"
              ) {
                HandleSetSelectedDateId(dateId);
              }
            }}
            eventContent={(args: any) => {
              return (
                <Tooltip
                  title={`${moment(args.event.start).format(
                    "HH:m a"
                  )} | Pending | ${args.event.title}`}
                >
                  <StyledEvent>
                    <div
                      className={clsx("event-item-ctnr", {
                        "badge-default": true,
                        selected: SelectedDateId === args.event.id,
                      })}
                    >
                      <div className="time">
                        {moment(
                          args.event.extendedProps.start_time,
                          "HH:mm:ss"
                        ).format("h:mm a")}
                        -
                        {moment(
                          args.event.extendedProps.end_time,
                          "HH:mm:ss"
                        ).format("h:mm a")}
                      </div>
                      <div className="title">{args.event.title}</div>
                    </div>
                  </StyledEvent>
                </Tooltip>
              );
            }}
          />
        </div>
      </div>
    );
  }
);

export default CalendarComponent;

const StyledEvent = styled.div`
  width: 100%;

  .event-item-ctnr {
    border: 0;
    box-shadow: none;
    padding: 4px;
    border-radius: 10px;
    display: grid;
    text-align: start;
    grid-gap: 2px;

    &.selected {
      box-shadow: 0px 3px 1px -2px rgba(0, 0, 0, 0.2),
        0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);
      border: 0.05em solid rgba(0, 0, 0, 0.1);
    }

    &:hover {
      cursor: pointer !important;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .time {
      font-size: 0.87em;
      margin-right: 3px;
      font-weight: 500;
    }

    .title {
      font-size: 0.87em;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      width: 100%;
      justify-self: start;
    }
  }
`;
