import { EventInput, EventSourceInput } from "@fullcalendar/common";
import {
  ClassSessionModel,
  StatsClassSession,
} from "../Models/ClassSessionModel";
import { EventModel } from "../Models/EventModel";

export type ClassSessionReducerTypes =
  | {
      type: "set_tutor_class_sessions";
      tutor_class_sessions: Array<ClassSessionModel>;
    }
  | {
      type: "set_fetch_tutor_class_sessions";
      fetch_tutor_class_sessions: boolean;
    }
  | {
      type: "set_stats_class_session";
      stats_class_session: StatsClassSession;
    }
  | {
      type: "set_fetch_stats_class_session";
      fetch_stats_class_session: boolean;
    }
  | {
      type: "set_class_sessions";
      class_sessions: Array<ClassSessionModel>;
    }
  | {
      type: "set_fetch_class_sessions";
      fetch_class_sessions: boolean;
    }
  | {
      type: "single_class_session";
      single_class_session: ClassSessionModel;
    }
  | {
      type: "fetch_single_class_session";
      fetch_single_class_session: boolean;
    }
  | {
      type: "tutor_session_cal";
      tutor_session_cal: Array<EventModel>;
    }
  | {
      type: "fetch_tutor_session_cal";
      fetch_tutor_session_cal: boolean;
    }
  //
  | {
      type: "student_session_cal";
      student_session_cal: Array<EventModel>;
    }
  | {
      type: "fetch_student_session_cal";
      fetch_student_session_cal: boolean;
    }
  //
  | {
      type: "logged_in_tutor_session_cal";
      logged_in_tutor_session_cal: Array<EventModel>;
    }
  | {
      type: "fetch_logged_in_tutor_session_cal";
      fetch_logged_in_tutor_session_cal: boolean;
    }
  //
  | {
      type: "logged_student_calendar";
      logged_student_calendar: Array<EventModel>;
    }
  | {
      type: "fetch_logged_student_calendar";
      fetch_logged_student_calendar: boolean;
    };

export interface ClassSessionReducerModel {
  tutor_class_sessions?: null | Array<ClassSessionModel>;
  fetch_tutor_class_sessions: boolean;
  stats_class_session?: StatsClassSession;
  fetch_stats_class_session: boolean;

  class_sessions?: Array<ClassSessionModel>;
  fetch_class_sessions: boolean;

  single_class_session?: ClassSessionModel;
  fetch_single_class_session?: boolean;

  tutor_session_cal?: Array<EventModel>;
  fetch_tutor_session_cal?: boolean;

  student_session_cal?: Array<EventModel>;
  fetch_student_session_cal?: boolean;
  //
  logged_in_tutor_session_cal?: Array<EventModel>;
  fetch_logged_in_tutor_session_cal?: boolean;
  //getLoggedStudentCalendar
  logged_student_calendar?: Array<EventModel>;
  fetch_logged_student_calendar?: boolean;
}
