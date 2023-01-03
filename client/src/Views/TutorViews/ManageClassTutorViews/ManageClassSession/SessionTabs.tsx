import { Grid, IconButton, TextField } from "@material-ui/core";
import SendRoundedIcon from "@material-ui/icons/SendRounded";
import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { io } from "socket.io-client";
import CustomAvatar from "../../../../Component/CustomAvatar";
import { API_BASE_URL, getAccessToken } from "../../../../Helpers/AppConfig";
import { parseDateTimeOrDefault } from "../../../../Hooks/UseDateParser";
import ClassSessionApi from "../../../../Services/Api/ClassSessionApi";
import { ClassSesMsgModel } from "../../../../Services/Models/ClassSessionModel";
import { RootStore } from "../../../../Services/Store";
import StyledBadge from "../../../../Styles/MaterialStyles/StyledBadge";

interface ISessionTabs {}

export const SessionTabs: FC<ISessionTabs> = memo(() => {
  const socketRef = useRef<any>();
  const messagesEndRef = useRef(null);
  const ref = useRef<HTMLFormElement | null>();

  const params = useParams<any>();

  const [active_tab, set_active_tab] = useState<"s" | "c">("s");
  const [active_students, set_active_students] = useState<any>([]);
  const [message_body, set_message_body] = useState("");
  const [message_table, set_message_table] = useState<Array<ClassSesMsgModel>>(
    []
  );
  const [reload_messages, set_reload_messages] = useState(0);

  const tbl_class_students = useSelector(
    (store: RootStore) => store.ClassStudentReducer.tbl_class_students
  );

  const handleSetMessageBody = useCallback((e) => {
    set_message_body(e.target.value);
  }, []);

  const handleSubmitMessage = useCallback(async () => {
    const payload: ClassSesMsgModel = {
      msg_body: message_body,
      session_pk: params.session_pk,
    };

    const response = await ClassSessionApi.saveMessage(payload);

    if (response.success) {
      socketRef.current.emit("sendMessage", params.session_pk);
      set_message_body("");
    }
  }, [message_body, params.session_pk]);

  useEffect(() => {
    socketRef.current = io(`${API_BASE_URL}socket/chat`, {
      query: {
        token: getAccessToken(),
      },
    });

    socketRef.current.on("connected", (data) => {});

    socketRef.current.emit("joinSession", params.session_pk);

    socketRef.current.on("updateRoom", (users) => {
      set_active_students(users);
    });

    socketRef.current.on("allMessage", () => {
      set_reload_messages((prev) => prev + 1);
    });

    socketRef.current.on("failedMessage", (error: string) => {
      alert(error);
    });

    return () => {
      socketRef?.current?.disconnect();
    };
  }, [params.session_pk]);

  useEffect(() => {
    let mounted = true;

    const reloadMessages = async () => {
      const response = await ClassSessionApi.getAllMessage(params.session_pk);

      if (response.success) {
        set_message_table(response.data);
      }
    };

    mounted && reloadMessages();
    return () => {
      mounted = false;
    };
  }, [params.session_pk, reload_messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [message_table, active_tab]);

  return (
    <div className="info-ctnr">
      <div className="ctnr-title">Meeting Details</div>
      <div className="tabs">
        <div
          className={`tab-item ${active_tab === "s" && "active"}`}
          onClick={() => set_active_tab("s")}
        >
          Students
        </div>
        <div
          className={`tab-item ${active_tab === "c" && "active"}`}
          onClick={() => set_active_tab("c")}
        >
          Chat
        </div>
      </div>

      {active_tab === "s" && (
        <div className="student-tab">
          {tbl_class_students?.map((student, i) => (
            <div key={i} className="student-item">
              {active_students.findIndex(
                (stud) => stud.user_pk === student.student_details.user_id
              ) === -1 ? (
                <CustomAvatar
                  src={student.student_details.picture}
                  errorMessage={student.student_details.lastname.charAt(0)}
                />
              ) : (
                <StyledBadge
                  overlap="circle"
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  variant="dot"
                >
                  <CustomAvatar
                    src={student.student_details.picture}
                    errorMessage={student.student_details.lastname.charAt(0)}
                  />
                </StyledBadge>
              )}
              {student.student_details.lastname}
              {", "} {student.student_details.firstname}{" "}
              {student.student_details.middlename}
            </div>
          ))}
        </div>
      )}

      {active_tab === "c" && (
        <div className="chat-tab">
          <div className="sent-msg-ctnr">
            {message_table.map((msg, i) => (
              <div key={i} ref={messagesEndRef} className="sent-msg-item">
                <CustomAvatar
                  className="img"
                  src={msg.picture}
                  errorMessage={msg.fullname?.charAt(0)}
                />
                <div className="name">{msg.fullname}</div>
                <div className="time">
                  {parseDateTimeOrDefault(msg.sent_at, "-")}
                </div>
                <div className="message">{msg.msg_body}</div>
              </div>
            ))}
          </div>
          <form
            id="hook-form"
            ref={ref}
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmitMessage();
            }}
            className="write-msg-ctnr"
          >
            <TextField
              value={message_body}
              onChange={handleSetMessageBody}
              fullWidth
              variant="outlined"
              placeholder="Write your message here..."
              multiline
              rowsMax={2}
              rows={2}
              className="write-btn"
              onKeyDown={(event: React.KeyboardEvent<HTMLDivElement>): void => {
                if (event.key === "Enter" && !event.shiftKey) {
                  if (ref.current) {
                    handleSubmitMessage();
                  }
                }
              }}
              InputProps={{
                style: {
                  backgroundColor: `#f1f3f8`,
                },
              }}
              // rowsMax={1}
            />
            <IconButton form="hook-form" type="submit" color="primary">
              <SendRoundedIcon />
            </IconButton>
          </form>
        </div>
      )}
    </div>
  );
});

export default SessionTabs;
