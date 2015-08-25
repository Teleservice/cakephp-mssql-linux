# CakePHP MsSQL Linux Plugin
CakePHP MsSQL plugin for linux

## Requirements
NodeJS v0.12

## Installation

Add this to your composer.json

```json
{
	"repositories": [
		{
		    "type": "git",
		    "url": "https://github.com/teleservice/cakephp-mssql-linux.git"
		}
	],
	"require": {
		"teleservice/mssql-linux": "*",
	}
}
```

afterwards inside of your project folder, run the following

```bash
$ composer install
```

## Configuration

In your app.php add the following to Datasources

```php
'test_mssql' => [
	'className' => 'Cake\Database\Connection',
	'driver' => 'MsSQLLinux\Database\Driver\Node', 
	'persistent' => false,
	'host' => '<IP TO MsSQL Server>',
	'username' => '<MsSQL USERNAME>',
	'password' => '<MsSQL PASSWORD>',
	'database' => 'tests',
	'encoding' => 'utf8',
	'timezone' => 'UTC',
	'cacheMetadata' => true,
	'quoteIdentifiers' => false,
],
```

Replace the <> with something that correspond to your settings. and afterwards make sure the user has read, write and create access to the test database.

Add the following to the end of your bootstrap.php file

```php
Plugin::load('MsSQLLinux', ['bootstrap' => true]);
```

Add this to your phpunit.xml.dist

```xml
<testsuite name="MsSQLLinux Plugin Test Suite">
	<directory>./vendor/teleservice/mssql-linux/tests/TestCase</directory>
</testsuite>
```

## Try it out

All tests should now successfully run and afterwards you can just add some more connections that uses the MsSQLLinux Node Driver.

## License

GNU General Public License, version 3
