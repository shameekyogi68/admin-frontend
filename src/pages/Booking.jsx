import React, { useEffect, useState } from "react";
import { Calendar, CheckCircle, Clock as ClockIcon, XCircle } from "lucide-react";
import bookingApi from "@/api/bookingApi";

const statusColors = {
  completed: { bg: "bg-green-100 text-green-800", icon: <CheckCircle className="w-4 h-4" /> },
  pending: { bg: "bg-yellow-100 text-yellow-800", icon: <ClockIcon className="w-4 h-4" /> },
  rejected: { bg: "bg-red-100 text-red-800", icon: <XCircle className="w-4 h-4" /> },
  default: { bg: "bg-gray-100 text-gray-800", icon: <ClockIcon className="w-4 h-4" /> },
};

const Booking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [stats, setStats] = useState({
    totalBookings: 0,
    completed: 0,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const result = await bookingApi.getAll();

      if (result.success) {
        const formatted = result.data.bookings.map(b => ({
          _id: b._id,
          customerId: b.customerId,
          customerName: b.customerName,
          vendorId: b.vendorId,
          services: b.services,
          serviceName: b.services?.join(", ") || "—",
          status: b.bookingStatus,
          bookingDate: b.createdAt
        }));

        setBookings(formatted);

        setStats({
          totalBookings: formatted.length,
          completed: formatted.filter(b => b.status === "completed").length
        });
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);
    } finally {
      setLoading(false);
    }
  };


  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      searchTerm === "" ||
      booking.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.serviceName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const statusConfig = statusColors[status] || statusColors["default"];
    return (
      <span
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusConfig.bg}`}
      >
        {statusConfig.icon}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Booking Management</h1>
          <p className="text-gray-500 mt-1">View and manage all customer bookings</p>
        </div>
      </div>

      {/* ✅ Only 2 cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Total Bookings</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.totalBookings}</h3>
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <p className="text-sm font-medium text-gray-500">Completed</p>
          <h3 className="text-2xl font-bold text-gray-900 mt-1">{stats.completed}</h3>
        </div>
      </div>

      {/* ✅ Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium whitespace-nowrap">Booking ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium whitespace-nowrap">Customer Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium whitespace-nowrap">Customer ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium whitespace-nowrap">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium whitespace-nowrap">Booking Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium whitespace-nowrap">Vendor ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium whitespace-nowrap">Services</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">Loading...</td>
                </tr>
              ) : filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">No bookings found</td>
                </tr>
              ) : (
                filteredBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap">{booking._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.customerName}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.customerId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(booking.status)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(booking.bookingDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.vendorId}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{booking.serviceName}</td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default Booking;