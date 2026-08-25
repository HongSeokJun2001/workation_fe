import { useState } from 'react'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import NoticeListComponent from './notice/component/NoticeListComponent'
import WorkationApplicationListComponent from './workation/components/WorkationApplicationListComponent'
import WorkationApplicationComponent from './workation/components/WorkationApplicationComponent'
import NoticeEnrollFormComponent from './notice/component/NoticeEnrollFormComponent'
import NoticeDetailComponent from './notice/component/NoticeDetailComponent'
import NoticeUpdateFormComponent from './notice/component/NoticeUpdateFromComponent'
import FacilityListComponent from './facility/components/FacilityListComponent';
import FacilityDetailComponent from './facility/components/FacilityDetailComponent';

 function App() {
  return (
    <div>

      <Routes>
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
      </Routes>
    </div>
  )
}

 export default App;
