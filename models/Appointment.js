const mongoose = require('mongoose');

const AppointmentSchema = new mongoose.Schema({
    apptDate : {
        type : Date,
        required : true
    },
    user:{
        type : mongoose.Schema.ObjectId,
        ref : 'User',
        required : true
    },
    massage:{
        type : mongoose.Schema.ObjectId,
        ref: 'Massage',
        required : true
    },
    createdAt:{
        type : Date,
        default : Date.now
    }
});

const AppointmentModel =  mongoose.model('Appointment', AppointmentSchema);
module.exports = AppointmentModel