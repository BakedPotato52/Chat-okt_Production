import React from 'react';

import { Route, Routes } from 'react-router-dom';
import './App.css'
import Homepage from './pages/HomePage';
import ChatPage from './pages/ChatPage';



function App() {

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route exact path="/chats" element={<ChatPage />} />
      </Routes>

    </>
  )
}

export default App
