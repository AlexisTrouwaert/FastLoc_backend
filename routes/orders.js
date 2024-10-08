const express = require('express');
const router = express.Router();
const Users = require('../models/users')
const Orders = require('../models/orders')
const Tools = require('../models/tools');
const { model } = require('mongoose');

router.get('/:username/:token', (req, res) => {
    Users.find({username : req.params.username, token : req.params.token})
    .then(data => {
        if(data){
            Orders.find({locUserId : data[0]._id})
            .then(data2 => {
                console.log(data2.Orders)
                res.json({data : data2})
            })
        }
    })
})

module.exports = router;
