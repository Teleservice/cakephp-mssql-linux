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

namespace MsSQLLinux\Database\Exception;

use Cake\Core\Exception\Exception;

class NodeDriverException extends Exception
{
    /**
     * {@inheritDoc}
     */
    protected $_messageTemplate = 'NodeDriver failed to execute "%s" "%s" due to "%s"';
}