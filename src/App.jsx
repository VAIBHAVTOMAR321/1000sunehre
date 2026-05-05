import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


import Home from './components/pages/Home';
import { AuthProvider } from './components/all_login/AuthContext';
import SupervisorDashBoard from "./components/supervisor_panel/SupervisorDashBoard";





function AppContent() {
  const location = useLocation();

  return (
    <>
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SupervisorDashBoard" element={<SupervisorDashBoard />} />
          
        </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
