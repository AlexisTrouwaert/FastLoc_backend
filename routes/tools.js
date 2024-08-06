const express = require('express');
const router = express.Router();
const Tools = require('../models/tools')

router.post('/addTool', (req, res) => {
    Tools.findOne({brand : req.body.brand, model : req.body.model, categorie : req.body.categorie})
    .then(data => {
        if(data === null){
            const newTool = new Tools({
                categorie : req.body.categorie,
                brand : req.body.brand,
                model : req.body.model
            })
            newTool.save()
            .then(() => {
                res.json({result : true, newToolInfos : newTool})
            })
        } else {
            res.json({result : true, data: data})
        }
    })
})

module.exports = router;
