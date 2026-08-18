#!/usr/bin/php-cgi
<?php
session_start();

Header("Cache-Control: no-cache");
Header("Content-Type: text/html");

$_SESSION = [];
session_destroy();
setcookie(session_name(), '', time() - 3600);

echo "<!DOCTYPE html>";
echo "<html><head><title>PHP State Demo - Session Cleared</title></head><body>";
echo "<h1>Session Cleared</h1>";
echo "<p>Your saved data has been removed.</p>";

echo "<br/>";
echo "<a href=\"/cgi-bin/state1-PHP.php\">Back to Page 1</a><br/>";
echo "<a href=\"/cgi-bin/state2-PHP.php\">Back to Page 2</a>";

echo "</body></html>";
?>