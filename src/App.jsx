import { useState } from 'react'
import './App.css'
import Header from './components/admin/Header/Header.jsx'
import SideBar from './components/admin/SideBar/SideBar.jsx'
import Dashboard from './pages/admin/Dashboard/Dashboard'
import { Route, Routes } from 'react-router-dom'
function App() {
  const [openSidebarToggle, setOpenSidebarToggle] = useState(false)

  const OpenSidebar = () => {
    setOpenSidebarToggle(!openSidebarToggle)
  }

  return (
    <div className={`app-container ${openSidebarToggle ? 'sidebar-collapsed' : ''}`}>
      <Header OpenSidebar={OpenSidebar}/>
      <SideBar openSidebarToggle={openSidebarToggle} OpenSidebar={OpenSidebar}/>
          <main className='main-container'> 
              <Routes> 
                  <Route path='/dashboard' element={ <Dashboard />}/>
              </Routes>
          </main>
    </div>
  )
}

export default App