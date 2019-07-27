#!/bin/bash
# Script for single system setup

# takes main node ip as input
mainNodeIp=$1

hostname=$(ip route get 8.8.8.8 | awk '{print $NF; exit}')
mongoIp="localhost"
rpc="localhost"

node updateConfig $mainNodeIp 5001 $mongoIp 27017 5000 $rpc 22001
echo "config.js updated"

echo "dropping old databases"
node deleteDatabase.js

echo "deploying contracts"
node deployContracts.js

echo "registering broker"
node registerBroker.js

# start app.js
#echo "starting app.js"
#node app.js