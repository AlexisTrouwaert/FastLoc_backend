const express = require('express');
const router = express.Router();
const Users = require('../models/users')
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch')
const { checkBody } = require('../modules/checkBody');
const KEY = process.env.OWM_API_KEY
const geolib = require('geolib');
const moment = require ('moment')
const cloudinary = require('cloudinary').v2;
const fs = require('fs');



//Inscription
router.post('/signup', (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const token = uid2(32)
    let date = moment(new Date)
    let url = 'default.png'
    date = date.format("DD/MM/YYYY")
    Users.findOne({ username: req.body.username }).then(data => {
        if (!checkBody(req.body, ['username', 'password', 'email', 'nom', 'prenom', 'adresse', 'ville', 'latitude', 'longitude'])) {
            res.json({ result: false, error: 'champs incorrect/manquants' });
            return

        } else if (data === null) {
            const newUser = new Users({
                name : req.body.nom,
                username: req.body.username,
                firstName : req.body.prenom,
                email: req.body.email,
                password: hash,
                token: token,
                date: date,
                url : url,
                addresse : {
                    adresse : req.body.adresse,
                    city : req.body.ville,
                    latitude : req.body.latitude,
                    longitude : req.body.longitude,
                }
            })
            newUser.save().then(() => {
                res.json({ result: true, newuserInfos: newUser });
                console.log(newUser)
            })
        } else {
            res.json({ result: false, error: "Utilisateur already" });
        }
        return
    })

});


//Connexion classique
router.post('/signin', (req, res) => {
    if (!checkBody(req.body, ['username'||'email'&&'password'])) {
        res.json({ result: false, error: 'Certains champs sont incorrect ' });
        return;
    }


    Users.findOne({ username: req.body.username }).then(data => {
        if (data && bcrypt.compareSync(req.body.password, data.password)) {
            res.json({ result: true, username: data.username, token: data.token, Id: data._id, isConnected: data.isConnected });
        } else {
            res.json({ result: false, error: 'Identifiant ou Mot de Passe eronné' });
        }
    });
}
)

//Connexion persistante
router.get('/connexion/:username/:token', (req, res) => {
    Users.findOne({ username: req.params.username, token: req.params.token})
        .then(data => {
            console.log(data);
            if (data) {
                res.json({ result: true });
            } else {
                res.json({ result: false, error: 'User not found' });
            }
        });
});

router.get('/map', (req, res) => {
    fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${KEY}`)
        .then(response => response.json())
        Users.find()
        .then(users => {
            const results = users.map(user => ({
                latitude: user.latitude,
                longitude: user.longitude,
                
            }));
            console.log(results);
            const rayon = 10;
            const rayonUser = results.filter(user => 
             geolib.isPointWithinRadius(results, { latitude: user.latitude, longitude: user.longitude }, rayon)
            );

            res.json(rayonUser);
        })
        .catch(err => {
            console.error('Erreur pas ', err);
        });
            res.status(2).json({ error: 'Erreur  users' });
})

//Recherche des article des utilisateur par la categorie, la marque ou le model
router.get('/search/:searched/', (req, res) => {
    Users.find()
    .populate('article.outil')
    .then(data => {
        articlesFound = []
        for (let i = 0; i < data.length; i++){
            if(data[i].article.length){
                for (let j of data[i].article)
                    if(j.isAvailable){
                        if(j.outil[0].categorie.toLowerCase() == req.params.searched.toLowerCase()){
                            articlesFound.push(j)
                        } else if (j.outil[0].brand.toLowerCase() == req.params.searched.toLowerCase()) {
                            articlesFound.push(j)
                        } else if (j.outil[0].model.toLowerCase() == req.params.searched.toLowerCase()) {
                            articlesFound.push(j)
                        }
                    }
            }
        }
        if(articlesFound.length){
            res.json({result : true, data : articlesFound})
        } else {
            res.json({result : false, error : 'No article found'})
        }
    })
})
//Ajouter des articles à son profil
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
router.get('/profil/:username/:token', (req, res) => {
    Users.findOne({username : req.params.username, token : req.params.token})
    .then(data => {
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



module.exports = router;