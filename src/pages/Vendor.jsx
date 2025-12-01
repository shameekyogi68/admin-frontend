import { useEffect, useState } from "react";
import { Ban, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import vendorApi from "@/api/vendorApi";

const Vendors = () => {
  const { toast } = useToast();

  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);

  // Fetch Vendors
  useEffect(() => {
    async function fetchVendors() {
      try {
        const result = await vendorApi.getAll({ categoryFilter, statusFilter });

        if (result.success) {
          let list = result.data.vendors || [];

          if (categoryFilter) {
            list = list.filter((v) => v.category === categoryFilter);
          }

          if (statusFilter) {
            list = list.filter((v) => v.status === statusFilter);
          }

          setVendors(list);

          // Extract unique categories (from full data, not filtered list)
          const cats = [...new Set((result.data.vendors || []).map((v) => v.category))];
          setCategories(cats);
        }
      } catch (error) {
        console.error("Failed to fetch vendors:", error);
      }
    }

    fetchVendors();
  }, [categoryFilter, statusFilter]);

  // Block / Unblock Vendor
  const handleBlockToggle = async (id, name, isBlocked) => {
    const result = await vendorApi.toggleBlock(id, !isBlocked);

    if (result.success) {
      toast({
        title: isBlocked ? "Vendor Unblocked" : "Vendor Blocked",
        description: `${name} has been ${isBlocked ? "unblocked" : "blocked"}.`,
      });

      setVendors((prev) =>
        prev.map((v) =>
          v._id === id
            ? {
                ...v,
                isBlocked: !isBlocked,
                status: !isBlocked ? "blocked" : "approved",
              }
            : v
        )
      );
    }
  };

  // Delete Vendor
  const handleDeleteVendor = async (id, name) => {
    const result = await vendorApi.delete(id);

    if (result.success) {
      toast({
        title: "Vendor Deleted",
        description: `${name} has been removed.`,
        variant: "destructive",
      });
      setVendors(vendors.filter((v) => v._id !== id));
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      approved: "bg-green-100 text-green-700 border-green-300",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-300",
      blocked: "bg-red-100 text-red-700 border-red-300",
      rejected: "bg-gray-200 text-gray-700 border-gray-300",
    };

    return (
      <span
        className={`px-3 py-1 text-xs rounded-full border font-semibold ${colors[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* PAGE HEADER */}
      <div>
        <h1 className="text-3xl font-bold">Vendor Management</h1>
        <p className="text-muted-foreground mt-1">
          View, filter, block, and manage all vendor details
        </p>
      </div>

      {/* CARD */}
      <div className="rounded-lg border bg-card shadow-sm">
        {/* Card Header */}
        <div className="p-6 space-y-4">
          <h2 className="text-xl font-semibold">All Vendors</h2>

          {/* Filters */}
          <div className="flex gap-3">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border rounded-md px-3 py-2 text-sm"
            >
              <option value="">All Status</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
              <option value="blocked">Blocked</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        <div className="p-6 pt-0 overflow-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="p-3 text-left">Vendor ID</th>
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Jobs Completed</th>
                <th className="p-3 text-left">Current Pack</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {vendors.map((vendor) => (
                <tr
                  key={vendor._id}
                  className="border-b hover:bg-muted/20 transition"
                >
                  <td className="p-3 font-medium">{vendor.vendorId}</td>
                  <td className="p-3 font-medium">{vendor.name}</td>
                  <td className="p-3">{vendor.category}</td>
                  <td className="p-3">{vendor.jobsCompleted}</td>
                  <td className="p-3">{vendor.currentPack}</td>

                  <td className="p-3">{getStatusBadge(vendor.status)}</td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      {/* BLOCK / UNBLOCK */}
                      <button
                        onClick={() =>
                          handleBlockToggle(
                            vendor._id,
                            vendor.name,
                            vendor.isBlocked
                          )
                        }
                        className={`px-3 py-1 rounded-md text-xs border flex items-center gap-1 ${
                          vendor.isBlocked
                            ? "bg-green-100 text-green-700 border-green-300"
                            : "bg-red-100 text-red-700 border-red-300"
                        }`}
                      >
                        <Ban className="h-3 w-3" />
                        {vendor.isBlocked ? "Unblock" : "Block"}
                      </button>

                      {/* DELETE */}
                      <button
                        onClick={() =>
                          handleDeleteVendor(vendor._id, vendor.name)
                        }
                        className="px-3 py-1 rounded-md text-xs border bg-destructive/10 text-destructive flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
};

export default Vendors;
