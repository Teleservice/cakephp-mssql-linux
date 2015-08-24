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

namespace MsSQLLinux\Test\TestCase;

use Cake\ORM\TableRegistry;
use Cake\TestSuite\TestCase;


/**
 * App\Model\Table\CustomersTable Test Case
 */
class MsSQLTableTest extends TestCase
{
	public $fixtures = [ 'plugin.MsSQLLinux.MsSQL' ];
	
	public function setUp()
	{
		parent::setUp();
		$this->MsSQLs = TableRegistry::get("MsSQLLinux.MsSQLs");
	}
	
	/**
	 * Tests select from MsSQL
	 */
	public function testSelect()
	{
		$entity = $this->MsSQLs->find()->where(['title' => 'Second Article'])->first();
		$this->assertNotEquals($entity, null, "Entity not found");
		$this->assertEquals($entity->title, "Second Article", "Entity did not contain expected column value");
	}
	
	/**
	 * Tests insert to MsSQL
	 */
	public function testInsert()
	{
		$entity = $this->MsSQLs->patchEntity($this->MsSQLs->newEntity(), [
			"title" => "New Article"
		]);
		
		$this->assertTrue($this->MsSQLs->save($entity) !== false, "Was not able to save");
		
		$entity = $this->MsSQLs->find()->where(['title' => 'New Article'])->first();
		$this->assertNotEquals($entity, null, "Entity not found");
		$this->assertEquals($entity->title, "New Article", "Entity did not contain expected column value");
	}
	
	/**
	 * Tests delete from MsSQL
	 */
	public function testDelete()
	{
		$this->MsSQLs->query()
				->delete()
				->where(['title' => 'First Article'])
				->execute();
		$entity = $this->MsSQLs->find()->where(['title' => 'New Article'])->first();
		$this->assertEquals($entity, null, "Table row was not deleted");
	}
}