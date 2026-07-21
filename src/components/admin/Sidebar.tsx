import { useAuth } from "@/contexts/auth";
import { AnimatePresence, motion } from "framer-motion";
import { Calendar, LayoutDashboard, LogOut, Menu, Settings, X } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Appointments",
      path: "/admin/appointments",
      icon: <Calendar size={20} />,
    },
    {
      label: "Services",
      path: "/admin/services",
      icon: <Settings size={20} />,
    },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 md:hidden p-3 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label="Toggle sidebar menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Backdrop - Mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/50 z-30 md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={`fixed md:relative left-0 top-0 h-screen w-72 bg-card border-r border-card z-40 md:z-auto flex flex-col overflow-y-auto transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-card">
          <Link
            to="/admin/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 font-bold text-xl text-primary hover:text-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary rounded px-2 py-1"
          >
            <span className="text-2xl">📅</span>
            <span>Nexa</span>
          </Link>
          <p className="text-xs text-text-secondary mt-2">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                isActive(item.path)
                  ? "bg-primary text-white font-medium"
                  : "text-text hover:bg-background"
              }`}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
              {isActive(item.path) && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 h-full w-1 bg-primary rounded-r"
                  initial={false}
                />
              )}
            </Link>
          ))}
        </nav>

        {/* Divider */}
        <div className="px-4 py-2">
          <div className="border-t border-card" />
        </div>

        {/* Footer */}
        <div className="p-4 space-y-2 border-t border-card">
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary min-h-[44px]"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
          <p className="text-xs text-text-secondary px-2 py-2">v1.0.0 • Built with care</p>
        </div>
      </aside>
    </>
  );
}
