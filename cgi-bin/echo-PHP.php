#!/usr/bin/php-cgi
<?php
Header("Cache-Control: no-cache");
Header("Content-Type: text/html");

$method = $_SERVER['REQUEST_METHOD'];

echo"<!DOCTYPE html>";
echo"<html>";
echo"<head>";
echo"<title>Echoing</title>";
echo"</head>";
echo"<body>";
echo"<h1 align=\"center\">Echoing Endpoint</h1>";
echo"<p><b> Method used:</b> " . $method . "</p>";

foreach ($_SERVER as $variable => $value) {
  echo "<b>$variable:</b> $value<br />\n";
}

echo"</body>";
echo"</html>";
?>