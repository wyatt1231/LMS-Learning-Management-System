import { Dispatch } from "react";
import helperErrorMessage from "../../Helpers/helperErrorMessage";
import TutorApi, {
  addTutorApi,
  getSingleTutorApi,
  getTutorDataTableApi,
  insertDummyTutorRatingsApi,
} from "../Api/TutorApi";
import IServerResponse from "../Interface/IServerResponse";
import { PaginationModel } from "../Models/PaginationModels";
import { TutorFavModel } from "../Models/TutorFavModel";
import { TutorModel } from "../Models/TutorModels";
import { TutorRatingsModel } from "../Models/TutorRatingsModel";
import { PageReducerTypes } from "../Types/PageTypes";
import { TutorReducerTypes } from "../Types/TutorTypes";

export const setTutorDataTableAction = (payload: PaginationModel) => async (
  dispatch: Dispatch<TutorReducerTypes>
) => {
  try {
    dispatch({
      type: "FETCHING_TUTOR_DATA_TABLE",
      fetching_tutor_data_table: true,
    });
    const response: IServerResponse = await getTutorDataTableApi(payload);
    console.log(`response`, response);
    dispatch({
      type: "FETCHING_TUTOR_DATA_TABLE",
      fetching_tutor_data_table: false,
    });
    if (response.success) {
      dispatch({
        type: "TUTOR_DATA_TABLE",
        tutor_data_table: response.data,
      });
    } else {
    }
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

export const setSingleTutor = (tutor_pk: string) => async (
  dispatch: Dispatch<TutorReducerTypes>
) => {
  try {
    dispatch({
      type: "FETCHING_SINGLE_TUTOR",
      fetching_single_tutor: true,
    });
    const response: IServerResponse = await getSingleTutorApi(tutor_pk);

    if (response.success) {
      dispatch({
        type: "SINGLE_TUTOR",
        single_tutor: response.data,
      });
    }
    dispatch({
      type: "FETCHING_SINGLE_TUTOR",
      fetching_single_tutor: false,
    });
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

export const addTutorAction = (
  payload: TutorModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<TutorReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await addTutorApi(payload);
    console.log(`response`, response);
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        dispatch({
          type: "RELOAD_TUTOR_PAGING",
        });
        onSuccess(response.message.toString());
      }
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

export const insertDummyTutorRatingsAction = (
  payload: Array<TutorRatingsModel>,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<TutorReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message:
          "Saving your initial ratings, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await insertDummyTutorRatingsApi(payload);
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        dispatch({
          type: "RELOAD_TUTOR_PAGING",
        });
        onSuccess(response.message.toString());
      }

      dispatch({
        type: "SET_PAGE_SNACKBAR",
        page_snackbar: {
          message: response.message.toString(),
          options: {
            variant: "success",
          },
        },
      });
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

const updateTutorImage = (
  payload: TutorModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<TutorReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message:
          "Saving your initial ratings, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await TutorApi.updateTutorImage(payload);
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        dispatch({
          type: "RELOAD_TUTOR_PAGING",
        });
        onSuccess(response.message.toString());
      }

      dispatch({
        type: "SET_PAGE_SNACKBAR",
        page_snackbar: {
          message: response.message.toString(),
          options: {
            variant: "success",
          },
        },
      });
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

const toggleActiveStatus = (
  tutor_pk: number,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<TutorReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message:
          "Saving your initial ratings, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await TutorApi.toggleActiveStatus(
      tutor_pk
    );
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        dispatch({
          type: "RELOAD_TUTOR_PAGING",
        });
        onSuccess(response.message.toString());
      }

      dispatch({
        type: "SET_PAGE_SNACKBAR",
        page_snackbar: {
          message: response.message.toString(),
          options: {
            variant: "success",
          },
        },
      });
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

const updateTutor = (
  payload: TutorModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<TutorReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await TutorApi.updateTutor(payload);
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        dispatch({
          type: "RELOAD_SINGLE_TUTOR",
        });
        onSuccess(response.message.toString());
      }
      dispatch({
        type: "SET_PAGE_SNACKBAR",
        page_snackbar: {
          message: response.message.toString(),
          options: {
            variant: "success",
          },
        },
      });
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

const getLoggedInTutor = () => async (
  dispatch: Dispatch<TutorReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_loggedin_tutor",
      fetch_loggedin_tutor: true,
    });
    const response: IServerResponse = await TutorApi.getLoggedInTutor();

    if (response.success) {
      dispatch({
        type: "loggedin_tutor",
        loggedin_tutor: response.data,
      });
    }
    dispatch({
      type: "fetch_loggedin_tutor",
      fetch_loggedin_tutor: false,
    });
  } catch (error) {
    console.error(`reducer error`, error);
  }
};
const getSingTutorToStudent = (tutor_pk: number | null) => async (
  dispatch: Dispatch<TutorReducerTypes>
) => {
  if (tutor_pk === null) {
    dispatch({
      type: "single_tutor_to_student",
      single_tutor_to_student: null,
    });
    return;
  }
  try {
    dispatch({
      type: "fetch_single_tutor_to_student",
      fetch_single_tutor_to_student: true,
    });
    const response: IServerResponse = await TutorApi.getSingTutorToStudent(
      tutor_pk
    );

    if (response.success) {
      dispatch({
        type: "single_tutor_to_student",
        single_tutor_to_student: response.data,
      });
    }
    dispatch({
      type: "fetch_single_tutor_to_student",
      fetch_single_tutor_to_student: false,
    });
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

const updateLoggedInTutorBio = (
  payload: TutorModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<TutorReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await TutorApi.updateLoggedInTutorBio(
      payload
    );
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        dispatch({
          type: "RELOAD_SINGLE_TUTOR",
        });
        onSuccess(response.message.toString());
      }
      dispatch({
        type: "SET_PAGE_SNACKBAR",
        page_snackbar: {
          message: response.message.toString(),
          options: {
            variant: "success",
          },
        },
      });
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

const rateTutor = (
  payload: TutorRatingsModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<TutorReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await TutorApi.rateTutor(payload);
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        dispatch({
          type: "RELOAD_SINGLE_TUTOR",
        });
        onSuccess(response.message.toString());
      }
      dispatch({
        type: "SET_PAGE_SNACKBAR",
        page_snackbar: {
          message: response.message.toString(),
          options: {
            variant: "success",
          },
        },
      });
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

const favoriteTutor = (
  payload: TutorFavModel,
  onSuccess: (msg: string) => any
) => async (dispatch: Dispatch<TutorReducerTypes | PageReducerTypes>) => {
  try {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        loading_message: "Loading, thank you for your patience!",
        show: true,
      },
    });
    const response: IServerResponse = await TutorApi.favoriteTutor(payload);
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
      },
    });
    if (response.success) {
      if (typeof onSuccess === "function") {
        dispatch({
          type: "RELOAD_SINGLE_TUTOR",
        });
        onSuccess(response.message.toString());
      }
      dispatch({
        type: "SET_PAGE_SNACKBAR",
        page_snackbar: {
          message: response.message.toString(),
          options: {
            variant: "success",
          },
        },
      });
    } else {
      helperErrorMessage(dispatch, response);
    }
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

const getMostRatedTutors = () => async (
  dispatch: Dispatch<TutorReducerTypes>
) => {
  try {
    dispatch({
      type: "fetch_most_rated_tutors",
      fetch_most_rated_tutors: true,
    });
    const response: IServerResponse = await TutorApi.getMostRatedTutors();

    if (response.success) {
      dispatch({
        type: "most_rated_tutors",
        most_rated_tutors: response.data,
      });
    }
    dispatch({
      type: "fetch_most_rated_tutors",
      fetch_most_rated_tutors: false,
    });
  } catch (error) {
    console.error(`reducer error`, error);
  }
};

export default {
  updateTutorImage,
  toggleActiveStatus,
  updateTutor,
  getLoggedInTutor,
  updateLoggedInTutorBio,
  rateTutor,
  favoriteTutor,
  getSingTutorToStudent,
  getMostRatedTutors,
};
