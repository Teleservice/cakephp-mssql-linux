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

namespace MsSQLLinux\Test\Fixture;

use Cake\TestSuite\Fixture\TestFixture;

class MsSQLFixture extends TestFixture
{
	public $name = 'MsSQL';
	
      // Optional. Set this property to load fixtures to a different test datasource
      public $connection = 'test_mssql';

      public $fields = [
          'id' => ['type' => 'integer'],
          'title' => ['type' => 'string', 'length' => 255, 'null' => false],
          'body' => 'text',
          'published' => ['type' => 'integer', 'default' => '0', 'null' => false],
          '_constraints' => [
            'primary' => ['type' => 'primary', 'columns' => ['id']]
          ]
      ];
      public $records = [
          [
              'title' => 'First Article',
              'body' => 'First Article Body',
              'published' => '1',
          ],
          [
              'title' => 'Second Article',
              'body' => 'Second Article Body',
              'published' => '1',
          ],
          [
              'title' => 'Third Article',
              'body' => 'Third Article Body',
              'published' => '0',
          ]
      ];
 }