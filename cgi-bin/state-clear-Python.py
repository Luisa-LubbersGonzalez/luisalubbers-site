#!/usr/bin/python3
import os
from http.cookies import SimpleCookie

cookie_header = os.environ.get('HTTP_COOKIE', '')
cookies = SimpleCookie()
cookies.load(cookie_header)

if 'PYSESSID' in cookies:
    session_id = cookies['PYSESSID'].value
    session_file = f"/tmp/pysession_{session_id}.txt"
    try:
        os.remove(session_file)
    except FileNotFoundError:
        pass

print("Cache-Control: no-cache")
print("Content-Type: text/html")
print("Set-Cookie: PYSESSID=; Path=/; Max-Age=0")
print()

print("<!DOCTYPE html>")
print("<html>")
print("<head>")
print("<title>Session Cleared</title>")
print("</head>")
print("<body>")
print("<h1>Session Cleared</h1>")

print("Your saved data has been removed.")

print("<br/>")
print("<a href=\"/cgi-bin/state1-Python.py\">Go to Page 1</a><br/>")
print("<a href=\"/cgi-bin/state2-Python.py\">Go to Page 2</a>")
print("</body>")
print("</html>")