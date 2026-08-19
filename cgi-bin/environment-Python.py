#!/usr/bin/python3
from os import environ

print("Cache-Control: no-cache")
print("Content-Type: text/html")
print()

print("""<!DOCTYPE html>
<html><head><title>Environment Variables</title>
</head><body><h1 align="center">Environment Variables</h1>
<hr>""")

for variable in sorted(environ):
    print(f"<b>{variable}:</b> {environ[variable]}<br />")

print("</body></html>")