
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

module.exports = {
    validarJWT
}