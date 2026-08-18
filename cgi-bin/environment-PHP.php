#!/usr/bin/php-cgi
<?php
Header("Cache-Control: no-cache");
Header("Content-Type: text/html");

echo"<!DOCTYPE html>";
echo"<html>";
echo"<head>";
echo"<title>Environment Variables</title>";
echo"</head>";
echo"<body>";
echo"<h1 align=\"center\">Environment Variables</h1>";
echo"<hr>";

foreach ($_SERVER as $variable => $value) {
  echo "<b>$variable:</b> $value<br />\n";
}

echo"</body>";
echo"</html>";
?>