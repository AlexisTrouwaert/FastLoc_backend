const express = require('express');
const router = express.Router();
const Avis = require('../models/avis')

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

module.exports = router;
