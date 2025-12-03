import { useEffect, useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import customerApi from "@/api/customerApi";

const Customers = () => {
  const { toast } = useToast();
  const [customers, setCustomers] = useState([]);
  const [selectedPack, setSelectedPack] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Fetch customers from backend
  const fetchCustomers = async (limitForInitial = false) => {
    setLoading(true);
    const result = await customerApi.getAll();
    if (result.success) {
      let data = result.data || [];

      // Apply filters
      if (selectedPack) {
        data = data.filter(c => c.currentPack === selectedPack);
      }
      if (selectedStatus) {
        data = data.filter(c => c.status === selectedStatus);
      }

      // Limit if needed
      if (limitForInitial) {
        data = data.slice(0, 10);
      }

      setCustomers(data);
      setTotal(data.length);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to fetch customers",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    setShowAll(false);
    fetchCustomers(true);
  }, [selectedPack, selectedStatus]);

  const packOptions = useMemo(
    () =>
      Array.from(
        new Set(customers.map((c) => c.currentPack).filter(Boolean))
      ),
    [customers]
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-IN");
  };

  const getStatusBadge = (status) => {
    const base =
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";

    if (status === "Active")
      return <span className={`${base} bg-green-100 text-green-600`}>{status}</span>;

    if (status === "Pending")
      return <span className={`${base} bg-yellow-100 text-yellow-600`}>{status}</span>;

    if (status === "Expired")
      return <span className={`${base} bg-red-100 text-red-600`}>{status}</span>;

    return <span className={base}>{status}</span>;
  };

  const handleToggleBlock = async (customerId, isBlocked) => {
    const method = isBlocked ? "unblock" : "block";
    const result = isBlocked 
      ? await customerApi.unblock(customerId)
      : await customerApi.block(customerId);

    if (result.success) {
      toast({
        title: "Success",
        description: `Customer ${method}ed successfully`
      });
      setCustomers((prev) =>
        prev.map((c) =>
          (c._id || c.id) === customerId ? { ...c, isBlocked: !isBlocked } : c
        )
      );
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to update block status",
        variant: "destructive"
      });
    }
  };

  const displayedCustomers = useMemo(() => {
    if (showAll) return customers;
    return customers.slice(0, 10);
  }, [customers, showAll]);

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-black">
          Customer Management
        </h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Monitor subscription access & control users
        </p>
      </div>

      {/* CARD */}
      <div className="rounded-xl border bg-card shadow-md">

        {/* FILTERS */}
        <div className="p-6 border-b bg-accent/5 rounded-t-xl">

          <h3 className="text-xl font-semibold">All Customers</h3>

          <div className="flex flex-wrap items-center gap-6 mt-4">

            {/* Pack Filter */}
            <div className="flex flex-col">
              <label className="text-xs font-bold mb-1">Filter by Pack</label>
              <select
                value={selectedPack}
                onChange={(e) => setSelectedPack(e.target.value)}
                className="h-10 min-w-[150px] rounded-md border px-3 text-sm focus:ring-2 focus:ring-primary"
              >
                <option value="">All Packs</option>
                {packOptions.map((pack) => (
                  <option key={pack} value={pack}>{pack}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex flex-col">
              <label className="text-xs font-bold mb-1">Filter by Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="h-10 min-w-[150px] rounded-md border px-3 text-sm focus:ring-2 focus:ring-primary"
              >
                <option value="">All Status</option>
                <option value="Active">Active</option>
                <option value="Pending">Pending</option>
                <option value="Expired">Expired</option>
              </select>
            </div>

          </div>
        </div>

        {/* TABLE */}
        <div className="p-6">
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : (
            <>
              <div className="overflow-auto rounded-lg border bg-background">
                <table className="w-full text-sm">
                  <thead className="bg-muted/40">
                    <tr className="border-b">
                      <th className="p-4 text-left">Customer ID</th>
                      <th className="p-4 text-left">Name</th>
                      <th className="p-4 text-left">Phone</th>
                      <th className="p-4 text-left">Pack</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Expiry</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {displayedCustomers.map((customer) => {
                      const id = customer._id || customer.id;
                      const customerId = customer.customerId || id; // 🔹 Use custom ID if present

                      return (
                        <tr
                          key={id}
                          className="border-b hover:bg-accent/30 transition"
                        >
                          {/* 🔹 Show Customer ID */}
                          <td className="p-4 font-semibold">{customerId}</td>
                          <td className="p-4 font-semibold">{customer.name}</td>
                          <td className="p-4 text-muted-foreground">{customer.phone}</td>
                          <td className="p-4">
                            <span className="px-3 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                              {customer.currentPack || "-"}
                            </span>
                          </td>
                          <td className="p-4">
                            {getStatusBadge(customer.status)}
                            {customer.isBlocked && (
                              <span className="ml-2 text-[10px] font-bold uppercase text-red-500">
                                Blocked
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-muted-foreground">
                            {formatDate(customer.expiryDate)}
                          </td>
                          <td className="p-4 text-right">
                            <button
                              onClick={() => handleToggleBlock(id, customer.isBlocked)}
                              className={`px-3 py-1 rounded-md text-xs font-semibold shadow-sm transition ${
                                customer.isBlocked
                                  ? "bg-green-600 text-white hover:bg-green-700"
                                  : "bg-red-600 text-white hover:bg-red-700"
                              }`}
                            >
                              {customer.isBlocked ? "Unblock" : "Block"}
                            </button>
                          </td>
                        </tr>
                      );
                    })}

                    {displayedCustomers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-muted-foreground">
                          No customers found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {!showAll && total > 10 && (
                <div className="flex justify-center mt-5">
                  <button
                    onClick={async () => {
                      setShowAll(true);
                      await fetchCustomers(false);
                    }}
                    className="px-6 py-2 rounded-lg bg-primary text-white font-semibold hover:bg-primary/90 shadow-md"
                  >
                    View More ({total - 10} more)
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Customers;
