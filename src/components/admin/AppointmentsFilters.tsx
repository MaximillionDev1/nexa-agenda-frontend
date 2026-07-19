import { useEffect, useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { IService } from '@/types';

interface AppointmentsFiltersProps {
  services: IService[];
  onFilterChange: (filters: FilterValues) => void;
  loading?: boolean;
}

export interface FilterValues {
  date?: string;
  status?: 'SCHEDULED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELED';
  serviceId?: string;
  customerName?: string;
  customerPhone?: string;
}

export function AppointmentsFilters({
  services,
  onFilterChange,
  loading,
}: AppointmentsFiltersProps) {
  const { watch, reset, register } = useForm<FilterValues>({
    defaultValues: {
      date: '',
      status: undefined,
      serviceId: '',
      customerName: '',
      customerPhone: '',
    },
  });

  const [showAdvanced, setShowAdvanced] = useState(false);
  const filters = watch();

  // Debounce filter changes
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        date: filters.date || undefined,
        status: filters.status || undefined,
        serviceId: filters.serviceId || undefined,
        customerName: filters.customerName || undefined,
        customerPhone: filters.customerPhone || undefined,
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [filters, onFilterChange]);

  const handleReset = () => {
    reset();
  };

  const hasFilters =
    filters.date ||
    filters.status ||
    filters.serviceId ||
    filters.customerName ||
    filters.customerPhone;

  return (
    <div className="space-y-3 sm:space-y-4">
      {/* Barra de busca principal - mobile first */}
      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <div className="flex-1 relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Search by name or phone..."
            {...register('customerName')}
            className="w-full pl-10 pr-4 py-2 bg-background border border-card rounded-lg text-sm sm:text-base text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            disabled={loading}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="p-2 hover:bg-background rounded-lg transition-colors border border-card flex-shrink-0"
            aria-label="Show advanced filters"
          >
            <Filter size={18} className="text-text-secondary" />
          </button>
          {hasFilters && (
            <button
              type="button"
              onClick={handleReset}
              className="p-2 hover:bg-background rounded-lg transition-colors border border-card flex-shrink-0 text-text-secondary hover:text-text"
              aria-label="Clear filters"
            >
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Filtros avançados - responsivo */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 bg-background/50 rounded-lg border border-card">
          {/* Data */}
          <div>
            <label htmlFor="date" className="block text-xs sm:text-sm font-medium text-text-secondary mb-1">
              Date
            </label>
            <input
              id="date"
              type="date"
              {...register('date')}
              className="w-full px-3 py-2 bg-card border border-card rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={loading}
            />
          </div>

          {/* Status */}
          <div>
            <label htmlFor="status" className="block text-xs sm:text-sm font-medium text-text-secondary mb-1">
              Status
            </label>
            <select
              id="status"
              {...register('status')}
              className="w-full px-3 py-2 bg-card border border-card rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={loading}
            >
              <option value="">All statuses</option>
              <option value="SCHEDULED">Scheduled</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELED">Canceled</option>
            </select>
          </div>

          {/* Serviço */}
          <div>
            <label htmlFor="service" className="block text-xs sm:text-sm font-medium text-text-secondary mb-1">
              Service
            </label>
            <select
              id="service"
              {...register('serviceId')}
              className="w-full px-3 py-2 bg-card border border-card rounded-lg text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={loading}
            >
              <option value="">All services</option>
              {services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>

          {/* Telefone */}
          <div>
            <label htmlFor="phone" className="block text-xs sm:text-sm font-medium text-text-secondary mb-1">
              Phone
            </label>
            <input
              id="phone"
              type="tel"
              placeholder="(XX) XXXXX-XXXX"
              {...register('customerPhone')}
              className="w-full px-3 py-2 bg-card border border-card rounded-lg text-sm text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}