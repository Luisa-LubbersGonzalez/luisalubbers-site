#!/usr/bin/python3
from time import gmtime, strftime
from os import environ
from json import dumps

print ("Cache-Control: no-cache")
print ("Content-Type: application/json")

date = strftime("%Y-%m-%d %H:%M:%S", gmtime())
address = os.environ.get('REMOTE_ADDR')

message = {'title': 'Hello, Python!', 'heading': 'Hello, Python!', 'message': 'This page was generated with the Python programming language', 'time': date, 'IP': address}

json = dumps(message)
print(json)