import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function LoginToast() {
  return (
    <ToastContainer 
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover={false}
      theme="dark"
      closeButton={false}
      style={{
        zIndex: 99999,
        pointerEvents: "none"
      }}
      toastClassName="non-interactive-toast"
      icon={({ type }) => {
        return type === 'error' ? (
          <div className="flex items-center justify-center w-8 h-8 error-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        ) : (
          <div className="flex items-center justify-center w-8 h-8 check-icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        );
      }}
      progressStyle={{
        background: "linear-gradient(to right, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0.7))",
        height: "3px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)"
      }}
    />
  );
}

export default LoginToast;