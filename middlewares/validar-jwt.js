const Usuario = require('../models/usuario.model');
const jwt = require('jsonwebtoken');

const validarJWT = (req, res, next) => {

    // Leer token
    const token = req.header('x-token');
    
    if(!token){
        return res.status(401).json({
            ok: false,
            msg: 'No hay token en la peticion'
        });     
    };
    
    try{
        const { uid } = jwt.verify(token, process.env.JWT_SECRET);
        req.uid = uid;  // Se le agrega el iud a la solicitud
        next();
    }catch(error){
        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        })
    }


}

const validarADMIN_ROLE = async (req, res, next) => {
    const uid = req.uid;
    try{
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB){
            res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            })             
        }

        if(usuarioDB.role !== 'ADMIN_ROLE'){
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            }) 
        }

        next();

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error de servidor'
        })    
    } 
}

const validarADMIN_ROLE_o_MismoUsuario = async (req, res, next) => {
    const uid = req.uid;
    const id = req.params.id;
    try{
        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB){
            res.status(400).json({
                ok: false,
                msg: 'El usuario no existe'
            })             
        }

        if(usuarioDB.role === 'ADMIN_ROLE' || uid === id){
            next();
        }else{
            return res.status(403).json({
                ok: false,
                msg: 'No tiene privilegios para hacer eso'
            }) 
        }

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error de servidor'
        })    
    } 
}

module.exports = {
    validarJWT,
    validarADMIN_ROLE,
    validarADMIN_ROLE_o_MismoUsuario
}