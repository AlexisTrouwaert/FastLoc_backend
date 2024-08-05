const express = require('express');
const router = express.Router();
const Users = require('../models/users')
const uid2 = require('uid2');
const bcrypt = require('bcrypt');
const { checkBody } = require('../modules/checkBody');


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



router.post('/signin', (req, res) => {
    if (!checkBody(req.body, ['username', 'password' && 'email', 'password'])) {
        res.json({ result: false, error: 'Certains champs sont incorrect ' });
        return;
    }


    Users.findOne({ username: req.body.username }).then(data => {
        if (data && bcrypt.compareSync(req.body.password, data.password)) {
            res.json({ result: true, username: data.username, token: data.token, Id: data._id });
        } else {
            res.json({ result: false, error: 'Identifiant ou Mot de Passe eronné' });
        }
    });
}
)

router.get('/connexion/:username/:token', (req, res) => {
    Users.findOne({ username: req.params.username, token: req.params.token }).then(data => {
        console.log(data);
        if (data) {
            res.json({ result: true });
        } else {
            res.json({ result: false, error: 'User not found' });
        }
    });
});

module.exports = router;