// import app from './app.js'
// import {conn} from './database/database.js'

const app = require('./app.js');
const { conn } = require('./database.js');

// Syncing all the models at once.
// force/alter
conn.sync({ force: true }).then(() => {
  app.listen(3001, () => {
    console.log('%s listening at 3001'); // eslint-disable-line no-console
  });
});
// async function main(){
//     try {
//         await conn.authenticate()
//         console.log('conection has been stablished successfully')
//         app.listen(4000)
//         console.log('server is listening on prot ', 4000)
//     } catch (error) {
//         console.log('unable to conect to the database: ', error)
//     }
// }

// main();