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

namespace MsSQLLinux\Database\Statement;

use Cake\Database\Statement\StatementDecorator;

/**
 * Statement class meant to be used by an Node driver
 *
 * @internal
 */
class NodeStatement extends StatementDecorator
{

	protected $_sql = null;
	protected $queryString = null;
	protected $_values = [];
	protected $_placeholderCounter = 1;
	protected $_results = null;
	protected $_fetch_results = null;

	public function __construct($sql, $driver)
	{
		$this->_sql = $sql;
		$this->_queryString = $sql;
		parent::__construct(null, $driver);
	}

	/**
	 * Stores the value to be binded in Statement to
	 * later be inserted into sql
	 * 
	 * @param type $column Name of column
	 * @param type $value Value of column
	 * @param string $type Type of column
	 */
	public function bindValue($column, $value, $type = 'string')
	{
		if ($type === null) {
			$type = 'string';
		}
		if (!ctype_digit($type)) {
			list($value, $type) = $this->cast($value, $type);
		}
		if (is_null($value)) {
			$value = 'NULL';
		} else if (preg_match('/^[0-9]{1,}$/', $value) == 0) { //Escapes all non numerical strings
			$value = "'" . preg_replace("/\'/", "''", $value) . "'";
		}

		$this->_values[] = [
			$column, $value
		];
	}

	/**
	 * Insert values into SQL string and calls
	 * execute on Node Driver
	 * 
	 * @param type $params
	 * @return boolean|Array|string
	 */
	public function execute($params = null)
	{
		if ($this->_hasExecuted) {
			return;
		}
		if (empty($this->_sql)) {
			return;
		}
		$this->_hasExecuted = true;
		$sql = $this->_sql;
		foreach ($this->_values as $item) {
			$column = $item[0];
			$value = $item[1];
			if (is_numeric($column)) {
				$sql = preg_replace('/\?/', $value, $sql, 1);
			}
		}

		foreach (array_reverse($this->_values) as $item) {
			$column = $item[0];
			$value = $item[1];
			if (!is_numeric($column)) {
				$sql = preg_replace('/\:' . $column . '/', $value, $sql);
			}
		}
		try {
			$response = $this->_driver->execute($sql);
			$this->_fetch_results = $this->_results = $response;
			return $response;
		} catch (Exception $e) {
			Cake\Log\Log::error($e);
			return false;
		}
	}

	/**
	 * Not used, overrided to disable method
	 */
	public function closeCursor()
	{
		
	}

	/**
	 * {@inheritDoc}
	 * 
	 */
	public function fetch($type = 'num')
	{
		if(!is_array($this->_fetch_results)){
			$this->_fetch_results = (array)$this->_fetch_results;
		}
		if(count($this->_fetch_results) == 0){
			return null;
		}
		$item = array_shift($this->_fetch_results);
		switch ($type) {
			case "num":
				$item = array_values($item);
				break;
		}
		return $item;
	}

	/**
	 * {@inheritDoc}
	 * 
	 */
	public function fetchAll($type = 'num')
	{
		if(!is_array($this->_fetch_results)){
			$this->_fetch_results = (array)$this->_fetch_results;
		}
		$list = $this->_results;
		switch ($type) {
			case "num":
				foreach ($list as &$item) {
					$item = array_values($item);
					unset($item);
				}
				break;
		}
		return $list;
	}

	/**
	 * Overided do disable method
	 * 
	 */
	public function _version()
	{
		return null;
	}
	
	/**
	 * {@inheritDoc}
	 * 
	 */
	public function rowCount()
	{
		return count($this->_results);
	}
	
	/**
	 * {@inheritDoc}
	 * 
	 */
	public function columnCount()
	{
		if(count($this->_results) === 0){
			return 0;
		}
		return count(array_keys($this->_results[0]));
	}

}
