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

'use strict';

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _Exception = require('./Exception');

var mssql = require('mssql');

function delay(ms) {
	return new _Promise(function (resolve) {
		return setTimeout(resolve, ms);
	});
};

var MssqlConnection = (function () {
	function MssqlConnection(config) {
		_classCallCheck(this, MssqlConnection);

		this._id = null;
		this._config = null;
		this._connected = false;
		this._connection = null;
		this._statementCounter = 1;

		this._id = MssqlConnection._connectionCounter++;
		this._config = config;
	}

	_createClass(MssqlConnection, [{
		key: 'query',
		value: function query(sql) {
			return _regeneratorRuntime.async(function query$(context$2$0) {
				var _this = this;

				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						context$2$0.next = 2;
						return _regeneratorRuntime.awrap(new _Promise(function (resolve, reject) {
							try {
								var request = new mssql.Request(_this._connection);
								request.query(sql, function (err, recordset) {
									if (err) {
										return reject(err);
									}
									if (typeof recordset === 'undefined') {
										return resolve(true);
									}
									return resolve(recordset);
								});
							} catch (e) {
								return reject(e);
							}
						}));

					case 2:
						return context$2$0.abrupt('return', context$2$0.sent);

					case 3:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this);
		}
	}, {
		key: 'connect',
		value: function connect() {
			var config;
			return _regeneratorRuntime.async(function connect$(context$2$0) {
				var _this2 = this;

				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						config = {
							'user': this._config['username'],
							'password': this._config['password'],
							'database': this._config['database'],
							'server': this._config['host']
						};
						context$2$0.next = 3;
						return _regeneratorRuntime.awrap(new _Promise(function (resolve, reject) {
							_this2._connection = new mssql.Connection(config, function (err) {
								if (err) {
									return reject(err);
								}
								return resolve();
							});
						}));

					case 3:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this);
		}
	}, {
		key: 'close',
		value: function close() {
			return _regeneratorRuntime.async(function close$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						this._connection.close();

					case 1:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this);
		}
	}, {
		key: 'id',
		get: function get() {
			return this._id;
		}
	}], [{
		key: 'create',
		value: function create(config) {
			var connection = new MssqlConnection(config);
			MssqlConnection._connections[connection.id] = connection;
			return connection;
		}
	}, {
		key: 'get',
		value: function get(id) {
			return MssqlConnection._connections[id];
		}
	}, {
		key: '_connections',
		value: {},
		enumerable: true
	}, {
		key: '_connectionCounter',
		value: 1,
		enumerable: true
	}]);

	return MssqlConnection;
})();

var Command = (function () {
	function Command() {
		_classCallCheck(this, Command);
	}

	_createClass(Command, null, [{
		key: 'connect',
		value: function connect(config) {
			var connection;
			return _regeneratorRuntime.async(function connect$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						if (!(typeof config !== 'object')) {
							context$2$0.next = 2;
							break;
						}

						throw new _Exception.Exception("Config missing");

					case 2:
						connection = MssqlConnection.create(config);
						context$2$0.next = 5;
						return _regeneratorRuntime.awrap(connection.connect());

					case 5:
						return context$2$0.abrupt('return', connection.id);

					case 6:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this);
		}
	}, {
		key: 'close',
		value: function close(id) {
			var connection;
			return _regeneratorRuntime.async(function close$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						if (!(typeof id !== 'number')) {
							context$2$0.next = 2;
							break;
						}

						throw new _Exception.Exception("id not a number");

					case 2:
						connection = MssqlConnection.get(id);

						connection.close();

					case 4:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this);
		}
	}, {
		key: 'query',
		value: function query(id, sql) {
			var connection;
			return _regeneratorRuntime.async(function query$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						if (!(typeof id !== 'number')) {
							context$2$0.next = 2;
							break;
						}

						throw new _Exception.Exception("id not a number");

					case 2:
						if (!(typeof sql !== 'string' || sql.trim() === '')) {
							context$2$0.next = 4;
							break;
						}

						throw new _Exception.Exception("sql is not a sql query string");

					case 4:
						connection = MssqlConnection.get(id);
						context$2$0.next = 7;
						return _regeneratorRuntime.awrap(connection.query(sql));

					case 7:
						return context$2$0.abrupt('return', context$2$0.sent);

					case 8:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this);
		}
	}]);

	return Command;
})();

exports.Command = Command;