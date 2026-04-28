import React from 'react'
import { Outlet } from 'react-router-dom'
import UpperNavbar from '../UI/UpperNavbar/UpperNavbar'
import Footer from '../UI/Footer/Footer'
import Navbar from '../UI/Navbar/Navbar'
import StickyFooter from '../UI/StickyFooter/StickyFooter'

const Layout = () => {
  return (
    <>
        <UpperNavbar />
        <Navbar/>
        <Outlet />
        {/* <StickyFooter /> */}
        <Footer />
    </>
  )
}

export default Layout