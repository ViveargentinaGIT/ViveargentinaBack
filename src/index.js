const app = require("./app.js");
const { conn } = require("./database.js");

// Syncing all the models at once.
// force/alter
const port = 3001;
conn.sync({ alter: true }).then(() => {
  app.listen(port, () => {
    console.log("%s listening at ", port); // eslint-disable-line no-console
  });
});
