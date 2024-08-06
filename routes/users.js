const express = require('express');
const router = express.Router();
const Users = require('../models/users')
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const fetch = require('node-fetch')
const { checkBody } = require('../modules/checkBody');
const KEY = process.env.OWM_API_KEY
const geolib = require('geolib');



//Inscription
router.post('/signup', (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 10);
    const token = uid2(32)
    Users.findOne({ username: req.body.username }).then(data => {
        if (!checkBody(req.body, ['username', 'password', 'email'])) {
            res.json({ result: false, error: 'champs incorrect/manquants' });
            return
            console.log(data);

        } else if (data === null) {

            const newUser = new Users({
                username: req.body.username,
                email: req.body.email,
                password: hash,
                token: token,
            })
            newUser.save().then(() => {
                res.json({ result: true, newuserInfos: newUser });

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
router.get('/search/:searched/:croissant?/:decroissant?/:date?', (req, res) => {
    Users.find()
    .populate('article.outil')
    .then(data => {
        let articleuser = []
        let filtred = []
        for (let i = 0; i < data.length; i++){
            if(data[i].article.length){
                articleuser.push(data[i].article)
            }
        }
        articleuser.map((data, i) => {
            if(data[0].isAvailable){
                if(data[0].outil[0].categorie.toLowerCase() == req.params.searched.toLowerCase()){
                    console.log('ok')
                    filtred.push(data[0])
                } else if (data[0].outil[0].brand.toLowerCase() == req.params.searched.toLowerCase()) {
                    filtred.push(data[0])
                } else if (data[0].outil[0].model.toLowerCase() == req.params.searched.toLowerCase()) {
                    filtred.push(data[0])
                }
            }
        })
        if(filtred.length){
            if(req.params.croissant){
                filtred.sort(function compare(a, b) {
                    if (a.price < b.price)
                       return -1;
                    if (a.price > b.price )
                       return 1;
                    return 0;
                  });
                  res.json({result : true, data : filtred})
            } else if (req.params.decroissant){
                filtred.sort(function compare(a, b) {
                    if (a.price > b.price)
                       return -1;
                    if (a.price < b.price )
                       return 1;
                    return 0;
                  });
                  res.json({result : true, data : filtred})
            } else if (req.params.note) {
                filtred.sort(function compare(a, b) {
                    if (a.note < b.note)
                       return -1;
                    if (a.note > b.note )
                       return 1;
                    return 0;
                  });
                  res.json({result : true, data : filtred})
            } else {
                res.json({result : true, data : filtred})
            }
        } else {
            res.json({result : false, error : 'No articles found'})
        }
    })
})



module.exports = router;
