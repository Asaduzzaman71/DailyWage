import { useState } from 'react'
import './App.css'
import Header from './components/admin/Header/Header.jsx'
import SideBar from './components/admin/SideBar/SideBar.jsx'
import Dashboard from './pages/admin/Dashboard/Dashboard'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer, Bounce  } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />
    </div>
  )
}

export default App