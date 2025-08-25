import { useState } from 'react'
// import './App.css'
import { BrowserRouter, Routes } from 'react-router-dom';
import { renderRoutes } from './routers/Index';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          {renderRoutes()}
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
