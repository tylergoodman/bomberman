'use strict';

var http = require('http'),
	path = require('path'),
	_ = require('lodash'),
	// store = require('./store'),
	// store = [],
	peer = require('peer').PeerServer,
	morgan = require('morgan'),
	body_parser = require('body-parser'),
	express = require('express'),
	app = express();

// logging
app.use(morgan('tiny'));

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.disable('x-powered-by');

// static files
app.use(express.static(path.join(__dirname, '../www')));

// do stuff
// app.post('/join', function (req, res) {
// 	res.send({
// 		response: 'acknowledged',
// 		received: req.body,
// 	});
// });

// app.post('/create', function (req, res) {

// });

var server = http.createServer(app);
server.listen(61337);

var peer_server = new peer({port: 9000, path: '/tracker'});
peer_server.on('connection', function (id) {
	console.log('new peer: ' + id);
});
peer_server.on('disconnect', function (id) {
	console.log('end peer: ' + id);
});