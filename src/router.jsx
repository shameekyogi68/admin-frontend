// Centralized Router Configuration
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "@/components/ProtectedRoute";
import { DashboardLayout } from "@/components/DashboardLayout";

// Pages
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Customer from "@/pages/Customer";
import Booking from "@/pages/Booking";
import Subscription from "@/pages/Subscription";
import Vendor from "@/pages/Vendor";
import AdminPlans from "@/pages/AdminPlans";
import AdminManagement from "@/pages/AdminManagement";
import NotFound from "@/pages/NotFound";

const AppRouter = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      {/* Protected routes with sidebar layout */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/vendor" element={<Vendor />} />
        <Route path="/subscription" element={<AdminPlans />} />
        <Route path="/plans" element={<AdminPlans />} />
        <Route path="/admin-management" element={<AdminManagement />} />
      </Route>

      {/* Fallback - 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRouter;
