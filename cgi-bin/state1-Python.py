#!/usr/bin/python3
import os
import sys
import uuid
import html
from http.cookies import SimpleCookie
from urllib.parse import parse_qs

print("Cache-Control: no-cache")
print("Content-Type: text/html; charset=utf-8")

cookie_header = os.environ.get('HTTP_COOKIE', '')
cookies = SimpleCookie()
cookies.load(cookie_header)

if 'PYSESSID' in cookies:
    session_id = cookies['PYSESSID'].value
    new_session = False
else:
    session_id = str(uuid.uuid4())
    new_session = True

session_file = f"/tmp/pysession_{session_id}.txt"

method = os.environ.get('REQUEST_METHOD', 'GET')
if method == 'POST':
    content_length = int(os.environ.get('CONTENT_LENGTH', 0))
    post_data = sys.stdin.read(content_length)
    parsed_data = parse_qs(post_data)
    if 'name' in parsed_data:
        with open(session_file, 'w') as f:
            f.write(parsed_data['name'][0])

try:
    with open(session_file, 'r') as f:
        current_name = f.read()
except FileNotFoundError:
    current_name = ''

if new_session:
    print(f"Set-Cookie: PYSESSID={session_id}; Path=/")
print()

print("<!DOCTYPEhtml>")
print("<html>")
print("<head>")
print("<title>Python State - Page 1</title>")
print("</head>")
print("<body>")

print("<h1 align=\center\">Python State — Page 1</h1>")

if current_name:
    print(f"<p><b>Name:</b> {html.escape(current_name)}</p>")
else:
    print("<p><b>Name:</b> You do not have a name set</p>")

print("<form method=\"POST\" action=\"/cgi-bin/state1-Python.py\">")
print("<label><b>Name:</b> <input type=\"text\" name=\"name\"></label>")
print("<button type=\"submit\">Save</button>")
print("</form>")
print("<br/>")
print("<a href=\"/cgi-bin/state2-Python.py\">Go to Page 2</a><br/>")
print("<a href=\"/cgi-bin/state-clear-Python.py\">Clear Session</a>")
print("</body>")
print("</html>")