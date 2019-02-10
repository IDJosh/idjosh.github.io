<?php
require('credentials.php');

function connectDB() {
	try {
		$conn = new PDO("mysql:host=$servername;dbname=oefening", $username ,$password);
		$conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
		echo "Connected succesfully";
	} catch (PDOException $e) {
		echo "Connection failed: " . $e->getMessage();
	}
}

function updateValueByOne($val) {
	connectDB();

	if ($val = "+") {

	} else if ("-") {

	} else {
	}

	$conn = null;
}
?>
