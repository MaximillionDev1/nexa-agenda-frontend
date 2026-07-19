import type { IAppointment } from "@/types";

interface AppointmentStatusBadgeProps {
  status: IAppointment["status"];
}

const statusConfig = {
  SCHEDULED: {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
    label: "Agendado",
  },
  CONFIRMED: {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
    label: "Confirmado",
  },
  COMPLETED: {
    bg: "bg-slate-100 dark:bg-slate-900/30",
    text: "text-slate-700 dark:text-slate-400",
    label: "Concluído",
  },
  CANCELED: {
    bg: "bg-red-100 dark:bg-red-900/30",
    text: "text-red-700 dark:text-red-400",
    label: "Cancelado",
  },
};

export function AppointmentStatusBadge({ status }: AppointmentStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span
      className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}
    >
      {config.label}
    </span>
  );
}
