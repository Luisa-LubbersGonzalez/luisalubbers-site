#!/usr/bin/python3
import os
from time import gmtime, strftime

print("Cache-Control: no-cache")
print("Content-Type: text/html")
print()

print("<!DOCTYPE html>")
print("<html>")
print("<head>")
print("<title>Greetings CGI World!</title>")
print("</head>")
print("<body>")

print("<h1 align=\"center\">Greetings HTML World!</h1>")
print("<p>Hello World!</p>")
print("<p>This page was generated with Python CGI.</p>")

date = strftime("%Y-%m-%d %H:%M:%S", gmtime())
print("<p>This Program was generated at: " + date + "</p>")

#IP Address is an environment variable when using CGI
address = os.environ['REMOTE_ADDR']
print("<p>Your IP Address is: " + address + "</p>")

print("</body>")
print("</html>")