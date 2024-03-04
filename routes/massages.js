
const express = require('express');
const {getMassages, getMassage, createMassage, updateMassage, deleteMassage} = require('../controllers/massages'); 


const { getReviewsForMassage } = require('../controllers/review');
const reviewRouter = require('./review');

//include other resource routers
const appointmentRouter = require('./appointments');

const router = express.Router();

const {protect, authorize} = require('../middleware/auth');

router.use('/:massageId/appointments/', appointmentRouter);
router.use('/:massageId/reviews', reviewRouter);

router.route('/').get(getMassages).post(protect, authorize('admin'), createMassage); 
router.route('/:id').get(getMassage).put(protect, authorize('admin'), updateMassage).delete(protect, authorize('admin'), deleteMassage); 



module.exports=router;