const SalesTable = ({ sales, loading, date, onDateChange, totals, onOpenForm }) => {
  const formatDate = (d) => {
    const date = new Date(d);
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' }) + ' ' +
      date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-gray-800">Registro de Ventas</h2>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={date}
            onChange={(e) => onDateChange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg"
          />
          <button
            onClick={() => onDateChange('')}
            title="Mostrar todas las ventas"
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
          >
            Mostrar todas
          </button>
          <button
            onClick={onOpenForm}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Registrar Venta
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-xs text-gray-500">Ganancia total</div>
          <div className="text-lg font-bold text-gray-800">{formatCurrency(totals?.totalGanancia || 0)}</div>
        </div>
        <div className="p-3 bg-gray-50 rounded">
          <div className="text-xs text-gray-500">Ingresos totales</div>
          <div className="text-lg font-bold text-gray-800">{formatCurrency(totals?.totalIngreso || 0)}</div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha/Hora</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
              <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendedor</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Costo</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Precio Venta</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ganancia</th>
              <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Cantidad</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">Cargando...</td>
              </tr>
            ) : sales.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center">No hay ventas para la fecha seleccionada</td>
              </tr>
            ) : (
              sales.map((s) => (
                <tr key={s._id} className="hover:bg-gray-50 transition">
                  <td className="px-3 py-3 text-sm text-gray-900">{formatDate(s.soldAt)}</td>
                  <td className="px-3 py-3 text-sm font-medium text-gray-900">{s.nombreProducto}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{s.vendedor}</td>
                  <td className="px-3 py-3 text-sm text-right text-gray-900">{formatCurrency(s.costo)}</td>
                  <td className="px-3 py-3 text-sm text-right text-gray-900">{formatCurrency(s.precioVenta)}</td>
                  <td className="px-3 py-3 text-sm text-right text-green-600 font-semibold">{formatCurrency(s.ganancia)}</td>
                  <td className="px-3 py-3 text-sm text-right font-medium">{s.cantidad}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SalesTable;
