const express = require('express');
const router = express.Router();
const Avis = require('../models/avis')
const Users = require('../models/users')

router.post('/send', (req, res) => {
    console.log(req.body)
    Users.find({username : req.body.username, token : req.body.token})
    .then(data => {
        console.log('userdata',data)
        newAvis = new Avis({
            userId : data[0]._id,
            userIdAvis : '66b4c4254e17d51e95e7f7dc',
            Note : req.body.rating,
            Avis : req.body.message
        })
        newAvis.save()
    }).then(data => {
        res.json({result : true})
    })
})

router.get('/:username/:token', (req, res) => {
    Users.find({username : req.params.username, token : req.params.token})
    .then(data => {
        Avis.find({userId : data[0]._id})
        .populate('userIdAvis')
        .then(find => {
            if(find){
                res.json({result : true, data : find})
            } else {
                res.json({result : false})
            }
        })
    })
})

module.exports = router;
