import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { BrowserRouter } from 'react-router'
import { ContextProvider } from './context/DashboardContext'

createRoot(document.getElementById('root')).render(
    <ContextProvider>
<BrowserRouter>
 <App />
</BrowserRouter>
</ContextProvider>
)
