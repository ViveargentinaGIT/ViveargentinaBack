import app from './app.js'
import {sequelize} from './database/database.js'

async function main(){
    try {
        await sequelize.authenticate()
        console.log('conection has been stablished successfully')
        app.listen(4000)
        console.log('server is listening on prot ', 4000)
    } catch (error) {
        console.log('unable to conect to the database: ', error)
    }
}

main();