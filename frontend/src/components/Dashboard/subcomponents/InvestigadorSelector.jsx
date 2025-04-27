function InvestigadorSelector({ investigadores, onSelect, selectedId }) {
  return (
    <div className="w-64">
      <label className="block text-sm font-medium text-gray-300 mb-2">
        Filtrar por Investigador:
      </label>
      <select
        value={selectedId || ""}
        onChange={(e) =>
          onSelect(e.target.value === "" ? null : Number(e.target.value))
        }
        className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">Todos los investigadores</option>
        {investigadores.map((inv) => (
          <option key={inv.id} value={inv.id}>
            {inv.nombre}
          </option>
        ))}
      </select>
    </div>
  );
}

export default InvestigadorSelector;
