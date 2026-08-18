<?php
session_start();

Header("Cache-Control: no-cache");
Header("Content-Type: text/html");

$submitted = $_POST['username'] ?? '';
if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($submitted)) {
    $_SESSION['username'] = $submitted;
}

$curr_username = $_SESSION['username'] ?? '';

echo "<!DOCTYPE html>";
echo "<html><head><title>PHP State Demo - Page 1</title></head><body>";
echo "<h1>PHP State — Page 1</h1>";

if ($curr_username) {
    echo "<p><b>Name:</b> " . htmlspecialchars($curr_username) . "</p>";
} else {
    echo "<p><b>Name:</b> You do not have a name set</p>";
}

echo "<form method=\"POST\" action=\"/cgi-bin/state1-PHP.php\">";
echo "<label>Name: <input type=\"text\" name=\"username\"></label>";
echo "<button type=\"submit\">Save</button>";
echo "</form>";

echo "<br/>";
echo "<a href=\"/cgi-bin/state2-PHP.php\">Go to Page 2</a><br/>";
echo "<a href=\"/cgi-bin/state-clear-PHP.php\">Clear Session</a>";

echo "</body></html>";
?>