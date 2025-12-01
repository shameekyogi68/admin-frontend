import React, { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import planApi from "@/api/planApi";

const Subscription = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const { toast } = useToast();
  const [form, setForm] = useState({
    customerName: "",
    planType: "",
    startDate: "",
    status: "Active",
    userType: "customer",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  // Fetch all subscriptions (plans)
  async function fetchSubscriptions() {
    setLoading(true);
    const result = await planApi.getAll();
    if (result.success) {
      setSubscriptions(result.data || []);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to load subscriptions",
        variant: "destructive"
      });
    }
    setLoading(false);
  }

  // Form change handler
  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  // Add subscription (create plan)
  async function handleSubmit(e) {
    e.preventDefault();

    const data = {
      name: form.customerName,
      price: 0, // Default price, user should edit
      duration: form.startDate,
      planType: form.userType,
      features: form.planType.split(",").map(f => f.trim()),
    };

    setLoading(true);
    const result = await planApi.create(data);
    if (result.success) {
      toast({
        title: "Success",
        description: "Subscription added"
      });
      setForm({
        customerName: "",
        planType: "",
        startDate: "",
        status: "Active",
        userType: "customer",
      });
      fetchSubscriptions();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to add subscription",
        variant: "destructive"
      });
    }
    setLoading(false);
  }

  // Delete subscription
  async function handleDelete(id) {
    if (!window.confirm("Are you sure?")) return;

    const result = await planApi.delete(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Subscription deleted"
      });
      fetchSubscriptions();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete subscription",
        variant: "destructive"
      });
    }
  }

  // Filter subscriptions by planType
  const filteredSubscriptions = subscriptions.filter(
    (sub) => sub.planType === form.userType
  );

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Subscription Management 💳
      </h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-2 gap-4 bg-gray-100 p-4 rounded-lg mb-6"
      >
        <input
          name="customerName"
          placeholder="Plan Name"
          value={form.customerName}
          onChange={handleChange}
          required
          className="border p-2 rounded col-span-2"
        />

        <input
          name="planType"
          placeholder="Features (comma separated)"
          value={form.planType}
          onChange={handleChange}
          required
          className="border p-2 rounded col-span-1"
        />

        <input
          name="startDate"
          type="text"
          placeholder="Duration (e.g., 1 month)"
          value={form.startDate}
          onChange={handleChange}
          required
          className="border p-2 rounded col-span-1"
        />

        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="border p-2 rounded col-span-1"
        >
          <option value="Active">Active</option>
          <option value="Expired">Expired</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <select
          name="userType"
          value={form.userType}
          onChange={handleChange}
          className="border p-2 rounded col-span-1"
        >
          <option value="customer">Customer Plan</option>
          <option value="vendor">Vendor Plan</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="col-span-2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? "Adding..." : "Add Subscription"}
        </button>
      </form>

      {/* Subscription List */}
      {loading && subscriptions.length === 0 ? (
        <p className="text-center">Loading...</p>
      ) : filteredSubscriptions.length === 0 ? (
        <p className="text-center text-gray-600">No subscriptions found.</p>
      ) : (
        filteredSubscriptions.map((s) => (
          <div
            key={s._id}
            className="bg-white shadow rounded p-4 my-2 flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{s.name}</p>
              <p className="text-sm text-gray-600">
                Plan Type: {s.planType}
              </p>
              <p className="text-sm text-gray-500">
                Duration: {s.duration}
              </p>
              <p className="text-sm text-gray-500">
                Price: ₹{s.price}
              </p>
            </div>

            <button
              onClick={() => handleDelete(s._id)}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default Subscription;
