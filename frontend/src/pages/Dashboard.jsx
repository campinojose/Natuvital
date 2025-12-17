import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { productService } from '../services/productService';
import { salesService } from '../services/salesService';
import ProductTable from '../components/ProductTable';
import ProductForm from '../components/ProductForm';
import SalesTable from '../components/SalesTable';
import SaleForm from '../components/SaleForm';
import WelcomeBanner from '../components/WelcomeBanner';
import { Plus, LogOut, Package, Search } from 'lucide-react';

const Dashboard = () => {
  const { logout, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Sales state
  const [sales, setSales] = useState([]);
  const [salesLoading, setSalesLoading] = useState(true);
  const [salesDate, setSalesDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSaleForm, setShowSaleForm] = useState(false);
  const [salesTotals, setSalesTotals] = useState({});
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProducts();
      loadSales(salesDate);
    }
  }, [isAuthenticated]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const filters = searchTerm ? { nombre: searchTerm } : {};
      const response = await productService.getAll(filters);
      setProducts(response.data);
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (isAuthenticated) {
        loadProducts();
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Sales functions
  const loadSales = async (date) => {
    try {
      setSalesLoading(true);
      const response = await salesService.getAll({ date });
      setSales(response.data);
      const totalsRes = await salesService.totals(date);
      setSalesTotals(totalsRes.data || {});
    } catch (error) {
      console.error('Error cargando ventas:', error);
    } finally {
      setSalesLoading(false);
    }
  };

  const handleDateChange = (d) => {
    setSalesDate(d);
    loadSales(d);
  };

  const handleOpenSaleForm = () => setShowSaleForm(true);

  const handleCreateSale = async (data) => {
    try {
      const res = await salesService.create(data);
      const created = res.data;
      setShowSaleForm(false);

      // show success notice
      setNotice({ type: 'success', message: 'Venta registrada correctamente' });
      setTimeout(() => setNotice(null), 3000);

      // Determine date part of the soldAt and load that day's sales so the new sale appears
      if (created && created.soldAt) {
        const d = new Date(created.soldAt);
        const dateStr = d.toISOString().split('T')[0];
        setSalesDate(dateStr);
        await loadSales(dateStr);
      } else {
        // fallback: reload current filter
        await loadSales(salesDate);
      }

      loadProducts(); // update stock
    } catch (error) {
      console.error('Error registrando venta:', error);
      alert(error.response?.data?.message || 'Error al registrar la venta');
    }
  };


  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      return;
    }

    try {
      await productService.delete(id);
      loadProducts();
    } catch (error) {
      console.error('Error eliminando producto:', error);
      alert('Error al eliminar el producto');
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingProduct) {
        await productService.update(editingProduct._id, data);
      } else {
        await productService.create(data);
      }
      setShowForm(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Error guardando producto:', error);
      alert(error.response?.data?.message || 'Error al guardar el producto');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-green-600 p-2 rounded-lg">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Natuvital - Gestión de Productos</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <WelcomeBanner />
        
        {/* Actions Bar */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nombre..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
          <button
            onClick={handleCreate}
            className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition shadow-sm"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Producto</span>
          </button>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
            loading={loading}
          />
        </div>

        {/* Sales Section (below products) */}
        {notice && (
          <div className={`mb-4 px-4 py-3 rounded border ${notice.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 'bg-yellow-50 border-yellow-200 text-yellow-800'}`}>
            {notice.message}
          </div>
        )}
        <SalesTable
          sales={sales}
          loading={salesLoading}
          date={salesDate}
          onDateChange={handleDateChange}
          totals={salesTotals}
          onOpenForm={handleOpenSaleForm}
        />


      </main>

      {/* Product Form Modal */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSubmit={handleSubmit}
          loading={false}
        />
      )}

      {/* Sale Form Modal */}
      {showSaleForm && (
        <SaleForm
          products={products}
          onClose={() => setShowSaleForm(false)}
          onSubmit={handleCreateSale}
        />
      )}
    </div>
  );
};

export default Dashboard;

