#!/bin/env node
//  OpenShift sample Node application
var express = require('express');
var fs      = require('fs');
var path = require('path');
var xml = require('xml');

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

// Main application.
var app = express();

// Produção application.
var producao = express();  
producao.get('/', function (req, res) {  
  res.sendfile('./producao/html/index.html');
});

producao.get('/video', function (req, res) {  
  res.redirect('https://www.youtube.com/watch?v=RSfD9_qUnFs');
});

// Breno application.
var breno = express();  
breno.get('/', function (req, res) {
    res.sendfile('./user-breno/html/index.html');  
});

// Rafaela application.
var rafaela = express();  
rafaela.get('/', function (req, res) {
    res.sendfile('./user-rafaela/html/index.html');  
});

// Victor application.
var victor = express();  
victor.get('/', function (req, res) {
    res.sendfile('./user-victor/html/index.html');  
});

// Victor application.
var api = express();  
api.get('/', function (req, res) {
	// Permitindo acesso de outros sites
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	

	res.set('Content-Type', 'text/xml');
	var eventos = [ 
	{ 
		root: [ 
			{ evento1: [ 
				{nome: 'Gigantes do Samba'}, 
				{descricao: 'Show do Gigantes do Samba conta com apresentações de Alexandre Pires, Belo e Raça Negra.'}, 
				{pontuacao: '+Lazer'} 
			]} ,

			{ evento2: [
			 {nome: 'Natiruts'}, 
			 {descricao: 'Natiruts lança DVD novo em show em Campina Grande.'}, 
			 {pontuacao: '+Lazer'} 
			 ]} , 

			{ evento3: [ 
				{nome: 'Doe Sangue'},
				{descricao: 'Hemocentro de Campina Grande precisa de você'},
				{pontuacao: '+Saúde'} 
			]} ,

			{ evento4: [ 
				{nome: 'Pizzaria Qualquer'},
				{descricao: 'Peça sua pizza agora'},
				{pontuacao: '+Comércio'} 
			]} , 
		],
	},


	];
		
	res.send(xml(eventos));  
});


api.get('/codigo/:chave', function (req, res) {
	// Permitindo acesso de outros sites
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	
	res.set('Content-Type', 'text/xml');
    var chaves = {
    	'macaco-bolado': {'pts': '300', 'nome': 'EVENTO DO MACACO'}, 
    	'chave-mestra':  {'pts': '200', 'nome': 'EVENTO MESTRE'},
    	'6b2c7472497':  {'pts': '500', 'nome': 'EVENTO DO HEMOCENTRO'} 
    };
 	var check = chaves[req.params.chave];


 	


 	
 	if(check != undefined){
 		var modeloxml =
 		{ root: [ 
 			{ chave: req.params.chave},
 			{ pontuacao: check.pts},
 			{ nome: check.nome}],
 		};
 	}
 		
 	else{
 		var modeloxml =
 		{ root: [ 
 			{ chave: 'null'},
 			{ pontuacao: -1}],
 		};
		res.send(xml(modeloxml));
 	}
 	
 	res.send(xml(modeloxml));
});

// Seting static files path
app.use('/', express.static(__dirname + '/producao/html/'));
app.use('/breno', express.static(__dirname + '/user-breno/html/'));
app.use('/rafaela', express.static(__dirname + '/user-rafaela/html/'));
app.use('/victor', express.static(__dirname + '/user-victor/html/'));


// Mouting applications.
app.use('/', producao);
app.use('/api', api);  
app.use('/breno', breno);
app.use('/rafaela', rafaela);
app.use('/victor', victor);

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	//req.setHeader('Authorization');
	next();
});

// Start listening.
app.listen(server_port, server_ip_address, function(){
  console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});