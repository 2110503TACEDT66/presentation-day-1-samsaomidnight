const express = require('express');
const {getAppointments, getAppointment, addAppointment, updateAppointment, deleteAppointment} = require('../controllers/appointments');
const router = express.Router({mergeParams : true});

<<<<<<< HEAD
const {authorize} = require('../middleware/auth');

router.route('/').get(getAppointments).post(addAppointment);
router.route('/:id').get(getAppointment).put(updateAppointment).delete(authorize('admin','user'), deleteAppointment);
=======
const {authorize, protect} = require('../middleware/auth');

router.route('/').get(protect, getAppointments).post(addAppointment);
router.route('/:id').get(getAppointment).put(protect, updateAppointment).delete(deleteAppointment);
>>>>>>> 36e89e505d2de23ffb4f08bb09d4d2e8f1b7957b

module.exports = router;