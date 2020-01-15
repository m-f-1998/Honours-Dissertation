<?php
namespace src\system;

class DatabaseConnector {

    private $dbConnection = null;

    public function __construct()
    {
        $connect = mysqli_connect(getenv('DB_HOST'), getenv('DB_USERNAME'), getenv('DB_PASSWORD'), getenv('DB_DATABASE'));

        if (mysqli_connect_errno()) {
            die('<p>Failed to connect to MySQL: '.mysqli_connect_error().'</p>');
        } else {
            $this->dbConnection = $connect;
        }
    }

    public function getConnection()
    {
        return $this->dbConnection;
    }
}
