import {
  ClassSessionModel,
  StatsClassSession,
} from "../Models/ClassSessionModel";

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
}
