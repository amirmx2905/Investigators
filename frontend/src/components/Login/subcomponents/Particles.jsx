import React from 'react';

function Particles() {
  return (
    <>
      {/* Partículas grandes */}
      <div className="particle float-lt md:w-96 md:h-96 w-64 h-64 bg-blue-600 top-10 left-10"></div>
      <div className="particle float-rt md:w-80 md:h-80 w-56 h-56 bg-indigo-600 top-10 right-10"></div>
      <div className="particle float-rb md:w-72 md:h-72 w-48 h-48 bg-purple-600 bottom-10 right-10"></div>
      <div className="particle float-lb md:w-64 md:h-64 w-40 h-40 bg-cyan-600 bottom-10 left-10"></div>

      {/* Partículas medianas */}
      <div className="small-particle float-zigzag md:w-32 md:h-32 w-20 h-20 bg-blue-400 top-1/3 left-1/5"></div>
      <div className="small-particle float-diagonal md:w-28 md:h-28 w-16 h-16 bg-indigo-400 bottom-1/3 right-1/5"></div>

      {/* Partículas pequeñas */}
      <div className="tiny-particle float-circle md:w-16 md:h-16 w-8 h-8 bg-blue-300 top-1/6 left-1/6"></div>
      <div className="tiny-particle float-diagonal md:w-12 md:h-12 w-6 h-6 bg-indigo-300 bottom-1/6 right-1/6"></div>
      <div className="tiny-particle float-diagonal2 md:w-14 md:h-14 w-8 h-8 bg-purple-300 top-2/3 right-1/5"></div>
      <div className="tiny-particle float-circle md:w-10 md:h-10 w-6 h-6 bg-cyan-300 bottom-2/3 left-1/5"></div>
    </>
  );
}

export default Particles;