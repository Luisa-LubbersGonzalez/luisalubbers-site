#!/usr/bin/python3
import os
import html
import uuid
from http.cookies import SimpleCookie

print("Cache-Control: no-cache")
print("Content-Type: text/html; charset=utf-8")
print()

cookie_header = os.environ.get('HTTP_COOKIE', '')
cookies = SimpleCookie()
cookies.load(cookie_header)

current_name = ''
if 'PYSESSID' in cookies:
    session_id = cookies['PYSESSID'].value
    session_file = f"/tmp/pysession_{session_id}.txt"
    try:
        with open(session_file, 'r') as f:
            current_name = f.read()
    except FileNotFoundError:
        current_name = ''

print("<!DOCTYPE html>")
print("<html>")
print("<head>")
print("<title>Python State - Page 2</title>")
print("</head>")
print("<body>")
print("<h1>Python State — Page 2</h1>")

if current_name:
    print(f"<p><b>Name:</b> {html.escape(current_name)}</p>")
else:
    print("<p><b>Name:</b> You do not have a name set</p>")

print("<br/>")
print("<a href=\"/cgi-bin/state1-Python.py\">Go to Page 1</a><br/>")
print("<a href=\"/cgi-bin/state-clear-Python.py\">Clear Session</a>")
print("</body>")
print("</html>")