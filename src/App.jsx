import { useState } from 'react'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import NoticeListComponent from './notice/component/NoticeListComponent'
import WorkationApplicationListComponent from './workation/components/WorkationApplicationListComponent'
import WorkationApplicationComponent from './workation/components/WorkationApplicationComponent'

function App() {

  return (
    <div>

      <Routes>
        <Route path="/notice/list" element={<NoticeListComponent/>}/>

        <Route path="application/list" element={<WorkationApplicationListComponent/>}/>
        <Route path="application" element={<WorkationApplicationComponent/>}/>
      </Routes>
    </div>
  )
}

export default App
