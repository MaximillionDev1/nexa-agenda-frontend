import { useState } from "react";
import { Edit2, Trash2, MoreVertical, ToggleRight, Loader2 } from "lucide-react";
import type { IService } from "@/types";
import { motion, AnimatePresence } from "framer-motion";

interface ServicesTableProps {
  services: IService[];
  onEdit: (service: IService) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
  loadingActionId?: string | null;
}

function formatPrice(price: string | number): string {
  const numPrice = typeof price === "string" ? Number.parseFloat(price) : price;
  return Number.isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
}

export function ServicesTable({
  services,
  onEdit,
  onToggle,
  onDelete,
  loading,
  loadingActionId,
}: ServicesTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-text-secondary">
        <Loader2 size={24} className="animate-spin" />
        <span className="ml-2">Loading services...</span>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary">
        <p className="text-lg">No services found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-card">
      <table className="w-full">
        <thead className="bg-background/50 border-b border-card">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
              Service
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
              Duration
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">Price</th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {services.map((service, idx) => (
              <motion.tr
                key={service.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-card hover:bg-background/60 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{service.icon}</span>
                    <div>
                      <p className="font-medium text-text">{service.name}</p>
                      {service.description && (
                        <p className="text-sm text-text-secondary truncate max-w-xs">
                          {service.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-text font-medium">{service.duration} min</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-text font-medium">R$ {formatPrice(service.price)}</p>
                </td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onToggle(service.id)}
                    disabled={loadingActionId === service.id}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                      service.isActive
                        ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200"
                        : "bg-slate-100 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400 hover:bg-slate-200"
                    } disabled:opacity-50`}
                  >
                    {loadingActionId === service.id ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <ToggleRight size={14} />
                    )}
                    {service.isActive ? "Active" : "Inactive"}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(openMenuId === service.id ? null : service.id)}
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                      aria-label="Open actions menu"
                      disabled={Boolean(loadingActionId)}
                    >
                      <MoreVertical size={18} className="text-text-secondary" />
                    </button>

                    <AnimatePresence>
                      {openMenuId === service.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 top-full mt-2 bg-card border border-card rounded-lg shadow-lg py-2 z-50 min-w-48"
                        >
                          <button
                            type="button"
                            onClick={() => {
                              onEdit(service);
                              setOpenMenuId(null);
                            }}
                            disabled={loadingActionId === service.id}
                            className="w-full px-4 py-2 text-left text-sm text-text hover:bg-background/50 flex items-center gap-2 transition-colors disabled:opacity-50"
                          >
                            {loadingActionId === service.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Edit2 size={16} className="text-blue-500" />
                            )}
                            Edit
                          </button>
                          <hr className="my-2 border-border" />
                          <button
                            type="button"
                            onClick={() => {
                              onDelete(service.id);
                              setOpenMenuId(null);
                            }}
                            disabled={loadingActionId === service.id}
                            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-background/50 flex items-center gap-2 transition-colors disabled:opacity-50"
                          >
                            {loadingActionId === service.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                            Delete
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}
