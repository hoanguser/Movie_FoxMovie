import React from 'react'
import { Outlet } from 'react-router-dom'
import HeaderPage from '../components/Header'
import Footer from '../components/Footer'

const HomeTemplate = () => {
    return (
        <div>
            <HeaderPage />
            <Outlet />
            <Footer />
        </div>
    )
}

export default HomeTemplate
