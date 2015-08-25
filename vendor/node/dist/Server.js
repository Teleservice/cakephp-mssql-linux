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

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _ClientConnection = require('./ClientConnection');

var fs = require('fs');

var net = require('net');
var path = require('path');
var root = path.resolve(__dirname, '..', '..');

if (!fs.existsSync(root + '/tmp')) {
	fs.mkdirSync(root + '/tmp');
}
if (fs.existsSync(root + '/nodedriver.sock')) {
	fs.unlinkSync(root + '/nodedriver.sock');
}

var timeout = null;

function addTimeout() {
	var ms = arguments.length <= 0 || arguments[0] === undefined ? 30000 : arguments[0];

	if (timeout !== null) {
		clearTimeout(timeout);
	}
	timeout = setTimeout(function () {
		process.exit(0);
	}, ms);
}

var Server = (function () {
	function Server() {
		_classCallCheck(this, Server);
	}

	_createClass(Server, [{
		key: 'start',
		value: function start() {
			var _this = this;

			this._netServer = net.createServer(function callee$2$0(client) {
				return _regeneratorRuntime.async(function callee$2$0$(context$3$0) {
					while (1) switch (context$3$0.prev = context$3$0.next) {
						case 0:
							addTimeout(30000);
							new _ClientConnection.ClientConnection(client);

						case 2:
						case 'end':
							return context$3$0.stop();
					}
				}, null, _this);
			});
			this._netServer.listen(root + '/nodedriver.sock');
			console.log("Started");
		}
	}], [{
		key: 'start',
		value: function start() {
			if (Server._server === null) {
				Server._server = new Server();
				Server._server.start();
			}
		}
	}, {
		key: '_server',
		value: null,
		enumerable: true
	}]);

	return Server;
})();

Server.start();
addTimeout();