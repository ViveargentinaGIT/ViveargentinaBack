require('dotenv').config();

const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');

const sequelize = new Sequelize('postgres://postgres:yezidfortich@localhost:5433/viveargentina')

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, '/models'))
.filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
.forEach((file) => {
    // console.log(require(path.join(__dirname, '/models', file)))
    modelDefiners.push(require(path.join(__dirname, '/models', file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [entry[0][0].toUpperCase() + entry[0].slice(1), entry[1]]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const {
  Administrator,
  Category,
  Experience,
  Package,
  Provider,
  Province,
  Query,
  Region,
  Reservation,
  Review,
  User
} = sequelize.models;

// Aca vendrian las relaciones
// Product.hasMany(Reviews);

Category.hasMany(Experience);
Experience.belongsTo(Category);
Region.hasMany(Province);
Province.belongsTo(Region);
Province.hasMany(Package);
Package.belongsTo(Province);
Package.hasMany(Experience);
Experience.belongsTo(Package);
// Experience.hasMany(Reservation);
// Reservation.hasMany(Experience);
User.hasMany(Query);
Query.belongsTo(User);
User.hasMany(Review);
Review.belongsTo(User)
User.belongsToMany(Package, {through: 'reservation'});
Package.belongsToMany(User, {through: 'reservation'});
Provider.belongsToMany(Experience, {through: 'provider_experience'});
Experience.belongsToMany(Provider, {through: 'provider_experience'});


module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize,     // para importart la conexión { conn } = require('./db.js');
};