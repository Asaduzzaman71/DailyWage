import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'

createRoot(document.getElementById('root')).render(
 <QueryClientProvider client={new QueryClient()}>
    <BrowserRouter > 
      <App />
    </BrowserRouter>  
 </QueryClientProvider>
)
