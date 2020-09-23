const express = require('express');
require('dotenv').config();

const { dbConnection } = require('./database/config');
const port = process.env.PORT || 3001;

// Crea el servidor de express
const app = express();

// Configuracion de cors
app.use(cors());

// Configuracion de la base de datos
dbConnection();


// Rutas
app.get('/', (req, res) => {
    res.json({
        ok: true,
        msg: 'Hola mundo'
    });
})

// Servidor escuchando
app.listen(port, ()=>{
    console.log(`Servidor corriendo en http://localhost:${port}`);
})