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

var _Client = require('./Client');

var _Command = require('./Command');

var _Exception = require('./Exception');

function delay(ms) {
	return new _Promise(function (resolve) {
		return setTimeout(resolve, ms);
	});
};

var ClientConnection = (function () {
	_createClass(ClientConnection, [{
		key: 'client',
		get: function get() {
			return this._client;
		}
	}]);

	function ClientConnection(connection) {
		_classCallCheck(this, ClientConnection);

		this._client = null;

		this._client = new _Client.Client(connection);
		this.initialize();
	}

	_createClass(ClientConnection, [{
		key: 'initialize',
		value: function initialize() {
			var data, response;
			return _regeneratorRuntime.async(function initialize$(context$2$0) {
				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						context$2$0.prev = 0;
						context$2$0.next = 3;
						return _regeneratorRuntime.awrap(this.client.read());

					case 3:
						data = context$2$0.sent;

						if ("command" in data) {
							context$2$0.next = 6;
							break;
						}

						throw new _Exception.Exception("Command missing");

					case 6:
						if (!("params" in data) || typeof data.params !== 'object' || !(data.params instanceof Array)) {
							data.params = [];
						}

						if (data.command in _Command.Command) {
							context$2$0.next = 9;
							break;
						}

						throw new _Exception.Exception("Command does not exist");

					case 9:
						context$2$0.next = 11;
						return _regeneratorRuntime.awrap(_Command.Command[data.command].apply(_Command.Command, data.params));

					case 11:
						response = context$2$0.sent;
						context$2$0.next = 14;
						return _regeneratorRuntime.awrap(this.client.write(response));

					case 14:
						context$2$0.next = 16;
						return _regeneratorRuntime.awrap(delay(50));

					case 16:
						context$2$0.next = 18;
						return _regeneratorRuntime.awrap(this.client.disconnect());

					case 18:
						context$2$0.next = 28;
						break;

					case 20:
						context$2$0.prev = 20;
						context$2$0.t0 = context$2$0['catch'](0);
						context$2$0.next = 24;
						return _regeneratorRuntime.awrap(this.client.write(String.fromCharCode(27) + context$2$0.t0));

					case 24:
						context$2$0.next = 26;
						return _regeneratorRuntime.awrap(delay(50));

					case 26:
						context$2$0.next = 28;
						return _regeneratorRuntime.awrap(this.client.disconnect());

					case 28:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this, [[0, 20]]);
		}
	}]);

	return ClientConnection;
})();

exports.ClientConnection = ClientConnection;