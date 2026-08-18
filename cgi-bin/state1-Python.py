#!/usr/bin/python3
import os
import uuid
from http.cookies import SimpleCookie

# Read whatever cookie string the browser sent (empty string if none)
cookie_header = os.environ.get('HTTP_COOKIE', '')

# Parse it into a usable object
cookies = SimpleCookie()
cookies.load(cookie_header)

# Try to find our session cookie
if 'PYSESSID' in cookies:
    session_id = cookies['PYSESSID'].value
    new_session = False
else:
    session_id = str(uuid.uuid4())
    new_session = True

# Build the outgoing headers
print("Content-Type: text/html")
if new_session:
    print(f"Set-Cookie: PYSESSID={session_id}; Path=/")
print()  # blank line — REQUIRED to separate headers from body

print("<html><body>")
print(f"<p>Session ID: {session_id}</p>")
print(f"<p>New session? {new_session}</p>")
print("</body></html>")