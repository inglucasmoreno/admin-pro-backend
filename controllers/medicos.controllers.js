const { findByIdAndUpdate } = require('../models/medico.model');
const Medico = require('../models/medico.model');

const getMedicos = async (req, res) => {
    const medicos = await Medico.find()
                                .populate('usuario', 'nombre img')
                                .populate('hospital', 'nombre img');
    res.json({
        ok: true,
        medicos
    })
}

const crearMedico = async (req, res) => {
    
    const uid = req.uid;
    const medico = new Medico({
        usuario: uid,
        ...req.body
    });

    try{
        const medicoDB = await medico.save();
        res.json({
            ok: true,
            medico: medicoDB
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error de servidor'
        })
    }

}

const actualizarMedico = async (req, res) => {

    const id = req.params.id;

    try{

        const medico = await Medico.findById(id);
        if(!medico){
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro medico por Id'
            })
        }

        const cambiosMedico = {
            ...req.body
        }

        const medicoActualizado = await Medico.findByIdAndUpdate(id, cambiosMedico, {new: true});
        
        res.json({
            ok: true,
            medico: medicoActualizado
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error de servidor'
        })
    }
}

const borrarMedico = async (req, res) => {

    const id = req.params.id;

    try{

        const medico = await Medico.findById(id);
        if(!medico){
            return res.status(404).json({
                ok: false,
                msg: 'No se encontro medico por Id'
            })
        }

        await Medico.findByIdAndDelete(id);

        res.json({
            ok: true,
            msg: 'Medico eliminado'
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error de servidor'
        })
    }

    res.json({
        ok: true,
        msg: 'borrarMedico'
    })
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}