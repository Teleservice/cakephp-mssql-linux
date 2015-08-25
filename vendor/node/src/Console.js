/**
 * Copyright (c) Teleservice Skåne AB
 * 
 * Licensed under The MIT License
 * For full copyright and license information, please see the LICENSE
 * Redistributions of files must retain the above copyright notice.
 * 
 * @copyright   Copyright (c) Teleservice Skåne AB
 * @link        http://teleservice.net/ Teleservice Skåne AB
 * @license     http://www.opensource.org/licenses/mit-license.php MIT License
 * @author      Olle Tiinus aka Tiinusen <olle.tiinus@teleservice.net>
 */

import {Client} from './Client';

if(process.argv.length !== 3){
	console.log("Missing arguments");
	process.exit(1);
}

var fs = require('fs');
var path = require('path');
var root = path.resolve(__dirname, '..', '..');

try{
	var argument = JSON.parse(fs.readFileSync(process.argv[2]));
}catch(e){
	console.log("Mallformed argument");
	process.exit(1);
}

//Starts server process
var daemon = require("daemonize2").setup({
    main: require('path').resolve(__filename, '..','..','dist', 'Server.js'),
    name: "nodedriver",
    pidfile: root+'/nodedriver.pid',
	silent: true
});

function sendParams()
{
	(async () => {
		try{
			var client = new Client();
			client.on('close', () => {
				setTimeout(() => {
					console.log("Timeout, Not return response retreived");
					process.exit(1);
				},2000);
			});
			await client.connect();
			await client.write(argument);
			var response = await client.read();
			if(response.toString().charCodeAt(0) === 27){
				console.log(response.substr(1));
				process.exit(1);
			}
			console.log(JSON.stringify(response));
			process.exit(0);
		}catch(e){
			console.log(e);
			process.exit(1);
		}
	})();
}


var startUpTimeout = setTimeout(() => {
	console.log("Server process not working");
	process.exit(0);
},5000);

function checkBeforeSending()
{
	if(!fs.existsSync(root+'/nodedriver.sock')){
		setTimeout(checkBeforeSending, 100);
	}else{
		clearTimeout(startUpTimeout);
		sendParams();
	}
}

if(daemon.status() === 0){
	if(fs.existsSync(root+'/nodedriver.sock')){
		fs.unlinkSync(root+'/nodedriver.sock');
	}
	daemon.start();
}
checkBeforeSending();