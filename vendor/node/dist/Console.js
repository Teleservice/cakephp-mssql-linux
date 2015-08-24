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

var _regeneratorRuntime = require('babel-runtime/regenerator')['default'];

var _Client = require('./Client');

if (process.argv.length !== 3) {
	console.log("Missing arguments");
	process.exit(1);
}

var fs = require('fs');

try {
	var argument = JSON.parse(fs.readFileSync(process.argv[2]));
} catch (e) {
	console.log("Mallformed argument");
	process.exit(1);
}

if (!fs.existsSync('/tmp/nodedriver')) {
	fs.mkdirSync('/tmp/nodedriver');
}

//Starts server process
var daemon = require("daemonize2").setup({
	main: require('path').resolve(__filename, '..', '..', 'dist', 'Server.js'),
	name: "nodedriver",
	pidfile: '/tmp/nodedriver/nodedriver.pid',
	silent: true
});

function sendParams() {
	var _this = this;

	(function callee$1$0() {
		var client, response;
		return _regeneratorRuntime.async(function callee$1$0$(context$2$0) {
			while (1) switch (context$2$0.prev = context$2$0.next) {
				case 0:
					context$2$0.prev = 0;
					client = new _Client.Client();

					client.on('close', function () {
						setTimeout(function () {
							console.log("Timeout, Not return response retreived");
							process.exit(1);
						}, 2000);
					});
					context$2$0.next = 5;
					return _regeneratorRuntime.awrap(client.connect());

				case 5:
					context$2$0.next = 7;
					return _regeneratorRuntime.awrap(client.write(argument));

				case 7:
					context$2$0.next = 9;
					return _regeneratorRuntime.awrap(client.read());

				case 9:
					response = context$2$0.sent;

					if (response.toString().charCodeAt(0) === 27) {
						console.log(response.substr(1));
						process.exit(1);
					}
					console.log(JSON.stringify(response));
					process.exit(0);
					context$2$0.next = 19;
					break;

				case 15:
					context$2$0.prev = 15;
					context$2$0.t0 = context$2$0['catch'](0);

					console.log(context$2$0.t0);
					process.exit(1);

				case 19:
				case 'end':
					return context$2$0.stop();
			}
		}, null, _this, [[0, 15]]);
	})();
}

var startUpTimeout = setTimeout(function () {
	console.log("Server process not working");
	process.exit(0);
}, 5000);

function checkBeforeSending() {
	if (!fs.existsSync('/tmp/nodedriver/nodedriver.sock')) {
		setTimeout(checkBeforeSending, 100);
	} else {
		clearTimeout(startUpTimeout);
		sendParams();
	}
}

if (daemon.status() === 0) {
	if (fs.existsSync('/tmp/nodedriver/nodedriver.sock')) {
		fs.unlinkSync('/tmp/nodedriver/nodedriver.sock');
	}
	daemon.start();
}
checkBeforeSending();