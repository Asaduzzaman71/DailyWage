// src/layouts/AdminLayout.jsx
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom';
import Header from '../../components/admin/Header/Header'
import SideBar from '../../components/admin/SideBar/SideBar'
import Chat from '../../components/Chat/Chat';
import { useAuthStore } from '../../store/authStore'; 

import './AdminLayout.css'
export default function AdminLayout({ children }) {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)
  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }
   // Get Zustand state and actions
   const {
     user,
     token
   } = useAuthStore();

  return (
    <div className={`app-container ${openSidebarToggle ? 'sidebar-collapsed' : ''}`}>
      <Header OpenSidebar={OpenSidebar} />
      <SideBar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar} />
      <main className="main-container"> <Outlet /></main>
       <Chat auth={{ user, token }} />
    </div>
  )
}