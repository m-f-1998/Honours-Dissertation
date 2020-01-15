<?php
require "../bootstrap.php";
include '../src/controller/PersonController.php';

use src\controller\PersonController;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET,POST,PUT,DELETE");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

$userId = (int) $_GET['id'] ? isset($_GET['id']) : null;

if ($_GET['arg'] !== 'person') {
    header("HTTP/1.1 404 Not Found");
    exit('404 Not Found');
}

if (! authenticate()) {
    header("HTTP/1.1 401 Unauthorized");
    exit('Unauthorized');
}

$controller = new PersonController($dbConnection, $_SERVER["REQUEST_METHOD"], $userId);
$controller->processRequest();

function authenticate() {
    try {
        if(!isset($_GET['token'])) {
            throw new Exception('No Bearer Token');
        }
        $jwtVerifier = (new \Okta\JwtVerifier\JwtVerifierBuilder())->setIssuer(getenv('OKTAISSUER'))->setAudience('api://default')->setClientId(getenv('OKTACLIENTID'))->build();
        return $jwtVerifier->verify($_GET['token']);
    } catch (Exception $e) {
        return false;
    }
}
