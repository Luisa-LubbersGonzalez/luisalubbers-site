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
$hostname = $_SERVER["SERVER_NAME"];
$datetime = date("Y-m-d H:i:s");
$userAgent = $_SERVER["HTTP_USER_AGENT"];
$ip = $_SERVER["REMOTE_ADDR"];

echo"Host name: " . $hostname . "<br>";

echo"Time & Date: " . $datetime . "<br>";

echo"UserAgent: " . $userAgent . "<br>";

echo"IP Address: " . $ip . "<br>";

echo"<p><b> Method used:</b> " . $method . "</p>";

echo"<p><b>Received data:</b></p>";
echo"<ul>";

if ($method == "GET") {
  foreach ($_GET as $key => $value) {
    echo "<li>" . htmlspecialchars($key) . " = " . htmlspecialchars($value) . "</li>";
  }
} elseif ($method == "POST") {
  if (strpos($contentType, 'application/json') !== false) {
    $rawBody = file_get_contents('php://input');
    $decoded = json_decode($rawBody, true);
    if (is_array($decoded)) {
      foreach ($decoded as $key => $value) {
        echo "<li>" . htmlspecialchars($key) . " = " . htmlspecialchars($value) . "</li>";
      }
    }
  } else {
    foreach ($_POST as $key => $value) {
      echo "<li>" . htmlspecialchars($key) . " = " . htmlspecialchars($value) . "</li>";
    }
  }
} elseif ($method =="PUT" || $method == "DELETE") {
  $rawBody = file_get_contents('php://input');
  $contentType = $_SERVER['CONTENT_TYPE'];
  if(strpos($contentType, 'application/json') !== false) {
    $decoded = json_decode($rawBody, true);
    if (is_array($decoded)) {
      foreach ($decoded as $key => $value) {
        echo "<li>" . htmlspecialchars($key) . " = " . htmlspecialchars($value) . "</li>";
      }
    } 
  } else {
    parse_str($rawBody, $put_vars);
    foreach ($put_vars as $key => $value) {
      echo "<li>" . htmlspecialchars($key) . " = " . htmlspecialchars($value) . "</li>";
    }
  }
}

echo"</ul>";

echo"</body>";
echo"</html>";
?>