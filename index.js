const express = require('express');
require('dotenv').config();

const { dbConnection } = require('./database/config');
const port = process.env.PORT || 3001;

// Crea el servidor de express
const app = express();

// Configuracion de cors
const cors = require('cors');
app.use(cors());

// Lectura y parseo del body
app.use(express.json());

// Configuracion de la base de datos
dbConnection();

// Rutas
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/auth', require('./routes/auth.routes'));

// Servidor escuchando
app.listen(port, ()=>{
    console.log(`Servidor corriendo en http://localhost:${port}`);
})