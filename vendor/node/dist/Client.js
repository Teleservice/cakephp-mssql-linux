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

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _Promise = require('babel-runtime/core-js/promise')['default'];

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

Object.defineProperty(exports, '__esModule', {
	value: true
});
var child_process = require('child_process');
var path = require('path');
var fs = require('fs');
var net = require('net');
var events = require('events');

function delay(ms) {
	return new _Promise(function (resolve) {
		return setTimeout(resolve, ms);
	});
};

var Client = (function (_events$EventEmitter) {
	_inherits(Client, _events$EventEmitter);

	_createClass(Client, null, [{
		key: 'BUFFER_TIMEOUT',
		value: 100,
		enumerable: true
	}, {
		key: 'READ_TIMEOUT',
		value: 20000,
		enumerable: true
	}]);

	function Client() {
		var netClient = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

		_classCallCheck(this, Client);

		_get(Object.getPrototypeOf(Client.prototype), 'constructor', this).call(this);
		this._netClient = null;
		this._connected = false;
		this._buffer = null;
		this._bufferTimeout = null;
		if (netClient !== null) {
			this._netClient = netClient;
			this.initialize();
		}
	}

	_createClass(Client, [{
		key: 'connect',
		value: function connect() {
			return _regeneratorRuntime.async(function connect$(context$2$0) {
				var _this = this;

				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						if (!(this._netClient !== null)) {
							context$2$0.next = 2;
							break;
						}

						return context$2$0.abrupt('return');

					case 2:
						context$2$0.next = 4;
						return _regeneratorRuntime.awrap(new _Promise(function (resolve, reject) {
							_this._netClient = net.connect({ 'path': '/tmp/nodedriver/nodedriver.sock' }, function () {
								resolve();
							});
							_this._netClient.on('error', function (e) {
								reject(e);
							});
							_this.initialize();
						}));

					case 4:
						this._connected = true;

					case 5:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this);
		}
	}, {
		key: 'initialize',
		value: function initialize() {
			var _this2 = this;

			this._netClient.on('end', function (e) {
				_this2.disconnect();
			});
			this._netClient.on('error', function (e) {
				_this2.disconnect();
			});
			this._netClient.on('data', function (data) {
				if (_this2._buffer !== null) {
					_this2._buffer = Buffer.concat(_this2._buffer, data);
				} else {
					_this2._buffer = data;
				}
				if (_this2._bufferTimeout !== null) {
					clearTimeout(_this2._bufferTimeout);
				}
				_this2._bufferTimeout = setTimeout(function () {
					var data = _this2._buffer.toString();
					_this2._buffer = null;
					try {
						data = JSON.parse(data);
					} catch (e) {}
					_this2.emit('data', data);
				}, Client.BUFFER_TIMEOUT);
			});
		}
	}, {
		key: 'disconnect',
		value: function disconnect() {
			try {
				this._netClient.end();
			} catch (e) {}
			try {
				this._netClient.destroy();
			} catch (e) {}
			this._netClient = null;
			this.emit('close');
		}
	}, {
		key: 'write',
		value: function write() {
			var object = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
			return _regeneratorRuntime.async(function write$(context$2$0) {
				var _this3 = this;

				while (1) switch (context$2$0.prev = context$2$0.next) {
					case 0:
						context$2$0.next = 2;
						return _regeneratorRuntime.awrap(new _Promise(function (resolve) {
							_this3._netClient.write(JSON.stringify(object), function () {
								resolve();
							});
						}));

					case 2:
					case 'end':
						return context$2$0.stop();
				}
			}, null, this);
		}
	}, {
		key: 'read',
		value: function read() {
			var _this4 = this;

			var object = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

			return new _Promise(function (resolve, reject) {
				var onData = null;
				onData = function (data) {
					if (readTimeout !== null) {
						clearTimeout(readTimeout);
					}
					_this4.removeListener('data', onData);
					resolve(data);
				};
				var readTimeout = setTimeout(function () {
					readTimeout = null;
					_this4.removeListener('data', onData);
					reject("Read timeout");
				}, Client.READ_TIMEOUT);
				_this4.on('data', onData);
			});
		}
	}, {
		key: 'connected',
		get: function get() {
			return this._connected;
		}
	}]);

	return Client;
})(events.EventEmitter);

exports.Client = Client;