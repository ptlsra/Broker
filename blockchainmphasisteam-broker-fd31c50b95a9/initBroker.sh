#!/bin/bash

#ipAddress=$(ip route get 8.8.8.8 | awk '{print $NF; exit}')
echo "Starting broker API"
#ipAddress=$(ip route get 8.8.8.8 | awk '{print $7; exit}')
ipAddress=$SYSTEM_IP
#ipAddress="localhost"
echo $ipAddress
#node updateConfig.js $1 $2 $3 $4 $5 $6 $7
#node updateConfig 127.0.0.1 5001 $ipAddress 27017 5000 $ipAddress 22002
node updateConfig $ipAddress 5001 $ipAddress 27017 5000 $ipAddress 22002 |& tee -a /api-logs/broker-api.log

echo "config.js updated"


if [ -f "/data/contractConfig.json" ]
then
    echo "contractConfig.json found."
        
    echo "copying contractConfig.json to : `${pwd}`"
    cp /data/contractConfig.json .

    #register broker
    node registerBroker.js |& tee -a /api-logs/broker-api.log

    #Start API
    echo "Starting API"
    node app.js |& tee -a /api-logs/broker-api.log
else
    echo "contractConfig.json not found."
    node deployContracts.js |& tee -a /api-logs/broker-api.log
    echo "contracts deployed"

    echo "dropping old databases"
    node deleteDatabase.js |& tee -a /api-logs/broker-api.log

    #register broker
    node registerBroker.js |& tee -a /api-logs/broker-api.log

    #Copy contractConfig.json to the /data directory
    cp contractConfig.json /data/

    #Start API
    echo "Starting API"
    node app.js |& tee -a /api-logs/broker-api.log
fi
