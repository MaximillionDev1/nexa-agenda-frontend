import { useState } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  AlertCircle,
  CheckCircle2,
  Trash2,
  MoreVertical,
  Phone,
  Mail,
  Loader2,
} from 'lucide-react';
import type { IAppointment } from '@/types';
import { AppointmentStatusBadge } from './AppointmentStatusBadge';
import { motion, AnimatePresence } from 'framer-motion';

interface AppointmentsTableProps {
  appointments: IAppointment[];
  onStatusChange: (id: string, status: IAppointment['status']) => void;
  onCancel: (id: string) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
  loadingActionId?: string | null;
}

export function AppointmentsTable({
  appointments,
  onStatusChange,
  onCancel,
  onDelete,
  loading,
  loadingActionId,
}: AppointmentsTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12 text-text-secondary">
        <Loader2 size={24} className="animate-spin" />
        <span className="ml-2">Carregando agendamentos...</span>
      </div>
    );
  }

  if (!appointments || appointments.length === 0) {
    return (
      <div className="text-center py-12 text-text-secondary">
        <p className="text-lg">Nenhum agendamento encontrado</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-card">
      <table className="w-full">
        <thead className="bg-background/50 border-b border-card">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
              Cliente
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
              Serviço
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
              Data/Hora
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
              Status
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold text-text-secondary">
              Ações
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {appointments.map((appointment, idx) => (
              <motion.tr
                key={appointment.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: idx * 0.05 }}
                className="border-b border-card hover:bg-background/60 transition-colors"
              >
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-text">{appointment.customerName}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                      <Phone size={12} />
                      {appointment.customerPhone}
                    </div>
                    {appointment.customerEmail && (
                      <div className="flex items-center gap-2 mt-1 text-xs text-text-secondary">
                        <Mail size={12} />
                        <span className="truncate">{appointment.customerEmail}</span>
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-text">{appointment.service.name}</p>
                  <p className="text-sm text-text-secondary">
                    {appointment.service.duration} min
                  </p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-text">
                    {format(new Date(appointment.appointmentDate), 'dd MMM yyyy', {
                      locale: ptBR,
                    })}
                  </p>
                  <p className="text-sm text-text-secondary">
                    {format(new Date(appointment.appointmentDate), 'HH:mm')}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <AppointmentStatusBadge status={appointment.status} />
                </td>
                <td className="px-4 py-3">
                  <div className="relative">
                    <button type="button"
                      onClick={() =>
                        setOpenMenuId(openMenuId === appointment.id ? null : appointment.id)
                      }
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                      aria-label="Abrir menu de ações"
                      disabled={Boolean(loadingActionId)}
                    >
                      <MoreVertical size={18} className="text-text-secondary" />
                    </button>

                    <AnimatePresence>
                      {openMenuId === appointment.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: -10 }}
                          className="absolute right-0 top-full mt-2 bg-card border border-card rounded-lg shadow-lg py-2 z-50 min-w-56"
                        >
                          {appointment.status !== 'CONFIRMED' && (
                            <button type="button"
                              onClick={() => {
                                onStatusChange(appointment.id, 'CONFIRMED');
                                setOpenMenuId(null);
                              }}
                              disabled={loadingActionId === appointment.id}
                              className="w-full px-4 py-2 text-left text-sm text-text hover:bg-background/50 flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                              {loadingActionId === appointment.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={16} className="text-green-500" />
                              )}
                              Confirmar
                            </button>
                          )}
                          {appointment.status !== 'COMPLETED' && (
                            <button type="button"
                              onClick={() => {
                                onStatusChange(appointment.id, 'COMPLETED');
                                setOpenMenuId(null);
                              }}
                              disabled={loadingActionId === appointment.id}
                              className="w-full px-4 py-2 text-left text-sm text-text hover:bg-background/50 flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                              {loadingActionId === appointment.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <CheckCircle2 size={16} className="text-blue-500" />
                              )}
                              Marcar Concluído
                            </button>
                          )}
                          {appointment.status !== 'CANCELED' && (
                            <button type="button"
                              onClick={() => {
                                onCancel(appointment.id);
                                setOpenMenuId(null);
                              }}
                              disabled={loadingActionId === appointment.id}
                              className="w-full px-4 py-2 text-left text-sm text-text hover:bg-background/50 flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                              {loadingActionId === appointment.id ? (
                                <Loader2 size={16} className="animate-spin" />
                              ) : (
                                <AlertCircle size={16} className="text-yellow-500" />
                              )}
                              Cancelar
                            </button>
                          )}
                          <hr className="my-2 border-border" />
                          <button type="button"
                            onClick={() => {
                              onDelete(appointment.id);
                              setOpenMenuId(null);
                            }}
                            disabled={loadingActionId === appointment.id}
                            className="w-full px-4 py-2 text-left text-sm text-red-500 hover:bg-background/50 flex items-center gap-2 transition-colors disabled:opacity-50"
                          >
                            {loadingActionId === appointment.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Trash2 size={16} />
                            )}
                            Deletar
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