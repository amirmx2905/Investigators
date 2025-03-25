import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Barra superior */}
      <header className="bg-gray-800 py-6 shadow-lg fixed top-0 left-0 w-full z-10">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold">Investigators</h1>
        </div>
      </header>

      {/* Contenido principal */}
      <main className="flex-grow container mx-auto px-6  flex items-center justify-center">
        {children}
      </main>

      {/* Barra inferior */}
      <footer className="bg-gray-800 py-6 text-center fixed bottom-0 left-0 w-full">
        <p className="text-base text-gray-400">
          &copy; 2025 Investigators. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
}

export default Layout;