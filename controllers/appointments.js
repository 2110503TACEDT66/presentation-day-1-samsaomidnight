const AppointmentModel = require('../models/Appointment');
const Appointment = require('../models/Appointment');
const Massage = require('../models/Massage');

//@desc     Get all appointments
//@route    GET /api/v1/appointments
//@access   Public

exports.getAppointments = async(req,res,next) => {
    let query;
    
    query = Appointment.find()

    try{
        const appointments = await query;
        
        res.status(200).json({
            success: true,
            count: appointments.length,
            data : appointments
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success : false,
            message : "Cannot find Appointment"
        });
    }
}




exports.getAppointment = async(req,res,next)=>{
    try{
        const appointment = await AppointmentModel.findById(req.params.id);

        if(!appointment){
            return res.status(404).json({success: false, message: `No appointment with the id of ${req.params.id}`});
        }

        res.status(200).json({
            success : true,
            data : appointment
        });
    } catch(error){
        console.log(error);
        return res.status(500).json({success: false, message : "Cannot find Appointment"});
    }
}

exports.addAppointment = async(req, res, next) => {
    try {
        req.body.massage = req.params.massageId;

        const massage = await Massage.findById(req.params.massageId);

        if(!massage){
            return res.status(404).json({success : false, message : `No massage shop with the id of ${req.params.massageId}`});
        }

        //add user id to req.body
        //check for existed Appointment
        const existedAppointment = await Appointment.find({user:req.body.user});
        //if the user is not admin, they can only create 3 appointment
        if(existedAppointment.length >= 3){
            return res.status(400).json({success : false, message : `The user with ID ${req.body.user} has already made 3 appointments`});
        }

        const appointment = await Appointment.create(req.body);

        res.status(200).json({
            success : true,
            data : appointment
        });

    } catch(error){
        console.log(error);
        return res.status(500).json({success : false, message : "Cannot create Appointment"});
    }
}


exports.updateAppointment = async(req,res,next) => {
    try {
        
        let appointment = await Appointment.findById(req.params.id);

        if(!appointment){
            return res.status(404).json({success:false, message: `No appointment with the id of ${req.params.id}`});
        }

        //make sure user is the appointment owner 
        // if(appointment.user.toString() !== req.user.id && req.user.role !== 'admin'){
        //     return res.status(401).json({success : false, message : `User ${req.user.id} is not authorized to update this appointment`});
        // }

        appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true
        });

        res.status(200).json({success : true, data : appointment});

    } catch(error){
        console.log(error);
        return res.status(500).json({success:false, message : "Cannot update Appointment"});
    }
}


exports.deleteAppointment = async (req, res, next) => {
    try{
        
        const appointment = await Appointment.findById(req.params.id);

        if(!appointment){
            return res.status(404).json({
                success : false,
                message : `No appointment with the id of ${req.params.id}`
            });
        }

        // if(appointment.user.toString() !== req.user.id && req.user.role !== 'admin'){
        //     return res.status(401).json({success : false, message : `User ${req.user.id} is not authorized to delete this massage shop`});
        // }

        await appointment.deleteOne();

        res.status(200).json({
            success : true,
            data : {}
        });
    } catch (error){
        return res.status(500).json({
            success : false,
            message : "Cannot delete Appointment",
            error
        });
    }
}