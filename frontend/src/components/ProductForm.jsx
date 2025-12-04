import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const ProductForm = ({ product, onClose, onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    fechaVencimiento: '',
    registrado: false,
    precioMayorista: '',
    precioPublico: '',
    cantidad: '',
  });

  useEffect(() => {
    if (product) {
      const fecha = new Date(product.fechaVencimiento).toISOString().split('T')[0];
      setFormData({
        nombre: product.nombre || '',
        fechaVencimiento: fecha,
        registrado: product.registrado || false,
        precioMayorista: product.precioMayorista || '',
        precioPublico: product.precioPublico || '',
        cantidad: product.cantidad || '',
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      precioMayorista: Number(formData.precioMayorista),
      precioPublico: Number(formData.precioPublico),
      cantidad: Number(formData.cantidad),
    };
    onSubmit(data);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
              Nombre del Producto *
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="Pon aquí el nombre del producto"
            />
          </div>

          <div>
            <label htmlFor="fechaVencimiento" className="block text-sm font-medium text-gray-700 mb-2">
              Fecha de Vencimiento *
            </label>
            <input
              type="date"
              id="fechaVencimiento"
              name="fechaVencimiento"
              value={formData.fechaVencimiento}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="registrado"
              name="registrado"
              checked={formData.registrado}
              onChange={handleChange}
              className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <label htmlFor="registrado" className="ml-2 text-sm font-medium text-gray-700">
              Producto Registrado
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="precioMayorista" className="block text-sm font-medium text-gray-700 mb-2">
                Precio Mayorista *
              </label>
              <input
                type="number"
                id="precioMayorista"
                name="precioMayorista"
                value={formData.precioMayorista}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="0.00"
              />
            </div>

            <div>
              <label htmlFor="precioPublico" className="block text-sm font-medium text-gray-700 mb-2">
                Precio Público *
              </label>
              <input
                type="number"
                id="precioPublico"
                name="precioPublico"
                value={formData.precioPublico}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label htmlFor="cantidad" className="block text-sm font-medium text-gray-700 mb-2">
              Cantidad Disponible *
            </label>
            <input
              type="number"
              id="cantidad"
              name="cantidad"
              value={formData.cantidad}
              onChange={handleChange}
              required
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              placeholder="0"
            />
          </div>

          <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? 'Guardando...' : product ? 'Actualizar' : 'Crear'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;

