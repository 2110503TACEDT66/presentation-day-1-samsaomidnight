const Massage = require('../models/Massage.js');

exports.getMassages = async (req,res,next) => {
    let query;

    //copy req.query
    const reqQuery = {...req.query};

    //fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];

    //loop over remove fields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    console.log(reqQuery);

    //create query string
    let queryStr = JSON.stringify(req.query);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = Massage.find(JSON.parse(queryStr)).populate('appointments');

    //select fields
    if(req.query.select){
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }

    //sort
    if(req.query.sort){
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }
    else{
        query = query.sort('-createdAt');
    }

    //pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit,10) || 25;
    const startIndex = (page - 1)*limit;
    const endIndex = page*limit;
    const total = await Massage.countDocuments();
    query = query.skip(startIndex).limit(limit);
    

    try{
        const massages = await query;

        //pagination result
        const pagination = {};

        if(endIndex < total){
            pagination.next = {
                page: page-1,
                limit
            }
        }

        if(startIndex>0){
            pagination.prev = {
                page : page-1,
                limit
            }
        }

        res.status(200).json({success:true, count: massages.length, pagination, data: massages});
    } catch(err){
        res.status(400).json({success:false});
    }

};

exports.getMassage =async (req,res,next) => {
    try{
        const massage = await Massage.findById(req.params.id);

        if(!massage){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true, data: massage});
    } catch(err){
        res.status(400).json({success:false});
    }
};


exports.createMassage =async (req,res,next) => {
    const massage = await Massage.create(req.body);
    res.status(201).json({success:true, data :massage});
};


exports.updateMassage = async (req,res,next) => {
    try{
        const massage = await Massage.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true
        });

        if(!massage){
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true, data: massage});
    } catch(err){
        res.status(400).json({success:false});
    }
};


exports.deleteMassage = async (req,res,next) => {
    try{
        const massage = await Massage.findById(req.params.id);

        if(!massage){
            res.status(404).json({success:false, message:`Massage Shop not found with id of ${req.params.id}`});
        }

        await massage.deleteOne();
        res.status(200).json({success:true, data: {}});
    } catch(err){
        res.status(400).json({success:false});
    }
};


