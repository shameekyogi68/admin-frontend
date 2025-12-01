import { useEffect, useState, useRef } from "react";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import planApi from "@/api/planApi";
import { useToast } from "@/hooks/use-toast";

export default function AdminPlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    duration: "",
    features: "",
    planType: ""
  });
  const [editingId, setEditingId] = useState(null);
  const { toast } = useToast();
  const formRef = useRef(null);

  const fetchPlans = async () => {
    setLoading(true);
    const result = await planApi.getAll();
    if (result.success) {
      setPlans(result.data || []);
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to fetch plans",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      name: form.name,
      price: Number(form.price),
      duration: form.duration,
      planType: form.planType,
      features: form.features.split(",").map((f) => f.trim()),
    };

    let result;
    if (editingId) {
      result = await planApi.update(editingId, data);
    } else {
      result = await planApi.create(data);
    }

    if (result.success) {
      toast({
        title: "Success",
        description: editingId ? "Plan updated" : "Plan created"
      });
      setForm({ name: "", price: "", duration: "", features: "", planType: "" });
      setEditingId(null);
      fetchPlans();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to save plan",
        variant: "destructive"
      });
    }
  };

  const deletePlan = async (id) => {
    if (!window.confirm("Are you sure?")) return;

    const result = await planApi.delete(id);
    if (result.success) {
      toast({
        title: "Success",
        description: "Plan deleted"
      });
      fetchPlans();
    } else {
      toast({
        title: "Error",
        description: result.error || "Failed to delete plan",
        variant: "destructive"
      });
    }
  };

  const editPlan = (plan) => {
    setForm({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: plan.features.join(", "),
      planType: plan.planType
    });
    setEditingId(plan._id);

    // 👇 Smooth scroll to the form when editing
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 200);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center p-10">

      <h1 className="text-3xl font-bold text-black mb-10">
        Manage Subscription Plans
      </h1>

      {/* FORM */}
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="bg-white border border-gray-300 rounded-2xl p-8 w-full max-w-lg shadow-lg text-black"
      >
        <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-black">
          <PlusCircle className="text-black" />
          {editingId ? "Update Existing Plan" : "Add New Plan"}
        </h2>

        <div className="space-y-4">
          <input name="name" placeholder="Enter plan name" value={form.name} onChange={handleChange}
            className="w-full px-4 py-2 bg-white border border-gray-400 rounded-xl text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-400 outline-none" required />

          <input name="price" type="number" placeholder="Enter price" value={form.price} onChange={handleChange}
            className="w-full px-4 py-2 bg-white border border-gray-400 rounded-xl text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-400 outline-none" required />

          <input name="duration" placeholder="Enter duration (ex: 1 month)" value={form.duration} onChange={handleChange}
            className="w-full px-4 py-2 bg-white border border-gray-400 rounded-xl text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-400 outline-none" required />

          <input name="features" placeholder="Features (comma separated)" value={form.features} onChange={handleChange}
            className="w-full px-4 py-2 bg-white border border-gray-400 rounded-xl text-black placeholder-gray-600 focus:ring-2 focus:ring-blue-400 outline-none" />

          <select
            name="planType"
            value={form.planType}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white border border-gray-400 rounded-xl text-black focus:ring-2 focus:ring-blue-400 outline-none"
            required
          >
            <option value="">Select Plan Type</option>
            <option value="customer">Customer Plan</option>
            <option value="vendor">Vendor Plan</option>
          </select>

          <button type="submit"
            className="w-full py-3 bg-blue-300 hover:bg-blue-400 text-black rounded-xl font-semibold transition">
            {editingId ? "Update Plan" : "Add Plan"}
          </button>
        </div>
      </form>

      {/* LIST */}
      <h2 className="text-2xl font-semibold text-black mt-12 mb-4">Available Plans</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
        {plans.map((plan) => (
          <div key={plan._id}
            className="bg-white border border-gray-300 rounded-2xl p-6 shadow-lg text-black">

            <h3 className="text-xl font-bold">{plan.name}</h3>
            <p className="mt-2">₹ {plan.price}</p>
            <p>{plan.duration}</p>

            <p className="mt-3">
              <span className="font-semibold">Features:</span> {plan.features.join(", ")}
            </p>

            <p className="mt-2">
              <span className="font-semibold">Plan Type:</span> {plan.planType}
            </p>

            <div className="flex gap-4 mt-5">
              <button onClick={() => editPlan(plan)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-200 hover:bg-blue-300 border border-gray-400 text-black rounded-xl transition">
                <Pencil size={16} /> Edit
              </button>

              <button onClick={() => deletePlan(plan._id)}
                className="flex items-center gap-2 px-4 py-2 bg-red-200 hover:bg-red-300 border border-gray-400 text-black rounded-xl transition">
                <Trash2 size={16} /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {plans.length === 0 && <p className="text-black mt-4">No plans found.</p>}
    </div>
  );
}
