import { useState } from 'react'
import './App.css'
import NoticeListComponent from './notice/component/NoticeListComponent'
import WorkationApplicationListComponent from './workation/components/WorkationApplicationListComponent'
import WorkationApplicationComponent from './workation/components/WorkationApplicationComponent'
import NoticeEnrollFormComponent from './notice/component/NoticeEnrollFormComponent'
import NoticeDetailComponent from './notice/component/NoticeDetailComponent'
import NoticeUpdateFormComponent from './notice/component/NoticeUpdateFromComponent'
import FacilityListComponent from './facility/components/FacilityListComponent';
import FacilityDetailComponent from './facility/components/FacilityDetailComponent';

import Header from "./common/components/Header";
import Footer from "./common/components/Footer";
import MemberListComponent from "./member/components/MemberListComponent";
import MemberDetailComponent from "./member/components/MemberDetailComponent";

import { Routes, Route, Navigate } from "react-router-dom";

import Index from "./index";

function App() {

  const [accessToken, setAccessToken] = useState(sessionStorage.getItem("accessToken"));
  const [loginRole, setLoginRole] = useState(sessionStorage.getItem("loginRole"));

  if(accessToken == null) {

    // 로그인 전 대부분 안보임
    return (
      <div>
        <Header loginRole={loginRole} />

        <div className="content">
          <Index
            accessToken={accessToken}
            setAccessToken={setAccessToken}
            setLoginRole={setLoginRole}
          />
        </div>

        <Footer />
      </div>
    );

  } else {

    const roleHome = loginRole === "SUPER"
      ? "/admin/super"
      : loginRole === "COMPANY"
        ? "/admin/company"
        : "/lobby";

    // 로그인 후 보임
    return (
      <div>
        <Header loginRole={loginRole} />

        <div className="content">
          <Routes>
            <Route
              path="/"
              element={<Navigate to={roleHome} replace />}
            />

            <Route
              path="/lobby"
              element={loginRole === "EMPLOYEE"
                ? <Index
                    accessToken={accessToken}
                    setAccessToken={setAccessToken}
                    setLoginRole={setLoginRole}
                    loginRole={loginRole}
                  />
                : <Navigate to={roleHome} replace />}
            />

            <Route
              path="/admin/super"
              element={loginRole === "SUPER"
                ? <Index
                    accessToken={accessToken}
                    setAccessToken={setAccessToken}
                    setLoginRole={setLoginRole}
                    loginRole={loginRole}
                  />
                : <Navigate to={roleHome} replace />}
            />

            <Route
              path="/admin/company"
              element={loginRole === "COMPANY"
                ? <Index
                    accessToken={accessToken}
                    setAccessToken={setAccessToken}
                    setLoginRole={setLoginRole}
                    loginRole={loginRole}
                  />
                : <Navigate to={roleHome} replace />}
            />

            <Route
              path="/admin/super/member/list"
              element={loginRole === "SUPER"
                ? <MemberListComponent />
                : <Navigate to={roleHome} replace />}
            />

            <Route
              path="/admin/company/member/list"
              element={loginRole === "COMPANY"
                ? <MemberListComponent />
                : <Navigate to={roleHome} replace />}
            />

            <Route
              path="/admin/super/member/admin/:adminId"
              element={loginRole === "SUPER"
                ? <MemberDetailComponent memberType="ADMIN" />
                : <Navigate to={roleHome} replace />}
            />

            <Route
              path="/admin/company/member/admin/:adminId"
              element={loginRole === "COMPANY"
                ? <MemberDetailComponent memberType="ADMIN" />
                : <Navigate to={roleHome} replace />}
            />

            <Route
              path="/admin/company/member/employee/:employeeId"
              element={loginRole === "COMPANY"
                ? <MemberDetailComponent memberType="EMPLOYEE" />
                : <Navigate to={roleHome} replace />}
            />
            
            <Route path="/notice/list" element={<NoticeListComponent/>}/>
            <Route path="/notice/enroll" element={<NoticeEnrollFormComponent/>}/>
            <Route path="/notice/detail/:noticeNo" element={<NoticeDetailComponent/>}/>
            <Route path="/notice/updateForm" element={<NoticeUpdateFormComponent/>}/>

            <Route path="application/list" element={<WorkationApplicationListComponent/>}/>
            <Route path="application" element={<WorkationApplicationComponent/>}/>

            {/*시설 목록 */}
            <Route path="/" element={ <FacilityListComponent/> } />
            <Route path="/facility/list" element={<FacilityListComponent />} />
            {/* 시설 상세 조회 (:facilityId 파라미터 전달) */}
            <Route path="/facility/detail/:facilityId" element={<FacilityDetailComponent/>} />

            <Route path="/notice/list" element={<NoticeListComponent/>}/>
            <Route path="/notice/enroll" element={<NoticeEnrollFormComponent/>}/>
            <Route path="/notice/detail/:noticeId" element={<NoticeDetailComponent/>}/>
            <Route path="/notice/updateForm" element={<NoticeUpdateFormComponent/>}/>

            <Route path="application/list" element={<WorkationApplicationListComponent/>}/>
            <Route path="application" element={<WorkationApplicationComponent/>}/>

      
           
          </Routes>
        </div>

        <Footer />
      </div>
    );
  };
}

 export default App;
