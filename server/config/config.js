// =============
// puerto
// =============
process.env.PORT = process.env.PORT || 3000;

// =============
// Entorno
// =============
process.env.NODE_ENV = process.env.NODE_ENV || 'DEV';

// =============
// Token (JWT)
// =============
// 60s * 60min * 24h * 30dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;
process.env.JWT_KEY = process.env.JWT_KEY || 'seed-desarrollo';

// =============
// Base de datos
// =============
let urlDB = process.env.NODE_ENV === 'DEV' ? 'mongodb://localhost:27017/cafe' : process.env.MONGODB_URI;
process.env.URL_DB = urlDB;