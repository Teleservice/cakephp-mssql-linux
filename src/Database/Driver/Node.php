<?php
/*
 * Copyright (C) 2015 Teleservice Skåne AB
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 * 
 */

/**
 * @author Olle Tiinus aka Tiinusen <olle.tiinus@teleservice.net>
 */

namespace MsSQLLinux\Database\Driver;

use Cake\Database\Dialect\SqlserverDialectTrait;
use Cake\Database\Query;
use Cake\Core\Exception\Exception;

use MsSQLLinux\Database\Exception\NodeDriverException;
use MsSQLLinux\Database\Statement\NodeStatement;

/**
 * Helper class
 */
class NodeConnection
{
	private $_driver = null;
	public function __construct($driver)
	{
		$this->_driver = $driver;
	}
	
	public function getAttribute()
	{
		return null;
	}
}

/**
 * Node Database Driver
 */
class Node extends \Cake\Database\Driver
{

	use SqlserverDialectTrait;

	/**
	 * Base configuration settings for Node Sqlserver driver
	 * (Only using host, username, password, database)
	 */
	protected $_baseConfig = [
		'persistent' => false,
		'host' => 'localhost',
		'username' => '',
		'password' => '',
		'database' => 'cake',
		// PDO::SQLSRV_ENCODING_UTF8
		'encoding' => 65001,
		'flags' => [],
		'init' => [],
		'settings' => [],
	];
	private $_connectionId;
	private static $_connections = [];
	private static $_enabled = null;

	/**
	 * Sends a command with arguments to NodeJS process
	 * which executes and when done returns the response
	 * to this driver if no errors occur a Array returns
	 * 
	 * @param string $action Command in NodeJS process
	 * @return Array|Boolean|String
	 * @throws NodeDriverException
	 */
	private function executeOnNodeDriver($action)
	{
		$args = func_get_args();
		array_shift($args);
		$jsonString = json_encode([
			"command" => $action,
			"params" => $args
		]);
		$tmpHandle = tmpfile();
		fwrite($tmpHandle, $jsonString);
		$metaDatas = stream_get_meta_data($tmpHandle);
		$tmpFilename = $metaDatas['uri'];
		$execString = "node " . realpath(dirname(__FILE__) . '/../../../vendor/node/index.js') . ' '. $tmpFilename;
		//debug($execString);
		try{
			$response = exec($execString, $output, $return_var);
		}catch(Exception $e){
			//debug($e);
		}
		//debug($response);
		fclose($tmpHandle);
		if($return_var != 0){
			throw new NodeDriverException([$action, print_r($args,true), $response]);
		}
		try {
			$response = json_decode($response, true);
		} catch (Exception $ex) {
			
		}
		return $response;
	}

	/**
	 * Sends a connect command to NodeJS Process which
	 * returns a connection id.
	 * 
	 * @return boolean
	 * @throws Exception
	 */
	public function connect()
	{
		if ($this->_connection) {
			return true;
		}
		$config = $this->_config;
		$md5String = md5(json_encode($config));
		if(!isset(self::$_connections[$md5String])){
			self::$_connections[$md5String] = $this->executeOnNodeDriver("connect", $config);
			if(empty(self::$_connections[$md5String])){
				throw new Exception("Unable to connect to NodeDriver");
			}
		}
		$this->_connectionId = self::$_connections[$md5String];
		$this->_connection = new NodeConnection($this);
		return true;
	}

	/**
	 * Checks if NodeJS is installed
	 * 
	 * @return boolean
	 */
	public function enabled()
	{
		if(is_null(self::$_enabled)){
			$response = exec("which node");
			if(empty($response) || strpos(strtolower($response), "command not found") === true){
				self::$_enabled = false;
			}else{
				self::$_enabled = true;
				$path = realpath(dirname(__FILE__) . '/../../../vendor/node');
				if(!file_exists($path."/node_modules")){
					exec("cd $path && npm install > /dev/null");
				}
			}
		}
		return self::$_enabled;
	}

	protected $_connection;

	/**
     * Returns correct connection resource or object that is internally used
     * If first argument is passed, it will set internal connection object or
     * result to the value passed
     *
     * @param null|\NodeConnection $connection The Node Connection connection instance.
     * @return mixed connection object used internally
     */
	public function connection($connection = null)
	{
		if ($connection !== null) {
			$this->_connection = $connection;
		}
		return $this->_connection;
	}

	/**
	 * Sends a disconnect command to NodeJS Process
	 */
	public function disconnect()
	{
		if(!empty($this->_connection)){
			$this->_connection = null;
			$this->executeOnNodeDriver("close", $this->_connectionId);
		}
	}

	/**
	 * Create a NodeStatement from query and returns it
	 * 
	 * @param Query $query
	 * @return NodeStatement
	 */
	public function prepare($query)
	{
		$this->connect();
		$isObject = $query instanceof Query;
		return new NodeStatement($isObject ? $query->sql() : $query,$this);
	}
	
	/**
	 * Sends a query command to NodeJS Process with sql string
	 * as parameter, waits and returns the response
	 * 
	 * @param string $sql
	 * @return boolean
	 */
	public function execute($sql)
	{
		try{
			return $this->executeOnNodeDriver("query", $this->_connectionId, $sql);
		}catch(Exception $e){
			return false;
		}
	}

	/**
	 * This is not yet supported
	 * 
	 * @return boolean
	 */
	public function beginTransaction()
	{
		$this->connect();
		return true;
	}

	/**
	 * This is not yet supported
	 * 
	 * @return boolean
	 */
	public function commitTransaction()
	{
		$this->connect();
		return true;
	}

	/**
	 * This is not yet supported
	 * 
	 * @return boolean
	 */
	public function rollbackTransaction()
	{
		$this->connect();
		return true;
	}

	/**
	 * This is not yet supported
	 * 
	 * @return boolean
	 */
	public function quote($value, $type)
	{
		throw new Exception("Not Yet Implemented");
		$this->connect();
		return true;
	}

	/**
	 * This is not yet supported
	 * 
	 * @return boolean
	 */
	public function lastInsertId($table = null, $column = null)
	{
		throw new Exception("Not Yet Implemented");
		$this->connect();
		return null;
	}

	
	public function supportsQuoting()
	{
		return false;
	}
	
	/**
	 * If connected, it disconnects
	 */
	public function __destruct()
	{
		$this->disconnect();
	}

}
