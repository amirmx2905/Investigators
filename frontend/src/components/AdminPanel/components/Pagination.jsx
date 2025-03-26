import React from 'react';

function Pagination({ totalItems, itemsPerPage, currentPage, paginate }) {
  const pageNumbers = [];
  
  // Calcular total de páginas
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Construir el array de números de página
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }
  
  // Determinar qué números de página mostrar
  let displayedPageNumbers = [];
  
  if (totalPages <= 5) {
    // Si hay 5 o menos páginas, mostrar todas
    displayedPageNumbers = pageNumbers;
  } else {
    // Mostrar siempre la primera y última página
    if (currentPage <= 3) {
      // Cerca del inicio
      displayedPageNumbers = [1, 2, 3, 4, '...', totalPages];
    } else if (currentPage >= totalPages - 2) {
      // Cerca del final
      displayedPageNumbers = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    } else {
      // En medio
      displayedPageNumbers = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
    }
  }
  
  // No mostrar si solo hay una página
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <div className="flex justify-center mt-6">
      <nav className="flex items-center space-x-1">
        {/* Botón Anterior */}
        <button
          onClick={() => currentPage > 1 && paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-3 py-1 rounded-md ${
            currentPage === 1
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
            className={`px-3 py-1 rounded-md transition-all duration-200 ${
              currentPage === number
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
          onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-3 py-1 rounded-md ${
            currentPage === totalPages
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