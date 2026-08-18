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

current_username = ''
if 'PYSESSID' in cookies:
    session_id = cookies['PYSESSID'].value
    session_file = f"/tmp/pysession_{session_id}.txt"
    try:
        with open(session_file, 'r') as f:
            current_username = f.read()
    except FileNotFoundError:
        current_username = ''

print("<!DOCTYPE html><html><head><title>Python State - Page 2</title></head><body>")
print("<h1>Python State — Page 2</h1>")

if current_username:
    print(f"<p>Current username: {html.escape(current_username)}</p>")
else:
    print("<p>No name set yet.</p>")

print("<br/>")
print("<a href=\"/cgi-bin/state1-Python.py\">Go to Page 1</a><br/>")
print("<a href=\"/cgi-bin/state-clear-Python.py\">Clear Session</a>")
print("</body>")
print("</html>")