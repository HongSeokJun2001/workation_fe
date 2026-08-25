import { useState } from 'react'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import NoticeListComponent from './notice/component/NoticeListComponent'
import WorkationApplicationListComponent from './workation/components/WorkationApplicationListComponent'
import WorkationApplicationComponent from './workation/components/WorkationApplicationComponent'
import NoticeEnrollFormComponent from './notice/component/NoticeEnrollFormComponent'
import NoticeDetailComponent from './notice/component/NoticeDetailComponent'
import NoticeUpdateFormComponent from './notice/component/NoticeUpdateFromComponent'


function App() {

  return (
    <div>

      <Routes>
        <Route path="/notice/list" element={<NoticeListComponent/>}/>
        <Route path="/notice/enroll" element={<NoticeEnrollFormComponent/>}/>
        <Route path="/notice/detail/:noticeId" element={<NoticeDetailComponent/>}/>
        <Route path="/notice/updateForm" element={<NoticeUpdateFormComponent/>}/>

        <Route path="application/list" element={<WorkationApplicationListComponent/>}/>
        <Route path="application" element={<WorkationApplicationComponent/>}/>
      </Routes>
    </div>
  )
}

export default App
