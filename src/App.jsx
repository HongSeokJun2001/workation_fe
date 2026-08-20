import { useState } from 'react'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import NoticeListComponent from './notice/component/NoticeListComponent'

import Header from "./common/components/Header";
import Footer from "./common/components/Footer";
import MemberListComponent from "./member/components/MemberListComponent";

import { Routes, Route, Navigate } from "react-router-dom";

import Index from "./index";

function App() {

  const [accessToken, setAccessToken] = useState(sessionStorage.getItem("accessToken"));
  const loginRole = sessionStorage.getItem("role");

  if(accessToken == null) {

    // 로그인 전 대부분 안보임
    return (
      <div>
        <Header />

        <div className="content">
          <Index accessToken={accessToken} setAccessToken={setAccessToken} />
        </div>

        <Footer />
      </div>
    );

  } else {

    const roleHome = loginRole === "SUPER"
      ? "/super"
      : loginRole === "COMPANY"
        ? "/company"
        : "/";

    // 로그인 후 보임
    return (
      <div>
        <Header />

        <div className="content">
          <Routes>
            <Route
              path="/"
              element={loginRole === "EMPLOYEE"
                ? <Index accessToken={accessToken} setAccessToken={setAccessToken} />
                : <Navigate to={roleHome} replace />}
            />

            <Route
              path="/super"
              element={loginRole === "SUPER"
                ? <MemberListComponent />
                : <Navigate to={roleHome} replace />}
            />

            <Route
              path="/company"
              element={loginRole === "COMPANY"
                ? <MemberListComponent />
                : <Navigate to={roleHome} replace />}
            />

            <Route path="/notice/list" element={<NoticeListComponent/>}/>
          </Routes>
        </div>

        <Footer />
      </div>
    );
  };
}

export default App
