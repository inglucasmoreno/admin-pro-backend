const Usuario = require('../models/usuario.model');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0    

    // Ejecutando dos promesas simultaneamente para ahorra tiempo de ejecucion
    const [ usuarios, total ] = await Promise.all([
        Usuario.find({}, 'nombre email role google img')
               .skip(desde)
               .limit(5),
        Usuario.count()
    ])

    res.json({
        ok: true,
        usuarios,
        total
    });
}

const crearUsuario = async (req, res) => {

    const {nombre, email, password} = req.body;

    try{

        const existeEmail = await Usuario.findOne({ email });
        if(existeEmail) return res.status(400).json({
            ok: false,
            msg: 'Este correo ya esta registrado'
        });

        const usuario = new Usuario(req.body);

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt);

        // Guardar usuario
        await usuario.save();
        const token = await generarJWT(usuario.id);
        res.json({
            ok: true,
            usuario,
            token
        })   
   
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error de servidor'
        })
    }

}

const actualizarUsuario = async (req, res) => {

    // Validar token y comprobar si el usuario es correcto
    
    const uid = req.params.id;

    try{

        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        // Actualizaciones
        const {password, google, email, ...campos} = req.body;

        if(usuarioDB.email !== email){ // No se quiere actualizar el email
            const existeEmail = await Usuario.findOne({ email });
            if(existeEmail){
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe usuario con ese correo electronico'
                })
            } 
        }

        campos.email = email; // Quiere actualizar el email

        const usuarioActualizado = await Usuario.findByIdAndUpdate(uid, campos, {new: true});

        res.json({
            ok: true,
            usuario: usuarioActualizado
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error de servidor'
        })
    }

}

const borrarUsuario = async (req, res) => {
    
    const uid = req.params.id;

    try{

        const usuarioDB = await Usuario.findById(uid);
        if(!usuarioDB){
            return res.status(404).json({
                ok: false,
                msg: 'No existe un usuario con ese id'
            });
        }

        await Usuario.findByIdAndDelete(uid);

        res.json({
            ok: true,
            msg: 'Usuario eliminado'
        })


    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error de servidor'
        })
    }

}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}