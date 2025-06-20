import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ManualEmailPage from "./pages/ManualEmailPage";
import { DashboardProvider } from "./contexts/DashboardContext";
import { AuthProvider } from "./contexts/AuthContext"; // Import AuthProvider
import ProtectedRoute from "./components/ProtectedRoute"; // Import ProtectedRoute

function App() {
  return (
    <Router>
      <AuthProvider>
        {" "}
        {/* Wrap everything with AuthProvider */}
        <DashboardProvider>
          {" "}
          {/* DashboardProvider can be inside or outside AuthProvider, depending on needs */}
          <Routes>
            <Route path="/" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/manual-email" element={<ManualEmailPage />} />
            </Route>

            {/* Example of a public route if needed:
            <Route path="/about" element={<AboutPage />} />
            */}
            {/* Catch-all route for 404 Not Found (optional)
            <Route path="*" element={<NotFoundPage />} />
            */}
          </Routes>
        </DashboardProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
