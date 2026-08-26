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
import FacilityEnrollFormComponent from './facility/components/FacilityEnrollFormComponent'
import CrewListComponent from './crew/components/CrewListComponent';
import CrewEnrollFormComponent from './crew/components/CrewEnrollFormComponent';

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
            <Routes>
                <Route path="/" element={<Index accessToken={accessToken} setAccessToken={setAccessToken} setLoginRole={setLoginRole}/>}/>
                <Route path="/facility/list" element={<FacilityListComponent />} />
                <Route path="/facility/detail/:facilityId" element={<FacilityDetailComponent />} />
            </Routes>
            
          
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

            <Route
              path="/employee/my-info"
              element={loginRole === "EMPLOYEE"
                ? <MemberDetailComponent memberType="EMPLOYEE" selfMode />
                : <Navigate to={roleHome} replace />}
            />
            

            {/* 공지사항 관련 라우팅 */}

            {/* 공지사항 전체 조회 */}
            <Route path="admin/notice/list" element={<NoticeListComponent/>}/>
            {/* 공지사항 작성 */}
            <Route path="notice/enroll" element={<NoticeEnrollFormComponent/>}/>
            {/* 공지사항 상세 조회 */}
            <Route path="notice/detail/:noticeId" element={<NoticeDetailComponent/>}/>
            {/* 공지사항 수정 */}
            <Route path="/notice/updateForm" element={<NoticeUpdateFormComponent/>}/>

            <Route path="application/list" element={<WorkationApplicationListComponent/>}/>
            <Route path="application" element={<WorkationApplicationComponent/>}/>

            {/*시설 목록 */}
            <Route path="/facility/list" element={<FacilityListComponent />} />
            {/* 시설 상세 조회 (:facilityId 파라미터 전달) */}
            <Route path="/facility/detail/:facilityId" element={<FacilityDetailComponent/>} />
            {/* 시설 등록 */}
            <Route path="/facility/enroll" element={<FacilityEnrollFormComponent/>}/>

            {/* 크루 관련 라우팅  */}
            <Route path="/admin/crew/list" element={<CrewListComponent />} />
            <Route path="/admin/crew/enroll" element={<CrewEnrollFormComponent />} />
          </Routes>
        </div>

        <Footer />
      </div>
    );
  };
}

 export default App;
