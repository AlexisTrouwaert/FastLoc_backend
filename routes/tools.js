const express = require('express');
const router = express.Router();
const Tools = require('../models/tools')

router.post('/addTool', (req, res) => {
    Tools.findOne({})
})

module.exports = router;
