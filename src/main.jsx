import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router'
import { ContextProvider } from './context/DashboardContext'
import { DashboardProvider } from './context/UserDashboardContext'

createRoot(document.getElementById('root')).render(
<DashboardProvider>
<ContextProvider>
<BrowserRouter>
 <App />
</BrowserRouter>
</ContextProvider>
</DashboardProvider>
)
