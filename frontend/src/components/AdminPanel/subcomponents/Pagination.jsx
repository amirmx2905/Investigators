import React from 'react';

function Pagination({ totalItems, itemsPerPage, currentPage, paginate }) {
  const pageNumbers = [];
  
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  
  const safePage = Math.min(Math.max(1, currentPage), totalPages);
  
  if (currentPage !== safePage) {
    setTimeout(() => paginate(safePage), 0);
    return null;
  }
  
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  let displayedPageNumbers = [];
  
  if (totalPages <= 5) {
    displayedPageNumbers = pageNumbers;
  } else {
    if (safePage <= 3) {
      displayedPageNumbers = [1, 2, 3, 4, '...', totalPages];
    } else if (safePage >= totalPages - 2) {
      displayedPageNumbers = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      displayedPageNumbers = [1, '...', safePage - 1, safePage, safePage + 1, '...', totalPages];
    }
  }
  
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <div className="flex justify-center mt-6">
      <nav className="flex items-center space-x-1">
        {/* Botón Anterior */}
        <button
          onClick={() => safePage > 1 && paginate(safePage - 1)}
          disabled={safePage === 1}
          className={`cursor-pointer px-3 py-1 rounded-md ${
            safePage === 1
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:bg-gray-700 hover:text-blue-300'
          } transition-colors duration-200`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
        
        {/* Números de página */}
        {displayedPageNumbers.map((number, index) => (
          <button
            key={index}
            onClick={() => typeof number === 'number' && paginate(number)}
            className={`cursor-pointer px-3 py-1 rounded-md transition-all duration-200 ${
              safePage === number
                ? 'bg-blue-600 text-white hover:bg-blue-700 transform scale-105'
                : typeof number === 'number'
                ? 'text-gray-300 hover:bg-gray-700 hover:text-blue-300'
                : 'text-gray-500 cursor-default'
            }`}
            disabled={typeof number !== 'number'}
          >
            {number}
          </button>
        ))}
        
        {/* Botón Siguiente */}
        <button
          onClick={() => safePage < totalPages && paginate(safePage + 1)}
          disabled={safePage === totalPages}
          className={`cursor-pointer px-3 py-1 rounded-md ${
            safePage === totalPages
              ? 'text-gray-500 cursor-not-allowed'
              : 'text-gray-300 hover:bg-gray-700 hover:text-blue-300'
          } transition-colors duration-200`}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 20 20" 
            fill="currentColor"
          >
            <path 
              fillRule="evenodd" 
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
              clipRule="evenodd" 
            />
          </svg>
        </button>
      </nav>
    </div>
  );
}

export default Pagination;