const express = require('express');
const router = express.Router();
const Users = require('../models/users')

router.put('/addArtcile', (req, res) => {
    Users.updateOne(
        {username : req.body.username, token : req.body.token},
        {$push : 
            {article : 
                {urlPhoto : req.body.urlPhoto,
                etat : req.body.etat,
                price : req.body.price,
                isAvailable : req.body.isAvailable,
                outil : req.body.outil,
        }}}
    )
    .then(() => {
        res.json({result : true})
    })
})

//Recuperer info user pour page profil
router.get('/:username/:token', (req, res) => {
    Users.findOne({username : req.params.username, token : req.params.token})
    .populate('article.outil')
    .then(data => {
        console.log('datapopu', data)
        let date = moment(data.date).format('DD/MM/YYYY')
        res.json({result : true, data : data, date : date})
    })
})

//Edit profil
router.put('/profil/edit', (req, res) => {
    console.log(req.body);
    if(req.body.url !== null){
        Users.findOneAndUpdate(
            {username : req.body.username, token : req.body.token},
            {name : req.body.nom, firstName : req.body.prenom, addresse : {adresse : req.body.adresse, city : req.body.city, latitude : req.body.latitude, longitude : req.body.longitude}, url : req.body.url}
        )
        .then(() => {
            res.json({result : true, photo : req.body.url})
        })
    } else {
        Users.findOneAndUpdate(
            {username : req.body.username, token : req.body.token},
            {name : req.body.nom, firstName : req.body.prenom, addresse : {adresse : req.body.adresse, city : req.body.city, latitude : req.body.latitude, longitude : req.body.longitude}}
        )
        .then(() => {
            res.json({result : true})
        })
    }
})

router.delete('/deleteArt/:id/:username/:token', (req, res) => {
    Users.findOne({username : req.params.username, token : req.params.token})
    .then(data => {
        data.article.deleteOne({_id : req.params.id})
    })
    .then(() => {
        res.json({result : true})
    })
})