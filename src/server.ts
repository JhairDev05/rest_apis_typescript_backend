import express  from "express";
import router from "./router";
import colors from 'colors';
import cors, { CorsOptions } from 'cors'
import morgan from 'morgan'
import swaggerUi from 'swagger-ui-express'
import swaggerSpec, {swagegrUiOptions} from "./config/swagger";
import db from "./config/db";

// Conectar a base de datos
export async function connectDB() {
    try {
        await db.authenticate();
        db.sync();
        // console.log(colors.blue('Conexión exitosa con la DB'));
    } catch (error) {
        // console.log(error);
        console.log(colors.red.bold('Hubo un error al conectar a la BD'));
    }
}

connectDB();

// Instancia de express
const server = express();

// Permitir conexiones
const corsOptions: CorsOptions = {
    origin: function (origin, callback) {
        if(!origin || origin === process.env.FRONTEND_URL) {
            callback(null, true)
        } else {
            callback(new Error('Error de CORS'))
        }
    }
}
server.use(cors(corsOptions));

server.use(morgan('dev'));

// LEer datos de formularios
server.use(express.json());

server.use('/api/products', router);

// Docs
server.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swagegrUiOptions))

export default server;