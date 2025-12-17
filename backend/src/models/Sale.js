const mongoose = require('mongoose');


const SaleSchema = new mongoose.Schema({
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  nombreProducto: { type: String, required: true, trim: true },
  vendedor: { type: String, required: true, trim: true },
  soldAt: { type: Date, default: Date.now },
  cantidad: { type: Number, default: 1, min: 1 },
  costo: { type: Number, required: true, min: 0 },
  precioVenta: { type: Number, required: true, min: 0 },
  ganancia: { type: Number, required: true, min: 0 },
}, { timestamps: true });


SaleSchema.pre('validate', function() {
  const precioVenta = typeof this.precioVenta === 'number' ? this.precioVenta : 0;
  const costo = typeof this.costo === 'number' ? this.costo : 0;
  const cantidad = typeof this.cantidad === 'number' ? this.cantidad : 1;
  this.ganancia = (precioVenta - costo) * cantidad;
});

module.exports = mongoose.model('Sale', SaleSchema);
