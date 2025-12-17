import api from '../config/axios';

export const salesService = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.date) params.append('date', filters.date);
    if (filters.vendedor) params.append('vendedor', filters.vendedor);
    return api.get(`/ventas?${params.toString()}`);
  },

  create: (sale) => api.post('/ventas', sale),

  totals: (date) => {
    const params = new URLSearchParams();
    if (date) params.append('date', date);
    return api.get(`/ventas/totales?${params.toString()}`);
  }
};
