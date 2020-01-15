<?php
require 'vendor/autoload.php';
include 'src/system/DatabaseConnector.php';

use Dotenv\Dotenv;
use src\system\DatabaseConnector;

$dotenv = new DotEnv(__DIR__);
$dotenv->load();

$dbConnection = (new DatabaseConnector())->getConnection();
