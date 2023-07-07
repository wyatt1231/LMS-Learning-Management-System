import { Dispatch } from "react";
import {
  PagePromptTypes,
  PageReducerTypes,
  PageLoadingTypes,
  PageLinkTypes,
  PageSuccessPromptTypes,
} from "../Types/PageTypes";

export const setGeneralPrompt =
  (promptSettings: PagePromptTypes) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "SET_PAGE_PROMPT",
      page_prompt: promptSettings,
    });
  };

export const resetGeneralPrompt =
  () => async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "SET_PAGE_PROMPT",
      page_prompt: {
        open: false,
        custom_title: null,
        custom_subtitle: null,
        continue_callback: null,
        close_callback: null,
      },
    });
  };

export const showPageLoading =
  (loadingSetting: PageLoadingTypes) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    const { loading_message } = loadingSetting;

    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: true,
        loading_message: loading_message
          ? loading_message
          : "We are processing your request, thank you for your patience.",
      },
    });
  };

export const closePageLoading =
  () => async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "SET_PAGE_LOADING",
      page_loading: {
        show: false,
        loading_message: null,
      },
    });
  };

export const setPageLinks =
  (links: Array<PageLinkTypes>) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "SET_PAGE_LINKS",
      page_links: links,
    });
  };

export const setSnackbar =
  (msg: string, type: "error" | "success" | "warning") =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "SET_PAGE_SNACKBAR",
      page_snackbar: {
        message: msg,
        options: {
          variant: type,
        },
      },
    });
  };

export const setPageSuccessPromptAction =
  (payload: PageSuccessPromptTypes) =>
  async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "SET_PAGE_SUCCESS_PROMPT",
      page_success_prompt: payload,
    });
  };

export const toggleActivitySidebar =
  (is_open: boolean) => async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "toggle_activity_sidebar",
      toggle_activity_sidebar: is_open,
    });
  };

export const toggleClassReqSidebar =
  (is_open: boolean) => async (dispatch: Dispatch<PageReducerTypes>) => {
    dispatch({
      type: "toggle_class_req_sidebar",
      toggle_class_req_sidebar: is_open,
    });
  };
