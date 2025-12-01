// AdminManagement.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import adminApi from "@/api/adminApi";

const AdminManagement = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const token = localStorage.getItem("token");
  const storedAdmin = localStorage.getItem("admin");
  const currentAdmin = storedAdmin ? JSON.parse(storedAdmin) : null;

  // If not super-admin, block
  useEffect(() => {
    if (!token || !currentAdmin) {
      navigate("/login");
    } else if (currentAdmin.role !== "super-admin") {
      toast({
        title: "Access denied",
        description: "Only super admin can manage admins",
        variant: "destructive",
      });
      navigate("/dashboard");
    }
  }, [token, currentAdmin, navigate, toast]);

  const fetchAdmins = async () => {
    setLoading(true);
    const result = await adminApi.getAll();
    if (result.success) {
      setAdmins(result.data || []);
    } else {
      toast({
        title: "Failed to load admins",
        description: result.error || "Error fetching admins",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (token && currentAdmin?.role === "super-admin") {
      fetchAdmins();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateAdmin = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.password) {
      return toast({
        title: "Validation error",
        description: "Name, email and password are required",
        variant: "destructive",
      });
    }

    setLoading(true);
    const result = await adminApi.create(form);
    if (result.success) {
      toast({
        title: "Admin created",
        description: "New admin account created successfully",
      });
      setForm({
        name: "",
        email: "",
        password: "",
        role: "admin",
      });
      fetchAdmins();
    } else {
      toast({
        title: "Failed to create admin",
        description: result.error || "Server error",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const handleToggleStatus = async (admin) => {
    const newStatus = admin.status === "active" ? "disabled" : "active";
    const result = await adminApi.toggleStatus(admin._id, newStatus);
    if (result.success) {
      toast({
        title: "Status updated",
        description: `${admin.email} is now ${newStatus}`,
      });
      fetchAdmins();
    } else {
      toast({
        title: "Failed to update status",
        description: result.error || "Server error",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAdmin = async (admin) => {
    if (!window.confirm(`Delete admin ${admin.email}?`)) return;

    const result = await adminApi.delete(admin._id);
    if (result.success) {
      toast({
        title: "Admin deleted",
        description: "Admin account has been removed",
      });
      fetchAdmins();
    } else {
      toast({
        title: "Failed to delete admin",
        description: result.error || "Server error",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Admin Management (Super Admin Only)</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleCreateAdmin}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
          >
            <div>
              <Label>Name</Label>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Admin Name"
              />
            </div>
            <div>
              <Label>Email</Label>
              <Input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="admin@example.com"
              />
            </div>
            <div>
              <Label>Password</Label>
              <Input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder="Min 6 characters"
              />
            </div>
            <div>
              <Label>Role</Label>
              <select
                className="border rounded-md px-3 py-2 w-full"
                value={form.role}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, role: e.target.value }))
                }
              >
                <option value="admin">Admin</option>
                <option value="super-admin">Super Admin</option>
              </select>
            </div>
            <div className="md:col-span-4 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Create Admin"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>All Admins</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && admins.length === 0 ? (
            <p>Loading admins...</p>
          ) : admins.length === 0 ? (
            <p>No admins found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full border text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border px-3 py-2 text-left">Name</th>
                    <th className="border px-3 py-2 text-left">Email</th>
                    <th className="border px-3 py-2 text-left">Role</th>
                    <th className="border px-3 py-2 text-left">Status</th>
                    <th className="border px-3 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((a) => (
                    <tr key={a._id}>
                      <td className="border px-3 py-2">{a.name}</td>
                      <td className="border px-3 py-2">{a.email}</td>
                      <td className="border px-3 py-2">{a.role}</td>
                      <td className="border px-3 py-2">{a.status}</td>
                      <td className="border px-3 py-2 text-center space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleToggleStatus(a)}
                          disabled={currentAdmin?.id === a._id}
                        >
                          {a.status === "active" ? "Disable" : "Enable"}
                        </Button>
                        {currentAdmin?.id !== a._id && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteAdmin(a)}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminManagement;
