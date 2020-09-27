const fs = require('fs');

const Usuario = require('../models/usuario.model');
const Hospital = require('../models/hospital.model');
const Medico = require('../models/medico.model');

const borraImagen = ( path ) => {
    // Si tiene una imagen se borra
    if(fs.existsSync(path)){
        fs.unlinkSync(path);
    }


}


const actualizarImagen = async (tipo, id, nombreArchivo) => {
    
    let pathViejo;
    
    switch(tipo){
        case 'medicos':
            const medico = await Medico.findById(id);
            if(!medico){
                console.log('No es un medico por ID');
                return false;
            }

            pathViejo = `./uploads/medicos/${ medico.img }`;      
            borraImagen(pathViejo);

            medico.img = nombreArchivo;
            await medico.save();
            return true;
            break;
        case 'hospitales':
            const hospital = await Hospital.findById(id);
            if(!hospital){
                console.log('No es un hospital por ID');
                return false;
            }

            pathViejo = `./uploads/hospitales/${ hospital.img }`;      
            borraImagen(pathViejo);

            hospital.img = nombreArchivo;
            await hospital.save();
            return true;
            break;
        case 'usuarios':
            const usuario = await Usuario.findById(id);
            if(!usuario){
                console.log('No es un usuario por ID');
                return false;
            }

            pathViejo = `./uploads/usuarios/${ usuario.img }`;      
            borraImagen(pathViejo);

            usuario.img = nombreArchivo;
            await usuario.save();
            return true;
            break;
    }

}

module.exports = {
    actualizarImagen
}