const { Schema, model } = require('mongoose');

const HospitalSchema = Schema({
    nombre:{
        type: String,
        required: true
    },
    img:{
        type: String,
    },
    usuario:{
        required: true,
        type: Schema.Types.ObjectId,
        ref: 'Usuario'    
    }
}, { collection: 'hospitales' });
 
// IMPORTANTE -> Solo para fines visuales
HospitalSchema.method('toJSON', function(){
    const { __v , ...object} = this.toObject(); // Se evita extraer el password
    return object;
})

module.exports = model('Hospital', HospitalSchema);