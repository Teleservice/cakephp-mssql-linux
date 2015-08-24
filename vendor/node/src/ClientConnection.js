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

function delay(ms){
	return new Promise((resolve) => setTimeout(resolve, ms));
};

import {Client} from './Client';
import {Command} from './Command';
import {Exception} from './Exception';

export class ClientConnection
{
	_client = null;
	
	get client ()
	{
		return this._client;
	}
	
	constructor(connection)
	{
		this._client = new Client(connection);
		this.initialize();
	}
	
	async initialize()
	{
		try{
			var data = await this.client.read();
			if(!("command" in data)){
				throw new Exception("Command missing");
			}
			if(!("params" in data) || typeof data.params !== 'object' || !(data.params instanceof Array)){
				data.params = [];
			}
			if(!(data.command in Command)){
				throw new Exception("Command does not exist");
			}
			var response = await Command[data.command].apply(Command, data.params);
			await this.client.write(response);
			await delay(50);
			await this.client.disconnect();
		}catch(e){
			await this.client.write(String.fromCharCode(27)+e);
			await delay(50);
			await this.client.disconnect();
		}
	}
}