require('dotenv').config();
const bcrypt = require('bcryptjs');


(async () => {
const plain = process.env.ADMIN_PASSWORD || 'Admin1234!';
const hash = bcrypt.hashSync(plain, 10);
console.log('Contraseña (plain):', plain);
console.log('Hash bcrypt (pon esto en ADMIN_PASSWORD_HASH en .env):');
console.log(hash);
})();