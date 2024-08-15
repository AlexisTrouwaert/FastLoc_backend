require('dotenv').config();

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./models/connection')



var app = express();
const cors = require('cors')

const usersRouter = require('./routes/users')
const avisRouter = require('./routes/avis')
const messagesRouter = require('./routes/messages')
const ordersRouter = require('./routes/orders')
const toolsRouter = require('./routes/tools')
const indexRouter = require('./routes/index')
// const profilRouter = require('./routes/profil')

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/avis', avisRouter);
app.use('/messages', messagesRouter);
app.use('/orders', ordersRouter);
app.use('/tools', toolsRouter)
// app.use('/profil', profilRouter)

module.exports = app;
