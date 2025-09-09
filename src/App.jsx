import { useEffect } from 'react';
import { Routes, Route, Navigate  } from 'react-router-dom'
import AdminLayout from './layouts/AdminLayout/AdminLayout'
import Dashboard from './pages/admin/Dashboard/Dashboard'
import Users from './pages/admin/Users/Users'
import Login from './pages/Login/Login'
import Registration from './pages/Registration/Registration'
import { ToastContainer, Bounce } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuthStore } from './store/authStore';
function App() {
  const {initialize} = useAuthStore();
  useEffect(() => {
    initialize();
  }, [initialize]);
  return (
    <>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={
            <ProtectedRoute requireAuth={false}>
              <Login />
             </ProtectedRoute>
            } 
        />
        <Route path="/signup" element={ 
           <ProtectedRoute requireAuth={false}>
              <Registration />
            </ProtectedRoute>}
        />

         {/* Admin routes with layout */}
        <Route path="/" element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
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