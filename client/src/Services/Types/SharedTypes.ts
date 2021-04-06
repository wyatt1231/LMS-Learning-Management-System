import { TutorModel } from "../Models/TutorModels";

export type SharedReducerTypes = {
  type: "selected_tutor_rate";
  selected_tutor_rate: TutorModel;
};

export interface SharedReducerModel {
  selected_tutor_rate?: TutorModel;
}
