#!/usr/bin/python3
import os
import sys
import json
import html
from urllib.parse import parse_qs
from time import gmtime, strftime

print("Cache-Control: no-cache")
print("Content-Type: text/html")
print()

method = os.environ.get('REQUEST_METHOD', 'GET')
content_type = os.environ.get('CONTENT_TYPE', '')
hostname = os.environ.get('HTTP_HOST', 'localhost')
user_agent = os.environ.get('HTTP_USER_AGENT', 'Unknown')
ip = os.environ.get('REMOTE_ADDR', 'Unknown')

date = strftime("%Y-%m-%d %H:%M:%S", gmtime())

print("<!DOCTYPE html><html><head><title>Echoing</title></head><body>")
print('<h1 align="center">Echoing Endpoint</h1>')

print(f"Host name: {hostname}<br>")
print(f"Time & Date: {date}<br>")
print(f"UserAgent: {user_agent}<br>")
print(f"IP Address: {ip}<br>")

print(f"<p><b>Method used:</b> {method}</p>")

print("<p><b>Received data:</b></p><ul>")

if method == "GET":
    query_string = os.environ.get('QUERY_STRING', '')
    form_data = parse_qs(query_string)
    name = form_data.get('name', [''])[0]
    message = form_data.get('message', [''])[0]
elif method == "POST":
    content_length = int(os.environ.get('CONTENT_LENGTH', 0))
    post_data = sys.stdin.read(content_length)
    if 'application/json' in content_type:
        form_data = json.loads(post_data)
        name = form_data.get('name', '')
        message = form_data.get('message', '')
    else:
        form_data = parse_qs(post_data)
        name = form_data.get('name', [''])[0]
        message = form_data.get('message', [''])[0]
elif method == "PUT" or method == "DELETE":
    content_length = int(os.environ.get('CONTENT_LENGTH', 0))
    post_data = sys.stdin.read(content_length)
    if 'application/json' in content_type:
        form_data = json.loads(post_data)
        name = form_data.get('name', '')
        message = form_data.get('message', '')
    else:
        form_data = parse_qs(post_data)
        name = form_data.get('name', [''])[0]
        message = form_data.get('message', [''])[0]

print(f"<li>name = {html.escape(name)}</li>")
print(f"<li>message = {html.escape(message)}</li>")

print("</ul>");

print("</body></html>");