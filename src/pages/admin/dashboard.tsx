import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {AdminLayout} from "@/layouts/AdminLayout";
import { apiService } from "@/services/api";
import type { IDashboardData } from "@/types";

export default function DashboardPage() {
  useQuery<IDashboardData>({
    queryKey: ["dashboard"],
    queryFn: () => apiService.getDashboard(),
  });

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full min-h-screen bg-background"
      >
        {/* ... rest of dashboard content ... */}
      </motion.div>
    </AdminLayout>
  );
}
