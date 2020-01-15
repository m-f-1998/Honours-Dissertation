<?php
namespace src\table_gateways;

class PersonGateway {

    private $db = null;

    public function __construct($db)
    {
        $this->db = $db;
    }

    public function findAll()
    {
        $statement = "SELECT id, firstname, lastname, firstparent_id, secondparent_id FROM person;";
        try {
            $rows = array();
            while ($row = mysqli_query($this->db,$statement)->fetch_assoc())
            {
              array_push($rows, $row);
            }
            return json_encode($rows);
        } catch (Exception $e) {
            exit($e->getMessage());
        }
    }

    public function find($id)
    {
        $statement = "SELECT id, firstname, lastname, firstparent_id, secondparent_id FROM person WHERE id = ?;";
        try {
            $result = mysqli_prepare($this->db,$statement);
            mysqli_stmt_bind_param($result, "s", $id);
            mysqli_stmt_execute($result);

            $stmt_result = $result->get_result();
            $rows = array();
            while ($row = $stmt_result->fetch_assoc())
            {
              array_push($rows, $row);
            }
            return json_encode($rows);
        } catch (Exception $e) {
            exit($e->getMessage());
        }
    }

    public function insert(Array $input)
    {
        $statement = "INSERT INTO person (firstname, lastname, firstparent_id, secondparent_id) VALUES (?, ?, ?, ?);";

        try {
            $result = mysqli_prepare($this->db,$statement);
            mysqli_stmt_bind_param($result, "ssss", $input['firstname'], $input['lastname'], $input['firstparent_id'] ?? null, $input['secondparent_id'] ?? null);
            mysqli_stmt_execute($result);

            $stmt_result = $result->get_result();
            return mysqli_num_rows($stmt_result);
        } catch (Exception $e) {
            exit($e->getMessage());
        }
    }

    public function update($id, Array $input)
    {
        $statement = "UPDATE person SET firstname = ?, lastname  = ?, firstparent_id = ?, secondparent_id = ? WHERE id = ?;";

        try {
            $result = mysqli_prepare($this->db,$statement);
            mysqli_stmt_bind_param($result, "ssssi", $input['firstname'], $input['lastname'], $input['firstparent_id'] ?? null, $input['secondparent_id'] ?? null, (int) $id);
            mysqli_stmt_execute($result);

            $stmt_result = $result->get_result();
            return mysqli_num_rows($stmt_result);
        } catch (Exception $e) {
            exit($e->getMessage());
        }
    }

    public function delete($id)
    {
        $statement = "DELETE FROM person WHERE id = ?;";

        try {
            $result = mysqli_prepare($this->db,$statement);
            mysqli_stmt_bind_param($result, "i", (int) $id);
            mysqli_stmt_execute($result);

            $stmt_result = $result->get_result();
            return mysqli_num_rows($stmt_result);
        } catch (Exception $e) {
            exit($e->getMessage());
        }
    }
}
