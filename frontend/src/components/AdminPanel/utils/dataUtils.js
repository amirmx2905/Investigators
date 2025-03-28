import { columnOrders } from "../hooks/useTableControls";
import {
  UsuarioTable,
  InvestigadorTable,
  ProyectoTable,
} from "../subcomponents/Tables/tables";
import {
  UsuarioCards,
  InvestigadorCards,
  ProyectoCards,
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
    default:
      type = "usuario";
  }

  // Obtener columnas visibles ordenadas según el orden definido
  const orderedColumns = {
    usuarios: sortColumnsByOrder(visibleColumns.usuarios || [], "usuarios"),
    investigadores: sortColumnsByOrder(
      visibleColumns.investigadores || [],
      "investigadores"
    ),
    proyectos: sortColumnsByOrder(visibleColumns.proyectos || [], "proyectos"),
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
  };

  return tabConfig[activeTab] || tabConfig.usuarios;
};
