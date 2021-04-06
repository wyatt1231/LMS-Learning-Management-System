import { Grid, CircularProgress } from "@material-ui/core";
import React, { memo, FC } from "react";
import { Jutsu } from "react-jutsu";
import { useSelector } from "react-redux";
import { useParams } from "react-router";
import { RootStore } from "../../../../Services/Store";

interface SessionVideoConfProps {}

export const SessionVideoConf: FC<SessionVideoConfProps> = memo(() => {
  const user = useSelector((store: RootStore) => store.UserReducer.user);
  const single_class_session = useSelector(
    (store: RootStore) => store.ClassSessionReducer.single_class_session
  );

  // console.log(`hash_pk`, single_class_session);

  if (
    single_class_session?.hash_pk &&
    (single_class_session?.sts_pk === "p" ||
      single_class_session?.sts_pk === "u")
  ) {
    return (
      <div
        style={{
          fontWeight: 500,
          fontSize: `1em`,
          display: `grid`,
          padding: `2em`,
          justifyContent: `center`,
          alignContent: `center`,
          color: `#4caf50`,
        }}
      >
        You need to start the class session to view the video conferencing!
      </div>
    );
  } else if (
    single_class_session?.hash_pk &&
    single_class_session?.sts_pk === "e"
  ) {
    return (
      <div
        style={{
          fontWeight: 600,
          fontSize: `1.5em`,
          padding: `2em`,
          display: `grid`,
          justifyContent: `center`,
          alignContent: `center`,
          color: `red`,
        }}
      >
        The session has already beed ended!
      </div>
    );
  } else {
    return (
      <>
        {user?.user_type === "tutor" && (
          <Jutsu
            roomName={single_class_session?.hash_pk}
            displayName={user?.fullname}
            // password={single_class_session?.hash_pk}
            containerStyles={{
              height: `100%`,
              width: `100%`,
              border: `none`,
            }}
            loadingComponent={<CircularProgress />}
            errorComponent={<p>Oops, something went wrong</p>}
            configOverwrite={{
              enableWelcomePage: false,
              prejoinPageEnabled: false,
              disableLogCollector: true,
              defaultLogLevel: "error",
            }}
            onJitsi={(e) => {
              console.log(`jitsi details -> `, e);
            }}
            loggerConfigOverwrite={{
              disableLogCollector: true,
            }}
            interfaceConfigOverwrite={{
              disableLogCollector: true,
              defaultLogLevel: "error",
              prejoinPageEnabled: false,
              DISPLAY_WELCOME_FOOTER: false,
              GENERATE_ROOMNAMES_ON_WELCOME_PAGE: false,
              HIDE_INVITE_MORE_HEADER: true,
              HIDE_DEEP_LINKING_LOGO: true,
              SHOW_JITSI_WATERMARK: false,
              SHOW_WATERMARK_FOR_GUESTS: false,
              // JITSI_WATERMARK_LINK: "",
              TOOLBAR_BUTTONS: [
                "microphone",
                "camera",
                //   "closedcaptions",
                "desktop",
                "fullscreen",
                "fodeviceselection",
                "hangup",
                "profile",
                //   "info",
                //   "recording",
                //   "livestreaming",
                "etherpad",
                //   "sharedvideo",
                "settings",
                "raisehand",
                //   "videoquality",
                //   "filmstrip",
                //   "invite",
                //   "feedback",
                "stats",
                "shortcuts",
                "tileview",
                "videobackgroundblur",
                //   "download",
                //   "help",
                "mute-everyone",
                //   "e2ee",
              ],
            }}
          />
        )}

        {user?.user_type === "student" && (
          <iframe
            title="iframe-video"
            allow="camera; microphone; fullscreen; display-capture"
            src={`https://meet.jit.si/${single_class_session?.hash_pk}#jitsi_meet_external_api_id=0&config.enableWelcomePage=false&config.prejoinPageEnabled=false&interfaceConfig.prejoinPageEnabled=false&interfaceConfig.DISPLAY_WELCOME_FOOTER=false&interfaceConfig.GENERATE_ROOMNAMES_ON_WELCOME_PAGE=false&interfaceConfig.HIDE_INVITE_MORE_HEADER=true&interfaceConfig.HIDE_DEEP_LINKING_LOGO=true&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false&interfaceConfig.TOOLBAR_BUTTONS=%5B%22microphone%22%2C%22camera%22%2C%22desktop%22%2C%22fullscreen%22%2C%22fodeviceselection%22%2C%22hangup%22%2C%22profile%22%2C%22etherpad%22%2C%22settings%22%2C%22raisehand%22%2C%22stats%22%2C%22shortcuts%22%2C%22tileview%22%2C%22videobackgroundblur%22%2C%22mute-everyone%22%5D&appData.localStorageContent=null&userInfo.displayName="${user?.fullname}"`}
            // src={
            //   "https://meet.jit.si/c20ad4d76fe97759aa27a0c99bff6710#jitsi_meet_external_api_id=0&config.enableWelcomePage=false&config.prejoinPageEnabled=false&config.disableLogCollector=true&config.defaultLogLevel=%22error%22&interfaceConfig.disableLogCollector=true&interfaceConfig.defaultLogLevel=%22error%22&interfaceConfig.prejoinPageEnabled=false&interfaceConfig.DISPLAY_WELCOME_FOOTER=false&interfaceConfig.GENERATE_ROOMNAMES_ON_WELCOME_PAGE=false&interfaceConfig.HIDE_INVITE_MORE_HEADER=true&interfaceConfig.HIDE_DEEP_LINKING_LOGO=true&interfaceConfig.SHOW_JITSI_WATERMARK=false&interfaceConfig.SHOW_WATERMARK_FOR_GUESTS=false&interfaceConfig.TOOLBAR_BUTTONS=%5B%22microphone%22%2C%22camera%22%2C%22desktop%22%2C%22fullscreen%22%2C%22fodeviceselection%22%2C%22hangup%22%2C%22profile%22%2C%22etherpad%22%2C%22settings%22%2C%22raisehand%22%2C%22stats%22%2C%22shortcuts%22%2C%22tileview%22%2C%22videobackgroundblur%22%2C%22mute-everyone%22%5D&appData.localStorageContent=null"
            // }
            style={{ height: `100%`, width: `100%` }}
          ></iframe>
        )}
      </>
    );
  }
});

export default SessionVideoConf;
