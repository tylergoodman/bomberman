'use strict';

var _ = require('lodash'),
	morgan = require('morgan'),
	body_parser = require('body-parser'),
	express = require('express'),
	app = express();

// logging
app.use(morgan('tiny'));

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.disable('x-powered-by');

// do stuff
// app.post('/join', function (req, res) {
// 	res.send({
// 		response: 'acknowledged',
// 		received: req.body,
// 	});
// });

// app.post('/create', function (req, res) {

// });

module.exports = app;