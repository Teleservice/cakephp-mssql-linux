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

var mssql = require('mssql');

function delay(ms){
	return new Promise((resolve) => setTimeout(resolve, ms));
};

import {Exception} from './Exception';

class MssqlConnection
{	
	_id = null;
	_config = null;
	_connected = false;
	_connection = null;
	
	_statementCounter = 1;
	
	constructor(config)
	{
		this._id = MssqlConnection._connectionCounter++;
		this._config = config;
	}
	
	get id()
	{
		return this._id;
	}
	
	async query(sql)
	{	
		return await new Promise((resolve, reject) => {
			try{
				var request = new mssql.Request(this._connection);
				request.query(sql, (err, recordset) => {
					if(err){
						return reject(err);
					}
					if(typeof recordset === 'undefined'){
						return resolve(true);
					}
					return resolve(recordset);
				});
			}catch(e){
				return reject(e);
			}
		});
	}
	
	static _connections = {};
	static _connectionCounter = 1;
	
	async connect()
	{
		var config = {
			'user': this._config['username'],
			'password': this._config['password'],
			'database': this._config['database'],
			'server': this._config['host'],
		};
		await new Promise((resolve, reject) => {
			this._connection = new mssql.Connection(config, (err) => {
				if(err){
					return reject(err);
				}
				return resolve();
			});
		});
	}
	
	async close()
	{
		this._connection.close();
	}
	
	static create(config)
	{
		var connection = new MssqlConnection(config);
		MssqlConnection._connections[connection.id] = connection;
		return connection;
	}
	
	static get(id)
	{
		return MssqlConnection._connections[id];
	}
}

export class Command
{
	static async connect(config)
	{
		if(typeof config !== 'object'){
			throw new Exception("Config missing");
		}
		var connection = MssqlConnection.create(config);
		await connection.connect();
		return connection.id;
	}
	
	static async close(id)
	{
		if(typeof id !== 'number'){
			throw new Exception("id not a number");
		}
		var connection = MssqlConnection.get(id);
		connection.close();
	}
	
	static async query(id, sql)
	{
		if(typeof id !== 'number'){
			throw new Exception("id not a number");
		}
		if(typeof sql !== 'string' || sql.trim() === ''){
			throw new Exception("sql is not a sql query string");
		}
		var connection = MssqlConnection.get(id);
		return await connection.query(sql);
	}
}