import React from 'react'
import { Outlet } from 'react-router-dom'
import HeaderPage from '../components/Header'
import Footer from '../components/Footer'

const AuthTemplate = () => {
  return (
    <>
      <HeaderPage />
      <div
        className="relative flex items-center justify-center min-h-screen pb-8"
        style={{
          backgroundImage:
            "url('https://cellphones.com.vn/sforum/wp-content/uploads/2021/07/a-1.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-[#000000bf] bg-opacity-60"></div>
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
      <Footer />
    </>
  )
}

export default AuthTemplate