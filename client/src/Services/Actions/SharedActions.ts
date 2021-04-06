import { Dispatch } from "react";
import { TutorModel } from "../Models/TutorModels";
import { SharedReducerTypes } from "../Types/SharedTypes";

const selected_tutor_rate = (payload: TutorModel | null) => async (
  dispatch: Dispatch<SharedReducerTypes>
) => {
  dispatch({
    type: "selected_tutor_rate",
    selected_tutor_rate: payload,
  });
};

export default {
  selected_tutor_rate,
};
