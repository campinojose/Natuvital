const Product = require('../models/Product');


exports.getAll = async (req, res) => {
    try {
        const { nombre, stockMin, proximosVencer } = req.query;
        const filter = {};
        
        if (nombre) filter.nombre = { $regex: nombre, $options: 'i' };
        if (stockMin) filter.cantidad = { $lte: Number(stockMin) };
        if (proximosVencer) {
            const days = Number(proximosVencer);
            const hoy = new Date();
            const limite = new Date(hoy.getTime() + days * 24 * 60 * 60 * 1000);
            filter.fechaVencimiento = { $lte: limite };
        }

        const products = await Product.find(filter).sort({ fechaVencimiento: 1 });
        res.json(products);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.getOne = async (req, res) => {
    try {
        const p = await Product.findById(req.params.id);
        if (!p) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(p);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


exports.create = async (req, res) => {
    try {
        const { nombre, fechaVencimiento, registrado, precioMayorista, precioPublico, cantidad, imagenUrl } = req.body;
        const p = new Product({
            nombre,
            fechaVencimiento,
            registrado,
            precioMayorista,
            precioPublico,
            cantidad,
            imagenUrl
        });
        await p.save();
        res.status(201).json(p);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.update = async (req, res) => {
    try {
        const p = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!p) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json(p);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


exports.remove = async (req, res) => {
    try {
        const p = await Product.findByIdAndDelete(req.params.id);
        if (!p) return res.status(404).json({ message: 'Producto no encontrado' });
        res.json({ message: 'Eliminado' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
