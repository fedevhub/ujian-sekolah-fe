import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./layouts/layout";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./components/protected-route";
import Dashboard from "./pages/dashboard/Dashboard";
import NotFound from "./pages/not-found/NotFound";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute allowedRoles={["admin", "teacher", "student"]} />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;