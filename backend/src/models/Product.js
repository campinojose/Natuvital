const mongoose = require('mongoose');


const ProductSchema = new mongoose.Schema({
nombre: { type: String, required: true, trim: true },
fechaVencimiento: { type: Date, required: true },
registrado: { type: Boolean, default: false },
precioMayorista: { type: Number, required: true, min: 0 },
precioPublico: { type: Number, required: true, min: 0 },
cantidad: { type: Number, required: true, min: 0 },
imagenUrl: { type: String, trim: true }
}, { timestamps: true });


module.exports = mongoose.model('Product', ProductSchema);