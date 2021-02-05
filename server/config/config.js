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
let urlDB = process.env.NODE_ENV === 'DEV' ? 'mongodb://localhost:27017/cafe' : 'mongodb+srv://dominicavs:SftGThHmoDoW0Qo5@cluster0.gouvg.mongodb.net/cafe';
process.env.URL_DB = urlDB;