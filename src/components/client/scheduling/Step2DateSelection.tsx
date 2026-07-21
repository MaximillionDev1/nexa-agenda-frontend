import { format, isBefore, startOfToday } from "date-fns";
import { ptBR } from "date-fns/locale";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

interface Step2DateSelectionProps {
  selectedDate?: string;
  onSelectDate: (date: string) => void;
}

export function Step2DateSelection({ selectedDate, onSelectDate }: Step2DateSelectionProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const today = startOfToday();

  const getDaysInMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const days: (Date | null)[] = [];

    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(date.getFullYear(), date.getMonth(), i));
    }

    return days;
  };

  const days = getDaysInMonth(currentMonth);
  const monthName = format(currentMonth, "MMMM yyyy", { locale: ptBR });

  const isValidDay = (date: Date | null) => {
    if (!date) return false;
    const dayOfWeek = date.getDay();
    return dayOfWeek !== 0 && !isBefore(date, today);
  };

  const handleSelectDate = (date: Date) => {
    // CORREÇÃO: Usar year, month, date diretamente para evitar timezone shift
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    onSelectDate(dateString);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Selecione a data</h2>

      {/* Header do Calendário */}
      <div className="flex items-center justify-between mb-4">
        <button
          type="button"
          onClick={handlePrevMonth}
          className="p-2 hover:bg-card rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Mês anterior"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-semibold capitalize">{monthName}</h3>
        <button
          type="button"
          onClick={handleNextMonth}
          className="p-2 hover:bg-card rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          aria-label="Próximo mês"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Dias da Semana */}
      <div className="grid grid-cols-7 gap-2 mb-4">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-text-secondary py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendário */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          const dateKey = date
            ? `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
            : `empty-${index}`;
          const isValid = isValidDay(date);
          const isSelected =
            date &&
            selectedDate ===
              `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

          return (
            <motion.button
              key={dateKey}
              type="button"
              onClick={() => {
                if (date && isValid) {
                  handleSelectDate(date);
                }
              }}
              disabled={!isValid}
              whileHover={isValid ? { scale: 1.05 } : {}}
              whileTap={isValid ? { scale: 0.95 } : {}}
              className={`p-3 rounded-lg text-sm font-medium transition-all min-h-[44px] flex items-center justify-center ${
                !date
                  ? "invisible"
                  : isSelected
                    ? "bg-primary text-white"
                    : isValid
                      ? "bg-card hover:bg-card border border-card hover:border-primary cursor-pointer"
                      : "bg-card/30 text-text-secondary/50 cursor-not-allowed opacity-50"
              }`}
              aria-label={date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : undefined}
            >
              {date ? date.getDate() : ""}
            </motion.button>
          );
        })}
      </div>

      {/* Resumo da Data Selecionada */}
      {selectedDate && (
        <div className="p-4 bg-primary/10 border border-primary/30 rounded-lg">
          <p className="text-sm text-text-secondary">Data selecionada:</p>
          <p className="text-lg font-semibold text-primary">
            {format(new Date(`${selectedDate}T00:00:00`), "dd/MM/yyyy", {
              locale: ptBR,
            })}
          </p>
        </div>
      )}
    </div>
  );
}
