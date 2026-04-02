import { Routes, Route } from "react-router-dom";
import Dashboard from "../pages/Dashboard";


const Approutes = () => {
  return (
    <div>
  <Routes>
    <Route path="/" element={<Dashboard />} />
  </Routes>
    </div>
  )
}

export default Approutes
