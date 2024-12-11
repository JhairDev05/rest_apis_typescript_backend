import {exit} from 'node:process';
import db from '../config/db';

const clearDB = async () => {
    try {
        await db.sync({force: true})
        console.log('Datos eliminados correctamente');
        exit() // significa que termina el programa correctamente
    } catch (error) {
        console.log(error);
        exit(1) // Significa que termina el programa pero con errores
    }
}
if(process.argv[2] === '--clear') {
    clearDB()
}