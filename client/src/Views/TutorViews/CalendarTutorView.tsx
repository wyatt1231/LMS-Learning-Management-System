import FullCalendar, {
  EventClickArg,
  EventSourceInput,
} from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";
import resourceTimelinePlugin from "@fullcalendar/resource-timeline";
import resourceTimeGridPlugin from "@fullcalendar/resource-timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "@fullcalendar/timegrid/main.css";
import "@fullcalendar/daygrid/main.css";
import "../../Component/Calendar/calendar.css";

import { Chip, Grid, useTheme } from "@material-ui/core";
import moment from "moment";
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import MiniCalendar from "../../Component/MiniCalendar/MiniCalendar";
import { setPageLinks } from "../../Services/Actions/PageActions";
import { FilterEventModel } from "../../Services/Models/CaledarModels";
import { StyledCalendarTutorView } from "./styles";
import DataTableSearch from "../../Component/DataTableSearch";
import {
  setStatsSessionCalendarAction,
  setTutorClassSessionCalendarAction,
} from "../../Services/Actions/ClassSessionActions";
import { RootStore } from "../../Services/Store";
import LinearLoadingProgress from "../../Component/LinearLoadingProgress";

interface CalendarTutorViewInterface {}

export const CalendarTutorView: FC<CalendarTutorViewInterface> = memo(() => {
  const dispatch = useDispatch();
  const theme = useTheme();

  const calendarComponentRef = useRef<any>();

  const stats_class_session = useSelector(
    (store: RootStore) => store.ClassSessionReducer.stats_class_session
  );
  const fetch_stats_class_session = useSelector(
    (store: RootStore) => store.ClassSessionReducer.fetch_stats_class_session
  );

  const tutor_class_sessions = useSelector(
    (store: RootStore) => store.ClassSessionReducer.tutor_class_sessions
  );
  const fetch_tutor_class_sessions = useSelector(
    (store: RootStore) => store.ClassSessionReducer.fetch_tutor_class_sessions
  );

  const [calEvents, setCalEvents] = useState<EventSourceInput>([]);
  const [reloadEvents, setReloadEvents] = useState(0);
  const [
    calendarEventParams,
    setCalendarEventParams,
  ] = useState<FilterEventModel>({
    search: "",
    sts_pk: ["fa", "a", "e"],
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [calendarTitle, setCalendarTitle] = useState(
    moment(new Date()).format("MMMM DD,YYYY")
  );
  const [currentSelectedCalDate, setCurrentSelectedCalDate] = useState(
    new Date()
  );
  const handleSetCurrentSelectedCalDate = useCallback((new_date: Date) => {
    setCurrentSelectedCalDate(new_date);
    const calendarApi = calendarComponentRef.current.getApi();
    calendarApi.gotoDate(new_date);
    setCalendarTitle(calendarApi.view.title);

    setCalendarEventParams((prevState) => {
      return {
        ...prevState,
        month: new_date.getMonth() + 1,
        year: new_date.getFullYear(),
      };
    });
  }, []);
  const handleSubmitSearchFilter = useCallback((values, formikHelpers) => {
    setCalendarEventParams((prevState) => {
      return {
        ...prevState,
        ...values,
      };
    });
  }, []);
  const today = useCallback(() => {
    handleSetCurrentSelectedCalDate(new Date());
    let calendarApi = calendarComponentRef.current.getApi();
    calendarApi.today();
  }, [handleSetCurrentSelectedCalDate]);
  const handleReloadEvents = useCallback(() => {
    setReloadEvents((prev) => prev + 1);
  }, []);

  useEffect(() => {
    let mounted = true;

    const settingPageLinks = () => {
      dispatch(setTutorClassSessionCalendarAction(calendarEventParams));
    };

    mounted && settingPageLinks();
    return () => (mounted = false);
  }, [calendarEventParams, dispatch]);

  useEffect(() => {
    let mounted = true;

    const settingPageLinks = () => {
      dispatch(setStatsSessionCalendarAction());
    };

    mounted && settingPageLinks();
    return () => (mounted = false);
  }, [dispatch]);

  useEffect(() => {
    let mounted = true;
    const loadEvents = async () => {
      if (tutor_class_sessions) {
        const events: EventSourceInput = [];

        tutor_class_sessions.forEach((sched) => {
          events.push({
            id: sched.session_pk.toString(),
            color: sched.sts_bgcolor,
            start: moment(
              moment(new Date(sched.start_date)).format("YYYY-MM-DD") +
                " " +
                sched.start_time,
              "YYYY-MM-DD HH:mm:ss"
            ).toDate(),
            end: moment(
              moment(new Date(sched.start_date)).format("YYYY-MM-DD") +
                " " +
                sched.end_time,
              "YYYY-MM-DD HH:mm:ss"
            ).toDate(),
            title: sched.class_desc,
            extendedProps: sched,
          });
        });
        setCalEvents(events);
      }
    };

    mounted && loadEvents();

    return () => {
      mounted = false;
    };
  }, [calendarEventParams, reloadEvents, dispatch, tutor_class_sessions]);

  useEffect(() => {
    let mounted = true;

    const settingPageLinks = () => {
      dispatch(
        setPageLinks([
          {
            link: "/tutor/calendar",
            title: "Calendar",
          },
        ])
      );
    };

    mounted && settingPageLinks();
    return () => (mounted = false);
  }, [dispatch]);

  return (
    <StyledCalendarTutorView maxWidth="xl">
      <Grid container spacing={2}>
        <Grid xs={12} md={3} lg={2}>
          <div
            style={{
              padding: `1em`,
              backgroundColor: `#fff`,
              height: `100%`,
            }}
            className="main-details"
          >
            <div className="mini-calendar">
              <MiniCalendar
                selected={currentSelectedCalDate}
                onChange={handleSetCurrentSelectedCalDate}
                onMonthChange={handleSetCurrentSelectedCalDate}
                onYearChange={handleSetCurrentSelectedCalDate}
                peekNextMonth={false}
                showMonthDropdown
                showYearDropdown
                fixedHeight
                dropdownMode="select"
                inline
              />
            </div>

            <div className="statistics">
              <div className="title">Sessions Stats (Monthly)</div>
              <div className="stats-content">
                <div className="stats-item">
                  <div className="label">For Approval</div>
                  <div className="value">
                    {stats_class_session?.for_approval} <small>sessions</small>
                  </div>
                </div>
                <div className="stats-item">
                  <div className="label">Approved</div>
                  <div className="value">
                    {stats_class_session?.approved} <small>sessions</small>
                  </div>
                </div>
                <div className="stats-item">
                  <div className="label">Started</div>
                  <div className="value">
                    {stats_class_session?.started} <small>sessions</small>
                  </div>
                </div>
                <div className="stats-item">
                  <div className="label">Closed</div>
                  <div className="value">
                    {stats_class_session?.closed} <small>sessions</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Grid>
        <Grid xs={12} md={9} lg={10}>
          <div
            className="calendar"
            style={{
              padding: `1em`,
              backgroundColor: `#fff`,
            }}
          >
            <Grid container spacing={1}>
              <Grid
                item
                xs={12}
                container
                alignItems="center"
                alignContent="center"
                justify="center"
              >
                <Grid item>
                  <div
                    style={{
                      fontSize: "1.3em",
                      fontWeight: 900,
                      opacity: 0.8,
                      letterSpacing: `.3pt`,
                      wordSpacing: `.3pt`,
                    }}
                  >
                    Class Session Calendar
                  </div>
                </Grid>
              </Grid>
              <Grid
                item
                xs={12}
                container
                alignItems="center"
                alignContent="center"
              >
                <Grid
                  item
                  xs={12}
                  md={4}
                  container
                  alignItems="center"
                  spacing={1}
                >
                  <Grid item>
                    <Chip
                      label="Today"
                      variant="outlined"
                      color="primary"
                      className="shadow-default"
                      onClick={today}
                    />
                  </Grid>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={4}
                  container
                  alignItems="center"
                  justify="center"
                >
                  <Grid item>
                    <div
                      style={{
                        fontWeight: 900,
                        fontSize: `.87em`,
                        letterSpacing: `.3pt`,
                        wordSpacing: `.3pt`,
                        opacity: 0.8,
                      }}
                    >
                      {calendarTitle}
                    </div>
                  </Grid>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={4}
                  container
                  alignItems="center"
                  justify="flex-end"
                >
                  <Grid item>
                    <DataTableSearch
                      onSubmit={(e) => {
                        e.preventDefault();
                        // handleSetTableSearch({
                        //   ...tableSearch,
                        //   search: searchField,
                        // });
                        handleReloadEvents();
                      }}
                      handleSetSearchField={(seachText: string) => {
                        setCalendarEventParams((prevState) => {
                          return {
                            ...prevState,
                            search: seachText,
                          };
                        });
                      }}
                      searchField={calendarEventParams.search}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <LinearLoadingProgress show={fetch_stats_class_session} />
                <FullCalendar
                  ref={calendarComponentRef}
                  schedulerLicenseKey={
                    "CC-Attribution-NonCommercial-NoDerivatives"
                  }
                  initialView={"dayGridMonth"}
                  // initialView={"resourceTimeline"}
                  plugins={[
                    resourceTimeGridPlugin,
                    resourceTimelinePlugin,
                    dayGridPlugin,
                    interactionPlugin,
                  ]}
                  headerToolbar={null}
                  events={calEvents}
                  eventMinHeight={100}
                  dayMaxEventRows={10}
                  stickyHeaderDates={true}
                  stickyFooterScrollbar={true}
                  aspectRatio={2}
                  eventClick={(arg: EventClickArg) => {
                    console.log(`arg`, arg);
                    window.open(
                      `/tutor/class/${arg?.event.extendedProps.class_pk}/session`,
                      `_blank`
                    );
                  }}
                  allDaySlot={false}
                  selectable={false}
                  eventContent={(eventContent: any) => {
                    return (
                      <div className="month-day-event">
                        <div
                          className="dot"
                          style={{
                            backgroundColor: `${eventContent.event.extendedProps.sts_bgcolor}`,
                            borderColor: `black`,
                          }}
                        ></div>
                        <div className="title">
                          {eventContent.timeText} {eventContent.event.title}
                        </div>
                        <div
                          className="status"
                          style={{
                            backgroundColor: `${eventContent.event.extendedProps.sts_bgcolor}`,
                            borderColor: `${eventContent.event.extendedProps.sts_color}`,
                          }}
                        >
                          {eventContent.event.extendedProps.sts_pk}
                        </div>
                      </div>
                    );
                  }}
                />
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>
    </StyledCalendarTutorView>
  );
});

export default CalendarTutorView;
