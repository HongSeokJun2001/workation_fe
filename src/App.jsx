import { useState } from 'react'
import './App.css'
import { Routes,Route } from 'react-router-dom'
import NoticeListComponent from './notice/component/NoticeListComponent'

function App() {

  return (
    <div>

      <Routes>
        <Route path="/notice/list" element={<NoticeListComponent/>}/>

      </Routes>
    </div>
  )
}

export default App
