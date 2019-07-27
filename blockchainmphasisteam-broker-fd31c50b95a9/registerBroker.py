import urllib3
import json
import sys


http = urllib3.PoolManager()
url="http://"+str(ipAddress)+":5000/registerBroker?brokerName=MBroker"
r = http.request('GET', url);
response = r.data.decode("UTF-8");
print(response);