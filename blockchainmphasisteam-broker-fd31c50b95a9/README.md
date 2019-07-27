# Broker

BrokerAPI

# How to start broker API in multi node environment


## Prerequisites

> Claims network up and running. (Quorum network)

## cloning the repo

```
$ git clone https://mphasisblockchain@bitbucket.org/blockchainmphasisteam/broker.git

```

## Setup

```
$ cd broker

```

> NOTE : This will remove all the broker databases, deploy contracts and register mbroker.

```
$ initBrokerMultiNode.sh

```


> NOTE: Wait for contract deployment and broker registration. You can watch the logs for broker registration.


##Start broker API

```
$ node app.js

```