require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');


const authRoutes = require('./routes/auth.routes');
const productRoutes = require('./routes/product.routes');


const app = express();
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173', 'http://localhost:3000', 'http://127.0.0.1:5173'];

app.use(cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (como mobile apps o Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes('*')) {
      callback(null, true);
    } else {
      callback(new Error('No permitido por CORS'));
    }
  },
  credentials: true
}));
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);


const PORT = process.env.PORT || 4000;


mongoose.connect(process.env.MONGODB_URI)
.then(() => {
console.log('Mongo conectado');
app.listen(PORT, () => console.log('Server en puerto', PORT));
})
.catch(err => {
console.error('Error conectando Mongo:', err);
});