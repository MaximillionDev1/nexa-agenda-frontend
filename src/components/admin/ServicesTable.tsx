import type { IService } from "@/types";
import { AnimatePresence, motion } from "framer-motion";
import { Edit2, Loader2, MoreVertical, ToggleRight, Trash2 } from "lucide-react";
import { useState } from "react";

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
      <div className="flex justify-center items-center py-8 sm:py-12 text-text-secondary">
        <Loader2 size={24} className="animate-spin" />
        <span className="ml-2 text-sm sm:text-base">Loading services...</span>
      </div>
    );
  }

  if (!services || services.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12 text-text-secondary px-4">
        <p className="text-base sm:text-lg">No services found</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm sm:text-base">
        <thead className="bg-background/50 border-b border-card">
          <tr>
            <th className="px-2 sm:px-4 py-3 text-left font-semibold text-text-secondary text-xs sm:text-sm">
              Service
            </th>
            <th className="hidden sm:table-cell px-4 py-3 text-left font-semibold text-text-secondary text-xs sm:text-sm">
              Duration
            </th>
            <th className="px-2 sm:px-4 py-3 text-left font-semibold text-text-secondary text-xs sm:text-sm">
              Price
            </th>
            <th className="hidden md:table-cell px-4 py-3 text-left font-semibold text-text-secondary text-xs sm:text-sm">
              Status
            </th>
            <th className="px-2 sm:px-4 py-3 text-left font-semibold text-text-secondary text-xs sm:text-sm">
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
                <td className="px-2 sm:px-4 py-3">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="text-xl sm:text-2xl flex-shrink-0">{service.icon}</span>
                    <div className="min-w-0">
                      <p className="font-medium text-text text-xs sm:text-sm truncate">
                        {service.name}
                      </p>
                      {service.description && (
                        <p className="text-xs text-text-secondary truncate max-w-xs">
                          {service.description}
                        </p>
                      )}
                      {/* Mobile: mostrar duration aqui */}
                      <p className="sm:hidden text-xs text-text-secondary mt-1">
                        {service.duration} min
                      </p>
                    </div>
                  </div>
                </td>
                <th className="hidden sm:table-cell px-4 py-3">
                  <p className="text-text font-medium text-sm">{service.duration} min</p>
                </th>
                <td className="px-2 sm:px-4 py-3">
                  <p className="text-text font-medium text-xs sm:text-sm">
                    R$ {formatPrice(service.price)}
                  </p>
                </td>
                <td className="hidden md:table-cell px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onToggle(service.id)}
                    disabled={loadingActionId === service.id}
                    className={`px-3 py-1 rounded-full text-xs sm:text-sm font-medium transition-colors flex items-center gap-1 ${
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
                <td className="px-2 sm:px-4 py-3">
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setOpenMenuId(openMenuId === service.id ? null : service.id)}
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                      aria-label="Open actions menu"
                      disabled={Boolean(loadingActionId)}
                    >
                      <MoreVertical size={16} className="text-text-secondary" />
                    </button>

                    <AnimatePresence>
                      {openMenuId === service.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 top-full mt-2 bg-card border border-card rounded-lg shadow-lg py-2 z-50 min-w-44 sm:min-w-48 text-xs sm:text-sm"
                        >
                          {/* Mobile: mostrar status aqui */}
                          <div className="md:hidden px-4 py-2 border-b border-card/50">
                            <p className="text-xs font-medium text-text-secondary mb-2">Status</p>
                            <button
                              type="button"
                              onClick={() => {
                                onToggle(service.id);
                                setOpenMenuId(null);
                              }}
                              disabled={loadingActionId === service.id}
                              className={`w-full px-2 py-1 rounded text-xs font-medium transition-colors flex items-center justify-center gap-1 ${
                                service.isActive
                                  ? "bg-green-100 text-green-700"
                                  : "bg-slate-100 text-slate-700"
                              } disabled:opacity-50`}
                            >
                              {loadingActionId === service.id ? (
                                <Loader2 size={12} className="animate-spin" />
                              ) : (
                                <ToggleRight size={12} />
                              )}
                              {service.isActive ? "Active" : "Inactive"}
                            </button>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              onEdit(service);
                              setOpenMenuId(null);
                            }}
                            disabled={loadingActionId === service.id}
                            className="w-full px-4 py-2 text-left text-text hover:bg-background/50 flex items-center gap-2 transition-colors disabled:opacity-50"
                          >
                            {loadingActionId === service.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Edit2 size={14} className="text-blue-500" />
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
                            className="w-full px-4 py-2 text-left text-red-500 hover:bg-background/50 flex items-center gap-2 transition-colors disabled:opacity-50"
                          >
                            {loadingActionId === service.id ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Trash2 size={14} />
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
