import { useEffect, useState } from 'react';
import { X } from 'lucide-react';

const SaleForm = ({ products, onClose, onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    producto: '',
    vendedor: '',
    soldAt: '',
    cantidad: 1,
    costo: 0,
    precioVenta: 0,
  });

  const toInputDateTime = (d) => {
    if (!d) return '';
    const date = new Date(d);
    const pad = (n) => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  useEffect(() => {
    // If initialData contains values, merge them but ensure soldAt is formatted for datetime-local
    if (Object.keys(initialData).length > 0) {
      setFormData((prev) => ({
        ...prev,
        ...initialData,
        soldAt: initialData.soldAt ? toInputDateTime(initialData.soldAt) : prev.soldAt || toInputDateTime(new Date()),
      }));
      return;
    }

    // Otherwise on first render, set soldAt to now (local) if not already set
    setFormData((prev) => ({ ...prev, soldAt: prev.soldAt || toInputDateTime(new Date()) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialData]);

  useEffect(() => {
    if (formData.producto) {
      const p = products.find((x) => x._id === formData.producto);
      if (p) {
        setFormData((prev) => ({
          ...prev,
          costo: prev.costo || p.precioMayorista,
          precioVenta: prev.precioVenta || p.precioPublico,
        }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.producto]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'cantidad' ? Number(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      cantidad: Number(formData.cantidad),
      costo: Number(formData.costo),
      precioVenta: Number(formData.precioVenta),
    });
  };

  // Render as modal overlay
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">Registrar Venta</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition"><X className="w-6 h-6" /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Producto *</label>
            <select name="producto" value={formData.producto} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg">
              <option value="">Seleccionar producto</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>{p.nombre} (stock: {p.cantidad})</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Vendedor *</label>
            <input name="vendedor" value={formData.vendedor} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cantidad *</label>
              <input name="cantidad" type="number" value={formData.cantidad} min="1" onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Fecha y hora</label>
              <input name="soldAt" type="datetime-local" value={formData.soldAt} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Costo *</label>
              <input name="costo" type="number" min="0" value={formData.costo} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Precio Venta *</label>
              <input name="precioVenta" type="number" min="0" value={formData.precioVenta} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg" />
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button type="button" onClick={onClose} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700">Cancelar</button>
            <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg">Registrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleForm;
