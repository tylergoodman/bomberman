#!/usr/bin/env node

'use strict';

var http = require('http'),
	path = require('path'),
	fs = require('fs'),
	peer = require('peer').PeerServer,
	express = require('express'),
	serve_index = require('serve-index'),
	app = require('./'),
	port = 80,
	i;

app.use(express.static(path.join(__dirname, '../www/'), { redirect: false }));
app.use('/', serve_index(path.join(__dirname, '../www/'), {icons: true}));

// pass a port for the server to use using "node <this file> -p <port>"
// check if "-p" exists in the arguments and set the port to the following number if it does
if ((i = process.argv.indexOf('-p')) !== -1)
	port = Number(process.argv[i + 1]);


http.createServer(app).listen(port);


var peer_server = new peer({
	port: 9000,
	path: '/tracker',
	proxied: true,
});
peer_server.on('connection', function (id) {
	console.log('new peer: ' + id);
});
peer_server.on('disconnect', function (id) {
	console.log('end peer: ' + id);
});

console.log('http server started on port ' + port);
console.log('peer server started on port 9000');