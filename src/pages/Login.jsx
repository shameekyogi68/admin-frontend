// Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import authApi from "@/api/authApi";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast({
        title: "Login Failed",
        description: "Email and Password required",
        variant: "destructive",
      });
    }

    try {
      setLoading(true);
      const result = await authApi.login(email, password);

      if (result.success) {
        const { token, admin } = result.data;
        localStorage.setItem("token", token);
        localStorage.setItem("admin", JSON.stringify(admin));

        toast({ title: "Welcome!", description: admin.role });
        navigate("/dashboard");
      } else {
        toast({
          title: "Invalid Credentials",
          description: result.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Server Error",
        description: "Unable to connect",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F4F7FA] px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-gray-200">

        <h2 className="text-2xl font-semibold text-center text-gray-800">
          Admin Login
        </h2>
        <p className="text-gray-500 text-center text-sm mb-6">
          Secure access to your admin dashboard
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <Label className="text-gray-700 mb-1 block">Email</Label>
            <Input
              type="email"
              placeholder="admin@gmail.com"
              className="bg-gray-50 border-gray-300 text-gray-900"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <Label className="text-gray-700 mb-1 block">Password</Label>
            <Input
              type="password"
              placeholder="********"
              className="bg-gray-50 border-gray-300 text-gray-900"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0C1923] hover:bg-black text-white font-semibold rounded-xl mt-2 py-2"
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
