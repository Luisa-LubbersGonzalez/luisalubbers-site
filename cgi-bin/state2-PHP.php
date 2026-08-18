<?php
session_start();

Header("Cache-Control: no-cache");
Header("Content-Type: text/html");

$curr_username = $_SESSION['username'] ?? '';

echo "<!DOCTYPE html>";
echo "<html><head><title>PHP State Demo - Page 2</title></head><body>";
echo "<h1>PHP State — Page 2</h1>";

if ($curr_username) {
    echo "<p><b>Name:</b> " . htmlspecialchars($curr_username) . "</p>";
} else {
    echo "<p><b>Name:</b> You do not have a name set</p>";
}

echo "<br/>";
echo "<a href=\"/cgi-bin/state1-PHP.php\">Go to Page 1</a><br/>";
echo "<a href=\"/cgi-bin/state-clear-PHP.php\">Clear Session</a>";

echo "</body></html>";
?>