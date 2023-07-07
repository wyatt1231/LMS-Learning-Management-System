import { PageReducerModel, PageReducerTypes } from "../Types/PageTypes";

const defaultState: PageReducerModel = {
  page_prompt: {
    open: false,
    custom_title: null,
    custom_subtitle: null,
    continue_callback: null,
    close_callback: null,
  },
  page_loading: {
    show: false,
  },
  page_snackbar: {
    message: null,
  },
  page_links: [],
};

const PageReducer = (
  state: PageReducerModel = defaultState,
  action: PageReducerTypes
): PageReducerModel => {
  switch (action.type) {
    case "SET_PAGE_PROMPT":
      return { ...state, page_prompt: action.page_prompt };
    case "SET_PAGE_LOADING":
      return { ...state, page_loading: action.page_loading };
    case "SET_PAGE_SNACKBAR":
      return { ...state, page_snackbar: action.page_snackbar };

    case "SET_PAGE_LINKS":
      return { ...state, page_links: action.page_links };

    case "SET_PAGE_SUCCESS_PROMPT":
      return { ...state, page_success_prompt: action.page_success_prompt };

    case "toggle_activity_sidebar":
      return {
        ...state,
        toggle_activity_sidebar: action.toggle_activity_sidebar,
      };

    case "toggle_class_req_sidebar":
      return {
        ...state,
        toggle_class_req_sidebar: action.toggle_class_req_sidebar,
      };

    default:
      return state;
  }
};

export default PageReducer;
