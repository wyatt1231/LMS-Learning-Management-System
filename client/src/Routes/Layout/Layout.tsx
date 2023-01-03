import React, { memo, useCallback, useState } from "react";
import { useSelector } from "react-redux";
import ClassRequest from "../../Component/ClassRequest";
import { RootStore } from "../../Services/Store";
import ManageTaskView from "../../Views/SharedViews/Tasks/ManageTaskView";
import Body from "./Body";
import Header from "./Header";
import MobileSidebar from "./MobileSidebar";

export interface IPageNavLinks {
  hasSubLinks: boolean;
  text: string;
  to: string;
  parentKey?: string;
  navLinks?: Array<any>;
}

const generateNavLinks = (user: any): Array<IPageNavLinks> => {
  if (!user) {
    return [];
  }

  let PageNavLinks: Array<IPageNavLinks> = [];

  if (user.user_type === "admin") {
    // PageNavLinks.push({
    //   hasSubLinks: false,
    //   text: page.pagename,
    //   to: page.link,
    // });
    PageNavLinks = [
      {
        to: "/admin/dashboard",
        text: "Dashboard",
        hasSubLinks: false,
      },
      {
        to: "/admin/class",
        text: "Classes",
        hasSubLinks: false,
      },
      {
        to: "/admin/student",
        text: "Students",
        hasSubLinks: false,
      },
      {
        to: "/admin/tutor",
        text: "Tutors",
        hasSubLinks: false,
      },

      {
        to: "/admin/course",
        text: "Courses",
        hasSubLinks: false,
      },

      {
        to: "/admin/room",
        text: "Rooms",
        hasSubLinks: false,
      },

      {
        to: "/admin/co-administrator",
        text: "Administrators",
        hasSubLinks: false,
      },
    ];
  } else if (user?.user_type === "tutor") {
    PageNavLinks = [
      {
        to: "/tutor/dashboard",
        text: "Dashboard",
        hasSubLinks: false,
      },
      {
        to: "/tutor/class",
        text: "Classes",
        hasSubLinks: false,
      },
    ];
  } else if (user?.user_type === "student") {
    PageNavLinks = [
      {
        to: "/student/dashboard",
        text: "Dashboard",
        hasSubLinks: false,
      },
      {
        to: "/student/class/records/ongoing-class",
        text: "Classes",
        hasSubLinks: false,
      },
    ];
  }

  return PageNavLinks;
};

const Layout = memo(({ children }) => {
  const user = useSelector((reducers: RootStore) => reducers.UserReducer.user);

  const [isOpenMobileHeader, setIsOpenMobileHeader] = useState(false);

  const handleToggleHeader = useCallback(() => {
    setIsOpenMobileHeader((prevHeader) => !prevHeader);
  }, []);

  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState(false);

  const handleCloseMobileSidebar = useCallback(() => {
    setIsOpenMobileSidebar(false);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setIsOpenMobileSidebar((prevSidebar) => !prevSidebar);
  }, []);

  return (
    <>
      <Header
        PageNavLinks={generateNavLinks(user)}
        isOpenMobileHeader={isOpenMobileHeader}
        handleToggleHeader={handleToggleHeader}
        handleToggleSidebar={handleToggleSidebar}
        isOpenMobileSidebar={isOpenMobileSidebar}
        user={user}
      />
      <MobileSidebar
        PageNavLinks={generateNavLinks(user)}
        isOpenMobileSidebar={isOpenMobileSidebar}
        handleCloseMobileSidebar={handleCloseMobileSidebar}
        user={user}
      />
      <Body isOpenMobileHeader={isOpenMobileHeader}>{children}</Body>

      {/* REGISTER SHARED VIEWS */}

      <ClassRequest />
      <ManageTaskView />
    </>
  );
});

export default Layout;
