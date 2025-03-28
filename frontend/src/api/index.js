import api from "./apiConfig";
import { usuarioService } from "./services/usuarioService";
import { investigadorService } from "./services/investigadorService";
import { proyectoService } from "./services/proyectoService";

// Exportar todos los servicios
export {
  // La instancia de API
  api,

  // Servicios de las entdades (tablas)
  usuarioService,
  investigadorService,
  proyectoService,
};
