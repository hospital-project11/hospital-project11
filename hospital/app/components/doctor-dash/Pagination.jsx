'use client';
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  hasNextPage, 
  hasPrevPage,
  colors 
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    // Always show first and last page
    // For small number of pages, show all
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // For larger number of pages, show current page with neighbors
    // and first/last pages with ellipsis
    const pages = [];
    
    // Always add page 1
    pages.push(1);
    
    // If current page is close to start, don't show first ellipsis
    if (currentPage <= 4) {
      pages.push(2, 3, 4, 5);
    } else {
      pages.push('...');
      
      // Show two pages before current page
      pages.push(currentPage - 2, currentPage - 1, currentPage);
    }
    
    // If current page is close to end, don't show last ellipsis
    if (currentPage >= totalPages - 3) {
      pages.push(totalPages - 3, totalPages - 2, totalPages - 1);
    } else {
      // Show two pages after current page
      pages.push(currentPage + 1, currentPage + 2);
      pages.push('...');
    }
    
    // Always add last page if not already added
    if (pages[pages.length - 1] !== totalPages) {
      pages.push(totalPages);
    }
    
    // Remove duplicates and sort
    return [...new Set(pages)].sort((a, b) => {
      if (a === '...') return 0;
      if (b === '...') return 0;
      return a - b;
    });
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex items-center justify-center space-x-1">
      {/* Previous button */}
      <button
        onClick={() => hasPrevPage && onPageChange(currentPage - 1)}
        disabled={!hasPrevPage}
        className="flex items-center justify-center p-2 rounded-md transition-all"
        style={{
          backgroundColor: hasPrevPage ? colors.white : colors.background,
          color: hasPrevPage ? colors.primary : colors.text.light,
          cursor: hasPrevPage ? 'pointer' : 'not-allowed'
        }}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page, index) => (
        <React.Fragment key={index}>
          {page === '...' ? (
            <span className="px-3 py-2" style={{ color: colors.text.secondary }}>
              ...
            </span>
          ) : (
            <button
              onClick={() => page !== currentPage && onPageChange(page)}
              className="flex items-center justify-center w-10 h-10 rounded-md transition-all"
              style={{
                backgroundColor: page === currentPage ? colors.primary : colors.white,
                color: page === currentPage ? colors.white : colors.text.primary,
                fontWeight: page === currentPage ? 'bold' : 'normal'
              }}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      {/* Next button */}
      <button
        onClick={() => hasNextPage && onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className="flex items-center justify-center p-2 rounded-md transition-all"
        style={{
          backgroundColor: hasNextPage ? colors.white : colors.background,
          color: hasNextPage ? colors.primary : colors.text.light,
          cursor: hasNextPage ? 'pointer' : 'not-allowed'
        }}
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Pagination;