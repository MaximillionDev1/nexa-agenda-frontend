import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  loading?: boolean;
}

export function Pagination({ currentPage, totalPages, onPageChange, loading }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Mobile: mostrar apenas 3 páginas por vez
  // Desktop: mostrar mais páginas
  const visiblePages = pages.filter((page) => {
    if (totalPages <= 3) return true; // Mobile: mostrar todas se <= 3
    if (totalPages <= 5) return page >= 1 && page <= 5; // Tablet

    // Desktop: mostrar primeira, última e ao redor da atual
    if (page === 1 || page === totalPages) return true;
    if (page >= currentPage - 1 && page <= currentPage + 1) return true;
    return false;
  });

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
      {/* Botão anterior */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || loading}
        className="p-2 hover:bg-background rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-card flex-shrink-0"
        aria-label="Previous page"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Números das páginas */}
      <div className="flex gap-1 flex-wrap justify-center">
        {visiblePages.map((page, idx) => {
          const prevPage = visiblePages[idx - 1];

          return (
            <div key={page} className="flex items-center gap-1">
              {prevPage && page - prevPage > 1 && (
                <span className="px-2 py-1 text-text-secondary text-xs sm:text-sm">...</span>
              )}
              <button
                type="button"
                onClick={() => onPageChange(page)}
                disabled={loading}
                className={`px-2 sm:px-3 py-2 rounded-lg transition-colors border text-xs sm:text-sm font-medium ${
                  currentPage === page
                    ? "bg-primary text-white border-primary"
                    : "border-card hover:bg-background"
                }`}
                aria-label={`Go to page ${page}`}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </button>
            </div>
          );
        })}
      </div>

      {/* Botão próximo */}
      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || loading}
        className="p-2 hover:bg-background rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-card flex-shrink-0"
        aria-label="Next page"
      >
        <ChevronRight size={18} />
      </button>

      {/* Info de páginas - responsivo */}
      <span className="text-xs sm:text-sm text-text-secondary mt-2 sm:mt-0 w-full sm:w-auto text-center sm:text-right">
        Page <span className="font-semibold">{currentPage}</span> of{" "}
        <span className="font-semibold">{totalPages}</span>
      </span>
    </div>
  );
}
