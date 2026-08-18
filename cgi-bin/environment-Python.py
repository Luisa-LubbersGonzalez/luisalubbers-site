#!/usr/bin/python3
from os import environ

print("Cache-Control: no-cache\n")
print("Content-type: text/html \n\n")

# print HTML file top
print("""<!DOCTYPE html>
<html><head><title>Environment Variables</title>
</head><body><h1 align="center">Environment Variables</h1>
<hr>""")

# Loop over the environment variables and print each variable and its value
for variable in sorted(environ):
    print(f"<b>{variable}:</b> {environ[variable]}<br />\n")

# Print the HTML file bottom
print("</body></html>")