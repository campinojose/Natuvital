import api from '../config/axios';

export const productService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.nombre) params.append('nombre', filters.nombre);
    if (filters.stockMin) params.append('stockMin', filters.stockMin);
    if (filters.proximosVencer) params.append('proximosVencer', filters.proximosVencer);
    
    return api.get(`/productos?${params.toString()}`);
  },

  getOne: (id) => api.get(`/productos/${id}`),

  create: (product) => api.post('/productos', product),

  update: (id, product) => api.put(`/productos/${id}`, product),

  delete: (id) => api.delete(`/productos/${id}`),
};

