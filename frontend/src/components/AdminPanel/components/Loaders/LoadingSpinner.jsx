import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center h-64">
      <div className="w-16 h-16 relative">
        <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin"></div>
        <div
          className="w-16 h-16 rounded-full absolute top-0 left-0 border-4 border-transparent border-b-indigo-500 animate-spin"
          style={{ animationDuration: "1.5s" }}
        ></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
