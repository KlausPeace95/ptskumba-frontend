import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import FinanceSideBar from "./nav/FinanceSideBar";
import FinanceHeader from "./nav/FinanceHeader";
import { ThemeContext } from "../../context/ThemeContext";

const FinanceLayout = () => {
  const {
    sidebariconHover,
    sidebarposition,
    headerposition,
    sidebarLayout,
  } = useContext(ThemeContext);

  return (
    <>
      <div id="main-wrapper" className={`show ${sidebariconHover ? "iconhover-toggle" : ""}`}>
        <FinanceHeader />
        <FinanceSideBar />
        <div className="content-body" style={{ minHeight: window.screen.height + 20 }}>
          <div className="container-fluid">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default FinanceLayout;
