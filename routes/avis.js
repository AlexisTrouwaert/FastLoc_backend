const express = require('express');
const router = express.Router();
const Avis = require('../models/avis')
const Users = require('../models/users')

router.post('/newAvis', (req, res) => {
    Avis.find({sender : req.body.sender, receiver : req.body.receiver})
    .then(data => {
        if(data === null){
            const newAvis = new Avis({
                userId : req.body.receiver,
                userAvisId : req.body.sender,
                Note : req.body.note,
                Avis : req.body.avis,
                data : new Date(),
            })

            newAvis.save()
            .then(() => {
                res.json({result : true, newAvisInfos : newAvis})
            })
        } else {
            res.json({result : false, error : 'Vous avez déja laisser un avis a cet utilisateur'})
        }
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
