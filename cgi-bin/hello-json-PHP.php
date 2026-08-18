#!/usr/bin/php-cgi
<?php
Header("Cache-Control: no-cache");
header("Content-Type: application/json");

$date = date("m-d-Y H:i:s");
$address = $_SERVER['REMOTE_ADDR'];

$message = array('IP' => $address, 'title' => 'Hello, PHP!', 'message' => 'This page was generated with the PHP programming language', 'heading' => 'Hello, PHP!', 'time' => $date);

$json = json_encode($message);
echo $json;
?>