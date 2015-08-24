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

//CakeJS.Core.Exception.Exception

/**
 * Base class for all custom exceptions
 * may also be used standalone
 * 
 * @class Exception
 */
"use strict";

var _classCallCheck = require("babel-runtime/helpers/class-call-check")["default"];

var _Object$create = require("babel-runtime/core-js/object/create")["default"];

Object.defineProperty(exports, "__esModule", {
  value: true
});

var Exception =
/**
 * @constructor
 * @param {string} message Message to be thrown
 */
function Exception(message) {
  _classCallCheck(this, Exception);

  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
}

/**
 * This is a workaround to make Exception inherit Error
 * without loosing it's own identity
 */
;

exports.Exception = Exception;
Exception.prototype = _Object$create(Error.prototype);
Exception.prototype.constructor = Exception;