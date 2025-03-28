function Backdrop() {
    return (
      <>
        {/* Rejilla de fondo cyber */}
        <div className="cyber-grid fixed inset-0"></div>
  
        {/* Partículas de luz estáticas */}
        <div className="fixed top-0 left-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-blue-600 rounded-full filter blur-[100px] sm:blur-[120px] md:blur-[150px] opacity-10"></div>
        <div className="fixed bottom-0 right-0 w-64 sm:w-80 md:w-96 h-64 sm:h-80 md:h-96 bg-purple-600 rounded-full filter blur-[100px] sm:blur-[120px] md:blur-[150px] opacity-10"></div>
        <div className="fixed top-1/2 right-1/4 w-40 sm:w-56 md:w-64 h-40 sm:h-56 md:h-64 bg-indigo-600 rounded-full filter blur-[80px] sm:blur-[100px] md:blur-[120px] opacity-10"></div>
        <div className="fixed bottom-1/3 left-1/4 w-48 sm:w-64 md:w-72 h-48 sm:h-64 md:h-72 bg-cyan-600 rounded-full filter blur-[90px] sm:blur-[110px] md:blur-[130px] opacity-10"></div>
      </>
    );
  }
  
  export default Backdrop;