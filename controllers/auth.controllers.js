const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req, res) => {

    const {email, password} = req.body;
    
    try{
        
        // Verificar - Email
        const usuarioDB = await Usuario.findOne({email});
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'Error en los datos ingresados'
            })
        }

        // Verificar - contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);
        if(!validPassword){
            return res.status(400).json({
                ok: false,
                msg: 'Error en los datos ingresados'
            })    
        }

        // Generar un token
        const token = await generarJWT( usuarioDB.id );
    
        res.json({
            ok: true,
            token
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error de servidor'
        });
    }
}

const googleSignIn = async ( req, res ) => {

    const googleToken = req.body.token;
    console.log(googleToken);

    try{

        const {name, email, picture} = await googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne({email});
        let usuario;
        
        if(!usuarioDB){
            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });    
        }else{
            // Existe usuario
            usuario = usuarioDB;
            usuario.password = '@@@';
            usuario.google = true;
        }

        // Guardar usuario
        await usuario.save();

        // Generar el Token - JWT
        const token = await generarJWT( usuarioDB.id );

        res.json({
            ok: true,
            token
        })
    }catch(error){
        res.status(401).json({
            ok: false,
            msg: 'El token no es correcto'
        })
    }

}

const renewToken = async (req, res) => {
    
    const uid = req.uid;

    // Generar token JWT
    const token = await generarJWT(uid);

    // Obtener usuario por UID
    const usuario = await Usuario.findById(uid);

    res.json({
        ok: true,
        token,
        usuario
    });    
} 


module.exports = {
    login,
    googleSignIn,
    renewToken
}