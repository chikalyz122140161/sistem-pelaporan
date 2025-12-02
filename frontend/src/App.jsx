import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import TicketDetail from "./pages/TicketDetail";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/tickets/:id"
          element={
            <ProtectedRoute allowedRoles={["USER", "ADMIN"]}>
              <TicketDetail />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
