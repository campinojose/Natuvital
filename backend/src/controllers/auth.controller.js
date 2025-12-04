const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();


exports.login = async (req, res) => {
const { email, password } = req.body;
if (!email || !password) return res.status(400).json({ message: 'Email y password requeridos' });

// Logs para debugging (remover en producción)
console.log('Login intentado:');
console.log('Email recibido:', email);
console.log('Email esperado:', process.env.ADMIN_EMAIL);
console.log('Emails coinciden?', email === process.env.ADMIN_EMAIL);
console.log('Tiene hash?', !!process.env.ADMIN_PASSWORD_HASH);

if (email !== process.env.ADMIN_EMAIL) {
  console.log('Email no coincide');
  return res.status(401).json({ message: 'Credenciales inválidas' });
}

const hash = process.env.ADMIN_PASSWORD_HASH;
const match = hash ? bcrypt.compareSync(password, hash) : (password === process.env.ADMIN_PASSWORD);
if (!match) {
  console.log('Contraseña no coincide');
  return res.status(401).json({ message: 'Credenciales inválidas' });
}

console.log('Login exitoso');
const token = jwt.sign({ id: email, email }, process.env.JWT_SECRET, { expiresIn: '8h' });
res.json({ token });
};