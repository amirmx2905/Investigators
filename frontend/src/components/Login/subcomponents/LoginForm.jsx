import React, { useState, useEffect } from "react";

function LoginForm({
  username,
  setUsername,
  password,
  setPassword,
  isLoading,
  handleLogin,
}) {
  const [logoState, setLogoState] = useState("icon");

  useEffect(() => {
    const interval = setInterval(() => {
      setLogoState((prevState) => (prevState === "icon" ? "text" : "icon"));
    }, 10000); 

    return () => clearInterval(interval);
  }, []);

  return (
    <form
      onSubmit={handleLogin}
      noValidate
      className="bg-gray-800/80 backdrop-blur-md p-6 md:p-10 rounded-lg shadow-2xl w-full sm:w-[400px] md:w-[450px] transition duration-500 glowing-border border border-blue-500/30"
    >
      <div className="text-3xl md:text-4xl font-bold mb-6 md:mb-8 text-center appear-up h-20 relative">
        {/* Efectos de energía */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="absolute w-5 h-5 rounded-full bg-blue-500 opacity-40"
            style={{
              filter: "blur(12px)",
              transform:
                logoState === "icon"
                  ? "translate(-30px, 0) scale(4)"
                  : "translate(30px, 0) scale(1)",
              transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          ></div>
          <div
            className="absolute w-5 h-5 rounded-full bg-purple-500 opacity-40"
            style={{
              filter: "blur(12px)",
              transform:
                logoState === "text"
                  ? "translate(-30px, 0) scale(4)"
                  : "translate(30px, 0) scale(1)",
              transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
            }}
          ></div>
        </div>

        {/* Logo */}
        <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
          <div
            style={{
              opacity: logoState === "icon" ? 1 : 0,
              transform:
                logoState === "icon"
                  ? "translateX(0) rotateY(0deg) scale(1)"
                  : "translateX(-50px) rotateY(-90deg) scale(0.8)",
              transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              transformOrigin: "center left",
            }}
          >
            <img
              src="/favicon.svg"
              alt="Investigators"
              className="h-14 md:h-16"
              style={{
                filter:
                  "brightness(1.1) drop-shadow(0 0 4px rgba(59, 130, 246, 0.7))",
              }}
            />
          </div>

          {/* Texto */}
          <div
            style={{
              opacity: logoState === "text" ? 1 : 0,
              transform:
                logoState === "text"
                  ? "translateX(0) rotateY(0deg) scale(1)"
                  : "translateX(50px) rotateY(90deg) scale(0.8)",
              transition: "all 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
              position: "absolute",
              transformOrigin: "center right",
            }}
          >
            <h1
              className="bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 text-transparent bg-clip-text"
              style={{
                filter: "brightness(1.2)",
              }}
            >
              Investigators
            </h1>
          </div>
        </div>
      </div>

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
