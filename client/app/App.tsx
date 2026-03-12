// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
export default function App() {
return (
<BrowserRouter>
<AuthProvider>
<Routes>
{/* Public */}
<Route path="/login" element={<LoginPage />} />
{/* Protected — wrapped by PrivateRoute */}
<Route element={<PrivateRoute />}>
<Route path="/dashboard" element={<DashboardPage />} />
</Route>
{/* Default redirect */}
<Route path="*" element={<Navigate to="/login" replace />} />
</Routes>
</AuthProvider>
</BrowserRouter>
);
}