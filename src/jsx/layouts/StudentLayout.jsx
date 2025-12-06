import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import StudentSideBar from "./nav/StudentSideBar";
import StudentHeader from "./nav/StudentHeader";
import { ThemeContext } from "../../context/ThemeContext";

const StudentLayout = () => {
  const {
    sidebariconHover,
    sidebarposition,
    headerposition,
    sidebarLayout,
  } = useContext(ThemeContext);

  return (
    <>
      <div id="main-wrapper" className={`show ${sidebariconHover ? "iconhover-toggle" : ""}`}>
        <StudentHeader />
        <StudentSideBar />
        <div className="content-body" style={{ minHeight: window.screen.height + 20 }}>
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentLayout;
