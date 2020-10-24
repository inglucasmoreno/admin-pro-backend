const express = require('express');
const path = require('path');
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

// Direccion publica
app.use(express.static('public'));

// Rutas
app.use('/api/usuarios', require('./routes/usuarios.routes'));
app.use('/api/hospitales', require('./routes/hospitales.routes'));
app.use('/api/medicos', require('./routes/medicos.routes'));
app.use('/api/todo', require('./routes/busquedas.routes'));
app.use('/api/uploads', require('./routes/uploads.routes'));
app.use('/api/auth', require('./routes/auth.routes'));

// Lo ultimo
// Nota: Esto es necesario para que en produccion al recargar no se pierda la ruta
// - Siempre que tenga que buscar una ruta nueva -> tiene que pasar por el index.html
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'public/index.html'));
})

// Servidor escuchando
app.listen(port, ()=>{
    console.log(`Servidor corriendo en http://localhost:${port}`);
})