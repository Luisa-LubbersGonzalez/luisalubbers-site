#!/usr/bin/php-cgi
<?php
Header("Cache-Control: no-cache");
Header("Content-Type: text/html");

echo"<!DOCTYPE html>";
echo"<html>";
echo"<head>";
echo"<title>Greetings CGI World!</title>";
echo"</head>";
echo"<body>";

echo"<h1 align=\"center\">Greetings HTML World!</h1>";
echo"<p>Hello World!</p>";
echo"<p>This page was generated with PHP CGI.</p>";

$date = date("m-d-Y H:i:s");
echo"<p>This Program was generated at: " . $date . "</p>";

$address = getenv('REMOTE_ADDR');
echo"<p>Your IP Address is: " . $address . "</p>";

echo"</body>";
echo"</html>";
?>