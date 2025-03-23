import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const layout = () => {
  return (
    <>
    <Navbar/>
    <Outlet/>
    </>
  )
}

export default layout