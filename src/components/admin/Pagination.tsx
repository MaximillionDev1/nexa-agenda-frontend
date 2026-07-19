import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  loading,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visiblePages = pages.filter((page) => {
    if (totalPages <= 5) return true;
    if (page === 1 || page === totalPages) return true;
    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
    return false;
  });

  return (
    <div className="flex items-center justify-center gap-2">
      <button type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="p-2 hover:bg-background rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-card"
        aria-label="Página anterior"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex gap-1">
        {visiblePages.map((page, idx) => {
          const prevPage = visiblePages[idx - 1];
          return (
            <div key={page}>
              {prevPage && page - prevPage > 1 && (
                <span className="px-2 py-1 text-text-secondary">...</span>
              )}
              <button type="button"
                onClick={() => onPageChange(page)}
                disabled={loading}
                className={`px-3 py-2 rounded-lg transition-colors border ${
                  currentPage === page
                    ? 'bg-primary text-white border-primary'
                    : 'border-card hover:bg-background'
                }`}
              >
                {page}
              </button>
            </div>
          );
        })}
      </div>

      <button type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="p-2 hover:bg-background rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-card"
        aria-label="Próxima página"
      >
        <ChevronRight size={18} />
      </button>

      <span className="text-sm text-text-secondary ml-4">
        Página {currentPage} de {totalPages}
      </span>
    </div>
  );
}