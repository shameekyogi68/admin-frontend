import { useEffect, useState } from "react";
import {
  Users,
  UserCheck,
  User,
  CreditCard,
  TrendingUp,
  Calendar,
  LineChart,
} from "lucide-react";
import dashboardApi from "@/api/dashboardApi";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const result = await dashboardApi.getStats();
        if (result.success) {
          setStats(result.data.data);
        }
      } catch (err) {
        console.error("Failed to fetch dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (!stats || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-xl text-slate-900">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900 px-6 py-10">

      {/* HEADER */}
      <div className="text-center mb-12">
        <h2 className="text-4xl font-semibold mt-4">Dashboard Overview</h2>
        <p className="text-slate-500 text-sm">
          Real-time monitoring of your business performance
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* TOTAL USERS */}
        <div className="lg:col-span-2 bg-gradient-to-br from-white to-blue-50 
            border border-blue-300 rounded-3xl shadow-md p-6">

          <h3 className="flex items-center gap-3 text-blue-700 font-semibold text-lg">
            <Users className="w-6 h-6" />
            Total Users
          </h3>

          <p className="text-5xl font-bold mt-4">{stats.totalUsers}</p>

          {/* Vendors + Customers */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="rounded-xl bg-blue-100/40 border border-blue-400/30 p-4">
              <UserCheck className="w-6 h-6 text-blue-700 mx-auto" />
              <p className="text-2xl font-bold text-center mt-2">
                {stats.totalVendors}
              </p>
              <p className="text-xs text-center text-blue-700 mt-1">Vendors</p>
            </div>

            <div className="rounded-xl bg-pink-100/40 border border-pink-400/30 p-4">
              <User className="w-6 h-6 text-pink-600 mx-auto" />
              <p className="text-2xl font-bold text-center mt-2">
                {stats.totalCustomers}
              </p>
              <p className="text-xs text-center text-pink-600 mt-1">Customers</p>
            </div>
          </div>
        </div>

        {/* VENDOR REVENUE */}
        <div className="bg-yellow-50 border border-yellow-400 rounded-3xl shadow-md p-6">
          <h3 className="flex items-center gap-3 text-yellow-700 font-semibold text-lg">
            <TrendingUp className="w-6 h-6" />
            Vendor Revenue
          </h3>
          <p className="text-4xl font-bold text-yellow-700 mt-2">
            ₹ {stats.revenue.vendorRevenue}
          </p>

          <LineChart className="w-full mt-6 text-yellow-700 opacity-60" />
        </div>

        {/* TOTAL BOOKINGS */}
        <div className="bg-indigo-50 border border-indigo-300 rounded-3xl shadow-md p-6">
          <h3 className="flex items-center gap-3 text-indigo-600 font-semibold text-lg">
            <Calendar className="w-6 h-6" />
            Total Bookings
          </h3>
          <p className="text-4xl font-bold mt-3">{stats.totalBookings}</p>
        </div>

        {/* ACTIVE SUBSCRIPTIONS */}
        <div className="bg-blue-50 border border-blue-300 rounded-3xl shadow-md p-6">
          <h3 className="flex items-center gap-3 text-blue-700 font-semibold text-lg">
            <CreditCard className="w-6 h-6" />
            Active Subscriptions
          </h3>
          <p className="text-4xl font-bold mt-3">
            {stats.activeSubscriptions}
          </p>
        </div>

        {/* SUBSCRIPTION PROFIT */}
        <div className="bg-green-50 border border-green-400 rounded-3xl shadow-md p-6">
          <h3 className="flex items-center gap-3 text-green-700 font-semibold text-lg">
            💰 Subscription Profit
          </h3>
          <p className="text-4xl font-bold mt-3 text-green-700">
            ₹ {stats.totalProfit}
          </p>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
