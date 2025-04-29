import { columnOrders } from "../hooks/useTableControls";
import {
  UsuarioTable,
  InvestigadorTable,
  ProyectoTable,
  EstudianteTable, 
  ArticuloTable,
  EventoTable,
} from "../subcomponents/Tables/tables"; 
import {
  UsuarioCards,
  InvestigadorCards,
  ProyectoCards,
  EstudianteCards,
  ArticuloCards,
  EventoCards,
  CarreraCards,
  EspecialidadCards,
  UnidadCards,
  LineaCards,
  NivelCards,
  TipoestudiantesCards,
  RoleventoCards,
  JefeareaCards, // Importar el componente de tarjetas para jefes de área
} from "../subcomponents/Cards/cards";

export const sortColumnsByOrder = (columns, tabName) => {
  if (!columns || !Array.isArray(columns)) return [];

  return [...columns].sort((a, b) => {
    const orderA = columnOrders[tabName].indexOf(a);
    const orderB = columnOrders[tabName].indexOf(b);
    if (orderA === -1) return 1;
    if (orderB === -1) return -1;
    return orderA - orderB;
  });
};

export const getTabData = ( 
  activeTab,
  visibleColumns,
  usuarios,
  investigadores,
  proyectos,
  estudiantes,
  articulos,
  eventos,
  carreras,
  especialidades,
  unidades,
  lineas,
  niveles,
  tiposestudiante,
  roleventos,
  jefesareas, // Añadir jefesareas como parámetro
  handleEdit,
  handleDeleteClick
) => {
  let type = "";

  switch (activeTab) {
    case "usuarios":
      type = "usuario";
      break;
    case "investigadores":
      type = "investigador";
      break;
    case "proyectos":
      type = "proyecto";
      break;
    case "estudiantes":
      type = "estudiante";
      break;
    case "articulos":
      type = "articulo";
      break;
    case "eventos":
      type = "evento";
      break;
    case "carreras":
      type = "carrera";
      break;
    case "especialidades":
      type = "especialidad";
      break;
    case "unidades":
      type = "unidad";
      break;
    case "lineas":
      type = "linea";
      break;
    case "niveles":
      type = "nivel";
      break;
    case "tiposestudiante":
      type = "tipoestudiante";
      break;
    case "roleventos":
      type = "rolevento";
      break;
    case "jefesareas": // Añadir caso para jefes de área
      type = "jefearea";
      break;
    default:
      type = "usuario";
  }

  const orderedColumns = {
    usuarios: sortColumnsByOrder(visibleColumns.usuarios || [], "usuarios"),
    investigadores: sortColumnsByOrder(visibleColumns.investigadores || [],"investigadores"),
    proyectos: sortColumnsByOrder(visibleColumns.proyectos || [], "proyectos"),
    estudiantes: sortColumnsByOrder(visibleColumns.estudiantes || [],"estudiantes"),
    articulos: sortColumnsByOrder(visibleColumns.articulos || [], "articulos"),
    eventos: sortColumnsByOrder(visibleColumns.eventos || [], "eventos"),
    carreras: sortColumnsByOrder(visibleColumns.carreras || [], "carreras"),
    especialidades: sortColumnsByOrder(visibleColumns.especialidades || [],"especialidades"),
    unidades: sortColumnsByOrder(visibleColumns.unidades || [], "unidades"),
    lineas: sortColumnsByOrder(visibleColumns.lineas || [], "lineas"),
    niveles: sortColumnsByOrder(visibleColumns.niveles || [], "niveles"),
    tiposestudiante: sortColumnsByOrder(visibleColumns.tiposestudiante || [],"tiposestudiante"),
    roleventos: sortColumnsByOrder(visibleColumns.roleventos || [], "roleventos"),
    jefesareas: sortColumnsByOrder(visibleColumns.jefesareas || [], "jefesareas"), // Añadir ordenación para jefes de área
  };

  const tabConfig = {
    usuarios: {
      title: "Lista de Usuarios",
      items: usuarios || [],
      TableComponent: UsuarioTable,
      CardComponent: UsuarioCards,
      columns: orderedColumns.usuarios,
      onEdit: (item) => handleEdit(type, item),
      onDelete: (item) => handleDeleteClick(type, item),
    },
    investigadores: {
      title: "Lista de Investigadores",
      items: investigadores || [],
      TableComponent: InvestigadorTable,
      CardComponent: InvestigadorCards,
      columns: orderedColumns.investigadores,
      onEdit: (item) => handleEdit(type, item),
      onDelete: (item) => handleDeleteClick(type, item),
    },
    proyectos: {
      title: "Lista de Proyectos",
      items: proyectos || [],
      TableComponent: ProyectoTable,
      CardComponent: ProyectoCards,
      columns: orderedColumns.proyectos,
      onEdit: (item) => handleEdit(type, item),
      onDelete: (item) => handleDeleteClick(type, item),
    },
    estudiantes: {
      title: "Lista de Estudiantes",
      items: estudiantes || [],
      TableComponent: EstudianteTable,
      CardComponent: EstudianteCards,
      columns: orderedColumns.estudiantes,
      onEdit: (item) => handleEdit(type, item),
      onDelete: (item) => handleDeleteClick(type, item),
    },
    articulos: {
      title: "Lista de Artículos",
      items: articulos || [],
      TableComponent: ArticuloTable,
      CardComponent: ArticuloCards,
      columns: orderedColumns.articulos,
      onEdit: (item) => handleEdit(type, item),
      onDelete: (item) => handleDeleteClick(type, item),
    },
    eventos: {
      title: "Lista de Eventos",
      items: eventos || [],
      TableComponent: EventoTable,
      CardComponent: EventoCards,
      columns: orderedColumns.eventos,
      onEdit: (item) => handleEdit(type, item),
      onDelete: (item) => handleDeleteClick(type, item),
    },
    carreras: {
      title: "Lista de Carreras",
      items: carreras || [],
      TableComponent: null,
      CardComponent: CarreraCards,
      columns: orderedColumns.carreras,
      onEdit: (item) => handleEdit(type, item),
      onDelete: (item) => handleDeleteClick(type, item),
    },
    especialidades: {
      title: "Lista de Especialidades",
      items: especialidades || [],
      TableComponent: null,
      CardComponent: EspecialidadCards,
      columns: orderedColumns.especialidades,
      onEdit: (item) => handleEdit(type, item),
      onDelete: (item) => handleDeleteClick(type, item),
    },
    unidades: {
      title: "Lista de Unidades",
      items: unidades || [],
      TableComponent: null,
      CardComponent: UnidadCards,
      columns: orderedColumns.unidades,
      onEdit: (item) => handleEdit(type, item),
      onDelete: (item) => handleDeleteClick(type, item),
    },
    lineas: {
      title: "Lista de Líneas",
      items: lineas || [],
      TableComponent: null,
      CardComponent: LineaCards,
      columns: orderedColumns.lineas,
      onEdit: (item) => handleEdit(type, item),
      onDelete: (item) => handleDeleteClick(type, item),
    },
    niveles: {
      title: "Lista de Niveles",
      items: niveles || [],
      TableComponent: null,
      CardComponent: NivelCards,
      columns: orderedColumns.niveles,
      onEdit: (item) => handleEdit(type, item),
      onDelete: (item) => handleDeleteClick(type, item),
    },
    tiposestudiante: {
      title: "Lista de Tipos de Estudiantes",
      items: tiposestudiante || [],
      TableComponent: null,
      CardComponent: TipoestudiantesCards,
      columns: orderedColumns.tiposestudiante,
      onEdit: (item) => handleEdit(type, item),
      onDelete: (item) => handleDeleteClick(type, item),
    },
    roleventos: {
      title: "Lista de Roles de Eventos",
      items: roleventos || [],
      TableComponent: null, 
      CardComponent: RoleventoCards,
      columns: orderedColumns.roleventos,
      onEdit: (item) => handleEdit(type, item),
      onDelete: (item) => handleDeleteClick(type, item),
    },
    jefesareas: { // Añadir configuración para jefes de área
      title: "Lista de Jefes de Área",
      items: jefesareas || [],
      TableComponent: null,
      CardComponent: JefeareaCards,
      columns: orderedColumns.jefesareas,
      onEdit: (item) => handleEdit(type, item),
      onDelete: (item) => handleDeleteClick(type, item),
    },
  };

  return tabConfig[activeTab] || tabConfig.usuarios;
};
