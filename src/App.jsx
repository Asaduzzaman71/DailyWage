import { Routes, Route } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout/AdminLayout'
import Dashboard from './pages/admin/Dashboard/Dashboard'
import Login from './pages/Login/Login'
import Registration from './pages/Registration/Registration'
import { ToastContainer, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function App() {
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registration />} />

        {/* Admin routes with layout */}
        <Route path="/" element={<AdminLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Add other admin routes here */}
        </Route>
        
        {/* Redirect or 404 route */}
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={2000}
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
    </>
  )
}

export default App