#!/usr/bin/python3
import os
from time import gmtime, strftime
from os import environ
from json import dumps

print ("Cache-Control: no-cache")
print ("Content-Type: application/json")
print()

date = strftime("%Y-%m-%d %H:%M:%S", gmtime())
address = os.environ.get('REMOTE_ADDR')

message = {'title': 'Hello, Python!', 'heading': 'Hello, Python!', 'message': 'This page was generated with Python', 'time': date, 'IP': address}

json = dumps(message)
print(json)