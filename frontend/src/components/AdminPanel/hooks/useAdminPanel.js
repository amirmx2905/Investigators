import { useState, useEffect } from "react";
import { getUsuarios, getInvestigadores, getProyectos } from "../../../api";
import { toast } from "react-toastify";

export function useAdminPanel() {
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [investigadores, setInvestigadores] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [activeTab, setActiveTab] = useState("usuarios");
  const [tabTransitioning, setTabTransitioning] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si el dispositivo es móvil
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => {
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  // Mostrar el panel con animación
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Cargar datos iniciales
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Simular retraso de carga para mostrar el spinner
        await new Promise((resolve) => setTimeout(resolve, 800));

        const [usuariosData, investigadoresData, proyectosData] =
          await Promise.all([
            getUsuarios(),
            getInvestigadores(),
            getProyectos(),
          ]);

        setUsuarios(usuariosData);
        setInvestigadores(investigadoresData);
        setProyectos(proyectosData);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar los datos", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Cambiar pestaña con transición suave
  const changeTab = (tab) => {
    if (tab === activeTab) return;

    setTabTransitioning(true);

    // Tiempo para la animación de salida
    setTimeout(() => {
      setActiveTab(tab);

      // Tiempo para la animación de entrada
      setTimeout(() => {
        setTabTransitioning(false);
      }, 300);
    }, 300);
  };

  return {
    loading,
    setLoading,
    usuarios,
    setUsuarios,
    investigadores,
    setInvestigadores,
    proyectos,
    setProyectos,
    activeTab,
    changeTab,
    tabTransitioning,
    isVisible,
    setIsVisible,
    isMobile,
    setIsMobile,
  };
}
