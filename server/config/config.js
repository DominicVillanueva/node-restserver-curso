// =============
// puerto
// =============
process.env.PORT = process.env.PORT || 3000;

// =============
// Entorno
// =============
process.env.NODE_ENV = process.env.NODE_ENV || 'DEV';

// =============
// Base de datos
// =============
let urlDB = process.env.NODE_ENV === 'DEV' ? 'mongodb://localhost:27017/cafe' : process.env.MONGODB_URI;
process.env.URL_DB = urlDB;