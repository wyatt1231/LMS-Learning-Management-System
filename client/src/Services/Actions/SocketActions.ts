import { Dispatch } from "react";
import { SocketReducerTypes } from "../Types/SocketTypes";

const setNotifSocket = (socket_con: any) => async (
  dispatch: Dispatch<SocketReducerTypes>
) => {
  dispatch({
    type: "set_notif",
    set_notif: socket_con,
  });
};

export default {
  setNotifSocket,
};
