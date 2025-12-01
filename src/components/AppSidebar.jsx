import {
  LayoutDashboard,
  Users,
  Package,
  Calendar,
  Store,
  Shield,
  ChevronLeft,
  ChevronRight,
  LogOut,
  PawPrint,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import clsx from "clsx";

const navSections = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
      { title: "Customers", to: "/customer", icon: Users },
      { title: "Bookings", to: "/booking", icon: Calendar },
      { title: "Subscriptions", to: "/subscription", icon: Package },
      { title: "Vendors", to: "/vendor", icon: Store },
    ],
  },
];


const baseNavClasses =
  "group relative flex items-center gap-3 px-3 py-2 rounded-2xl transition-all duration-200";

const getNavClasses = (isActive) =>
  clsx(
    baseNavClasses,
    isActive
      ? "text-white bg-white/10 backdrop-blur border border-white/30 shadow-lg shadow-cyan-500/20"
      : "text-white/60 hover:text-white hover:bg-white/5 border border-transparent"
  );

export function AppSidebar({ isOpen, onToggle }) {
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));


  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <aside
      className={clsx(
        "fixed left-0 top-0 h-full border-r border-white/15 bg-gradient-to-b from-[#010916] via-[#071020] to-[#050910] text-white shadow-[0_20px_45px_rgba(0,0,0,0.65)] backdrop-blur-xl transition-all duration-300",
        isOpen ? "w-64" : "w-[4.75rem]"
      )}
    >
      <div className="pointer-events-none absolute inset-0 opacity-60">
        <div className="absolute -top-10 left-6 h-32 w-32 rounded-full bg-cyan-500/25 blur-[90px]" />
        <div className="absolute bottom-16 right-2 h-40 w-40 rounded-full bg-indigo-500/20 blur-[110px]" />
      </div>
      <div className="relative flex h-full flex-col">
        {/* Header */}
        <div className="border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 via-indigo-500 to-blue-700 shadow-lg shadow-blue-500/40 ring-2 ring-white/10">
                <Shield className="h-5 w-5 text-white drop-shadow" />
              </div>
              {isOpen && (
                <div>
  <p className="text-sm font-semibold tracking-wide text-white">
    {admin?.name || "Administrator"}
  </p>
  <p className="text-xs text-white/55 capitalize">
    {admin?.role || "admin"}
  </p>
</div>

              )}
            </div>
            <button
              onClick={onToggle}
              className="rounded-2xl border border-white/15 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              title={isOpen ? "Collapse" : "Expand"}
            >
              {isOpen ? (
                <ChevronLeft className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-4 overflow-y-auto p-4">
          {navSections.map((section) => (
            <div key={section.label}>
              {isOpen && (
                <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-white/40">
                  {section.label}
                </p>
              )}
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.title}
                    to={item.to}
                    className={({ isActive }) => getNavClasses(isActive)}
                    title={!isOpen ? item.title : undefined}
                  >
                    {({ isActive }) => (
                      <>
                        <span
                          className={clsx(
                            "absolute inset-y-2 left-1 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 transition-opacity",
                            isActive ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <item.icon
                          className={clsx(
                            "h-5 w-5 shrink-0 transition duration-200",
                            isOpen ? "" : "mx-auto",
                            isActive ? "text-white" : "text-white/50 group-hover:text-white"
                          )}
                        />
                        {isOpen && (
                          <span className="text-sm font-medium tracking-wide">
                            {item.title}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}

          {/* SUPER ADMIN ONLY SECTION */}
{admin?.role === "super-admin" && (
  <div>
    {isOpen && (
      <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-widest text-white/40">
        Admin Control
      </p>
    )}
    <div className="space-y-1">
      <NavLink
        to="/admin-management"
        className={({ isActive }) => getNavClasses(isActive)}
        title={!isOpen ? "Admin Management" : undefined}
      >
        {({ isActive }) => (
          <>
            <span
              className={clsx(
                "absolute inset-y-2 left-1 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-blue-600 transition-opacity",
                isActive ? "opacity-100" : "opacity-0"
              )}
            />
            <Shield
              className={clsx(
                "h-5 w-5 shrink-0 transition duration-200",
                isOpen ? "" : "mx-auto",
                isActive ? "text-white" : "text-white/50 group-hover:text-white"
              )}
            />
            {isOpen && (
              <span className="text-sm font-medium tracking-wide">
                Admin Management
              </span>
            )}
          </>
        )}
      </NavLink>
    </div>
  </div>
)}

        </nav>

        {/* Footer */}
        <div className="border-t border-white/10 p-4">
          
          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm font-medium text-red-100 transition hover:bg-red-500/20"
            title={!isOpen ? "Logout" : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AppSidebar;
