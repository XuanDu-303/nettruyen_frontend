import React, { useEffect } from "react";
import { Outlet, useLocation, matchPath } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import OptionBar from "./components/OptionBar";
import Footer from "./components/Footer";

const useClearChapterData = () => {
  const location = useLocation();

  // useEffect(() => {
  //   if (!location.pathname.startsWith("/truyen-tranh/")) {
  //     localStorage.removeItem("chapterData");
  //   }
  // }, [location.pathname]);
};

const Layout = () => {
  const location = useLocation();

  useClearChapterData();

  const isChapterPage = matchPath(
    { path: "/truyen-tranh/:slug/:chapterName/:chapterId" },
    location.pathname
  );

  return (
    <div className="relative">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <Navbar />
      {!isChapterPage && (
        <div className="absolute left-0 right-0">
          <OptionBar />
        </div>
      )}
      <div
        className={`${
          isChapterPage
            ? "bg-black"
            : "pt-[40px] left-0 right-0 border min-h-screen bg-gray-50 px-[148px]"
        } `}
      >
        <Outlet />
      </div>
      <div className="absolute left-0 right-0">
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
