'use strict';

var http = require('http'),
	path = require('path'),
	_ = require('lodash'),
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

app.post('/join', function (req, res) {
	res.send({
		response: 'acknowledged',
		received: req.body,
	});
});
// app.get('/')
// console.log(__dirname);
// console.log(express.static)

var server = http.createServer(app);
server.listen(1337);