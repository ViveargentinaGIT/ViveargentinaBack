require("dotenv").config();

const { Sequelize } = require("sequelize");
const fs = require("fs");
const path = require("path");

const sequelize = new Sequelize(
  "postgres://hyrnrcsr:trMyaT4KZ_TyUxfOQJdBGMX-rO5xI6Ch@jelani.db.elephantsql.com/hyrnrcsr",
  {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    logging: false,
  }
);

const basename = path.basename(__filename);

const modelDefiners = [];

// Leemos todos los archivos de la carpeta Models, los requerimos y agregamos al arreglo modelDefiners
fs.readdirSync(path.join(__dirname, "/models"))
  .filter(
    (file) =>
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
  )
  .forEach((file) => {
    // console.log(require(path.join(__dirname, '/models', file)))
    modelDefiners.push(require(path.join(__dirname, "/models", file)));
  });

// Injectamos la conexion (sequelize) a todos los modelos
modelDefiners.forEach((model) => model(sequelize));
// Capitalizamos los nombres de los modelos ie: product => Product
let entries = Object.entries(sequelize.models);
let capsEntries = entries.map((entry) => [
  entry[0][0].toUpperCase() + entry[0].slice(1),
  entry[1],
]);
sequelize.models = Object.fromEntries(capsEntries);

// En sequelize.models están todos los modelos importados como propiedades
// Para relacionarlos hacemos un destructuring
const {
  Category,
  Experience,
  Package,
  City,
  Query,
  Region,
  Review,
  User,
  Sale,
} = sequelize.models;

// Aca vendrian las relaciones

Category.hasMany(Experience, {
  foreignKey: "categoryId",
});
Experience.belongsTo(Category);

Region.hasMany(City, {
  foreignKey: "regionId",
});
City.belongsTo(Region);

City.hasMany(Package, {
  foreignKey: "cityId",
});
Package.belongsTo(City);

Package.hasMany(Experience, {
  foreignKey: "packageId",
});
Experience.belongsTo(Package);

User.hasMany(Query, {
  foreignKey: "userId",
});
Query.belongsTo(User);

User.hasMany(Review, {
  foreignKey: "userId",
});
Review.belongsTo(User);

User.hasMany(Sale, {
  foreignKey: "userId",
});
Sale.belongsTo(User);

User.belongsToMany(Package, {
  through: "reservation_package",
  foreignKey: "userId",
});
Package.belongsToMany(User, {
  through: "reservation_package",
  foreignKey: "packageId",
});

Sale.belongsToMany(Package, {
  through: "sale_package",
  foreignKey: "saleId",
});
Package.belongsToMany(Sale, {
  through: "sale_package",
  foreignKey: "packageId",
});

User.belongsToMany(Experience, {
  through: "provider_experience",
});
Experience.belongsToMany(User, {
  through: "provider_experience",
});

User.belongsToMany(Experience, {
  through: "reservation_experience",
});
Experience.belongsToMany(User, {
  through: "reservation_experience",
});

Sale.belongsToMany(Experience, {
  through: "sale_experience",
});
Experience.belongsToMany(Sale, {
  through: "sale_experience",
});

module.exports = {
  ...sequelize.models, // para poder importar los modelos así: const { Product, User } = require('./db.js');
  conn: sequelize, // para importart la conexión { conn } = require('./db.js');
};
