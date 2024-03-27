const mongoose = require('mongoose');

const MassageSchema = new mongoose.Schema({
    name : {
        type: String,
        required: [true, 'Please add a name'],
        unique : true,
        trim : true,
        maxlength : [50, 'Name cannot be more than 50 charaters']
    },
    address : {
        type : String,
        required: [true, 'Please add an address']
    },
    tel : {
        type: String
    },
    picture: {
      type: String,
      required: true,
    },
    open_close_times: [{
        day: {
            type: String,
            required: true
        },
        open: {
            type: String,
            required: true
        },
        close: {
            type: String,
            required: true
        }
    }]

}, {
    toJSON : {virtuals : true},
    toObject : {virtuals : true}
});

//cascade delete appointment when a Masssage is deleted
MassageSchema.pre('deleteOne', {document : true, query : false}, async function(next){
    console.log(`Appointments being removed from massage ${this._id}`);
    await this.model('Appointment').deleteMany({massage : this._id});
    next();
});

MassageSchema.virtual('appointments', {
    ref : 'Appointment',
    localField : '_id',
    foreignField : 'massage',
    justOne : false
})
module.exports = mongoose.model('Massage', MassageSchema);
