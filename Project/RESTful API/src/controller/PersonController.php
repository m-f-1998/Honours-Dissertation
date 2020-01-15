<?php
namespace src\controller;

require_once '../src/table_gateways/PersonGateway.php';
use src\table_gateways\PersonGateway;

class PersonController {

    private $db;
    private $requestMethod;
    private $userId;
    private $personGateway;

    public function __construct($db, $requestMethod, $userId)
    {
        $this->db = $db;
        $this->requestMethod = $requestMethod;
        $this->userId = $userId;
        $this->personGateway = new PersonGateway($db);
    }

    public function processRequest()
    {
        switch ($this->requestMethod) {
            case 'GET':
                if ($this->userId) {
                    $response = $this->getUser($this->userId);
                } else {
                    $response = $this->getAllUsers();
                };
                break;
            case 'POST':
                $response = $this->createUserFromRequest();
                break;
            case 'PUT':
                $response = $this->updateUserFromRequest($this->userId);
                break;
            case 'DELETE':
                $response = $this->deleteUser($this->userId);
                break;
            default:
                $response = $this->not_found();
                break;
        }
        header($response['status_code']);
        if ($response['response']) {
            echo $response['response'];
        }
    }

    private function getAllUsers()
    {
      return ['status_code' => 'HTTP/1.1 200 OK', 'response' => json_encode($this->personGateway->findAll())];
    }

    private function getUser($id)
    {
      $result = $this->personGateway->find($id);
      return ['status_code' => 'HTTP/1.1 200 OK', 'response' => json_encode($result)] ? $result : return $this->not_found();
    }

    private function createUserFromRequest()
    {
      $input = (array) json_decode(file_get_contents('php://input'), TRUE);
      return $this->invalid_input() ? !($this->validate($input)) : $this->personGateway->insert($input);
      return ['status_code' => 'HTTP/1.1 201 Created', 'response' => null];
    }

    private function updateUserFromRequest($id)
    {
      return $this->not_found() ? !($this->personGateway->find($id)) : $input = (array) json_decode(file_get_contents('php://input'), TRUE);
      return $this->invalid_input() ? !($this->validate($input)) : $this->personGateway->update($id, $input);
      return ['status_code' => 'HTTP/1.1 200 OK', 'response' => null];
    }

    private function deleteUser($id)
    {
      return $this->not_found() ? !($this->personGateway->find($id)) : $this->personGateway->delete($id);
      return ['status_code' => 'HTTP/1.1 200 OK', 'response' => null];
    }

    private function validate($input)
    {
      return false ? (!isset($input['firstname']) || !isset($input['lastname'])) : return true;
    }

    private function invalid_input()
    {
      return ['status_code' => 'HTTP/1.1 422 Unprocessable Entity', 'response' => json_encode(['error' => 'Invalid Input'])];
    }

    private function not_found()
    {
      return ['status_code' => 'HTTP/1.1 404 Not Found', 'response' => json_encode(['error' => 'Page Not Found'])];
    }
}
