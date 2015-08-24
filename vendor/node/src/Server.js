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

var fs = require('fs');
var net = require('net');
if(!fs.existsSync('/tmp/nodedriver')){
	fs.mkdirSync('/tmp/nodedriver');
}
if(fs.existsSync('/tmp/nodedriver/nodedriver.sock')){
	fs.unlinkSync('/tmp/nodedriver/nodedriver.sock');
}

var timeout = null;

import {ClientConnection} from './ClientConnection';

function addTimeout(ms = 30000){
	if(timeout !== null){
		clearTimeout(timeout);
	}
	timeout = setTimeout(() => {
		process.exit(0);
	}, ms);
}

class Server 
{
	static _server = null;
	
	static start()
	{
		if(Server._server === null){
			Server._server = new Server();
			Server._server.start();
		}
	}
	
	start()
	{
		this._netServer = net.createServer(async (client) => {
			addTimeout(30000);
			new ClientConnection(client);
		});
		this._netServer.listen('/tmp/nodedriver/nodedriver.sock');
		console.log("Started");
	}
		
}

Server.start();
addTimeout();