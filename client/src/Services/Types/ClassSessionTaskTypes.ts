import {
  SessionTaskModel,
  SessionTaskQuesModel,
  SessionTaskSubModel,
} from "../Models/ClassSessionTaskModels";

export type ClassSessionTaskReducerTypes =
  | {
      type: "all_class_task";
      all_class_task: Array<SessionTaskModel>;
    }
  | {
      type: "fetch_all_class_task";
      fetch_all_class_task: boolean;
    }
  | {
      type: "single_class_task";
      single_class_task: SessionTaskModel;
    }
  | {
      type: "fetch_single_class_task";
      fetch_single_class_task: boolean;
    }
  | {
      type: "all_class_task_ques";
      all_class_task_ques: Array<SessionTaskQuesModel>;
    }
  | {
      type: "fetch_all_class_task_ques";
      fetch_all_class_task_ques: boolean;
    }
  | {
      type: "single_class_task_ques";
      single_class_task_ques: SessionTaskQuesModel;
    }
  | {
      type: "fetch_single_class_task_ques";
      fetch_single_class_task_ques: boolean;
    }
  | {
      type: "all_class_task_sub";
      all_class_task_sub: Array<SessionTaskQuesModel & SessionTaskSubModel>;
    }
  | {
      type: "fetch_all_class_task_sub";
      fetch_all_class_task_sub: boolean;
    }
  | {
      type: "all_student_submit";
      all_student_submit: Array<SessionTaskSubModel>;
    }
  | {
      type: "fetch_all_student_submit";
      fetch_all_student_submit: boolean;
    };

export interface ClassSessionTaskReducerModel {
  all_class_task?: Array<SessionTaskModel>;
  fetch_all_class_task?: boolean;

  single_class_task?: SessionTaskModel;
  fetch_single_class_task?: boolean;

  all_class_task_ques?: Array<SessionTaskQuesModel>;
  fetch_all_class_task_ques?: boolean;

  single_class_task_ques?: SessionTaskQuesModel;
  fetch_single_class_task_ques?: boolean;

  all_class_task_sub?: Array<SessionTaskQuesModel & SessionTaskSubModel>;
  fetch_all_class_task_sub?: boolean;

  all_student_submit?: Array<SessionTaskSubModel>;
  fetch_all_student_submit?: boolean;
}
