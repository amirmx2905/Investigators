import React from 'react';

function LoginForm({ 
  username, 
  setUsername, 
  password, 
  setPassword, 
  isLoading, 
  handleLogin 
}) {
  return (
    <form
      onSubmit={handleLogin}
      noValidate
      className="bg-gray-800/80 backdrop-blur-md p-6 md:p-10 rounded-lg shadow-2xl w-full sm:w-[400px] md:w-[450px] transition duration-500 glowing-border border border-blue-500/30"
    >
      <h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 appear-up">
        Investigators
      </h1>

      <div
        className="mb-5 md:mb-6 appear-up"
        style={{ animationDelay: "0.1s" }}
      >
        <label className="block text-sm font-medium mb-2 text-blue-300">
          Usuario
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 field-animation"
          style={{ backdropFilter: "blur(4px)" }}
        />
      </div>

      <div
        className="mb-6 md:mb-8 appear-up"
        style={{ animationDelay: "0.2s" }}
      >
        <label className="block text-sm font-medium mb-2 text-blue-300">
          Contraseña
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-gray-700/70 border border-gray-600 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 field-animation"
          style={{ backdropFilter: "blur(4px)" }}
        />
      </div>

      <div className="appear-up" style={{ animationDelay: "0.3s" }}>
        <button
          type="submit"
          disabled={isLoading}
          className={`cursor-pointer w-full bg-blue-600 text-white py-2.5 md:py-3 rounded-lg hover:bg-blue-700 transform hover:scale-105 shadow-lg button-hover-effect h-11 md:h-12 flex items-center justify-center ${
            isLoading ? "button-loading opacity-90" : ""
          }`}
        >
          {isLoading ? (
            <div className="dots flex justify-center">
              <span className="w-2 h-2 mx-1 bg-white rounded-full inline-block"></span>
              <span className="w-2 h-2 mx-1 bg-white rounded-full inline-block"></span>
              <span className="w-2 h-2 mx-1 bg-white rounded-full inline-block"></span>
            </div>
          ) : (
            "Iniciar Sesión"
          )}
        </button>
      </div>
    </form>
  );
}

export default LoginForm;