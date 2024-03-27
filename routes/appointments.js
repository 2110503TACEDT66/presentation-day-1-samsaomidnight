const express = require('express');
const {getAppointments, getAppointment, addAppointment, updateAppointment, deleteAppointment} = require('../controllers/appointments');
const router = express.Router({mergeParams : true});

const {authorize, protect} = require('../middleware/auth');

router.route('/').get(getAppointments).post(addAppointment);
router.route('/:id').get(getAppointment).put(updateAppointment).delete(deleteAppointment);

module.exports = router;