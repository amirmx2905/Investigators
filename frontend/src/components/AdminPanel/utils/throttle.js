/**
 * Limita la frecuencia de ejecución de una función
 * @param {Function} fn - Función a ejecutar
 * @param {number} delay - Tiempo de espera en ms
 * @returns {Function} - Función throttled
 */
export function throttle(fn, delay) {
  let lastCall = 0;

  return function (...args) {
    const now = new Date().getTime();

    if (now - lastCall < delay) {
      return;
    }

    lastCall = now;
    return fn(...args);
  };
}
