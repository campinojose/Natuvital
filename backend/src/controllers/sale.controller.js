const Sale = require('../models/Sale');
const Product = require('../models/Product');


exports.create = async (req, res) => {
  try {
    const { producto, vendedor, soldAt, cantidad = 1, costo, precioVenta } = req.body;

    const prod = await Product.findById(producto);
    if (!prod) return res.status(404).json({ message: 'Producto no encontrado' });

    if (prod.cantidad < cantidad) return res.status(400).json({ message: 'Stock insuficiente' });

    const saleData = {
      producto: prod._id,
      nombreProducto: prod.nombre,
      vendedor,
      soldAt: soldAt || new Date(),
      cantidad,
      costo: typeof costo === 'number' ? costo : prod.precioMayorista,
      precioVenta: precioVenta,
    };

    const sale = new Sale(saleData);
    await sale.validate(); // triggers ganancia calc
    await sale.save();

    // disminuir stock
    prod.cantidad = prod.cantidad - cantidad;
    if (prod.cantidad < 0) prod.cantidad = 0;
    await prod.save();

    res.status(201).json(sale);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: err.message });
  }
};


exports.getAll = async (req, res) => {
  try {
    const { date, vendedor } = req.query;
    const filter = {};

    if (vendedor) filter.vendedor = { $regex: vendedor, $options: 'i' };
    if (date) {
      // Construir rangos usando la fecha local para evitar desplazamientos por timezone
      const start = new Date(`${date}T00:00:00`);
      const end = new Date(`${date}T23:59:59.999`);
      filter.soldAt = { $gte: start, $lte: end };
    }

    const sales = await Sale.find(filter).sort({ soldAt: -1 }).populate('producto');
    res.json(sales);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.totals = async (req, res) => {
  try {
    const { date } = req.query;
    const match = {};
    if (date) {
      // Construir rangos usando la fecha local para evitar desplazamientos por timezone
      const start = new Date(`${date}T00:00:00`);
      const end = new Date(`${date}T23:59:59.999`);
      match.soldAt = { $gte: start, $lte: end };
    }

    const agg = await Sale.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          totalGanancia: { $sum: '$ganancia' },
          totalIngreso: { $sum: { $multiply: ['$precioVenta', '$cantidad'] } },
          totalVentas: { $sum: 1 }
        }
      }
    ]);

    const result = agg[0] || { totalGanancia: 0, totalIngreso: 0, totalVentas: 0 };
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
