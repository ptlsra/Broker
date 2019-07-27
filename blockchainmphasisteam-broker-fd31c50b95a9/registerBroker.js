// required modules
var fs = require("fs");
var Web3 = require('web3-quorum');
var cors = require('cors');
var xhr = require('request');
var PDFDocument = require('pdfkit');

//for logging
var log4js = require('log4js');
var logger = log4js.getLogger('registerBroker.js');

// ipfs javascript http-client library
var ipfsAPI = require('ipfs-api');
// md5 for generating hash
var md5 = require('md5');

//mongod for local storage
// NOTE: install mongodb@2.2.33 
// do --> npm install mongodb@2.2.33 --save
var MongoClient = require('mongodb').MongoClient;
const abiDecoder = require('abi-decoder');
const express = require('express');
const app = express();

// express file upload library
const fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// setting cors option for app
app.use(cors());
app.use(fileUpload());
app.options("*",cors());

/**
 * read configuration from config file
 */
let configRawData = fs.readFileSync('./config.json');  
let configData = JSON.parse(configRawData);

var marshAddress = configData.brokerWalletAddress;
var brokerName =   configData.brokerName;
var appPort = configData.appPort;
var brokerWalletPassword = configData.brokerWalletPassword;
var ipfsUrl = configData.ipfsUrl;
logger.level = configData.logLevel;
var web3Url = configData.web3Url;
var mongoIp = configData.mongoIp;
var mongoPort = configData.mongoPort;
var appIp = configData.appIp;

//ipfs connection
var ipfs = ipfsAPI(ipfsUrl);

//integrating UI
var pathval=__dirname + "/UI/";
console.log(pathval);
app.set('views',pathval);


app.use(express.static(pathval));

// connecting to web3 provider
var web3 = new Web3(new Web3.providers.HttpProvider(web3Url));


//read contract addresses from contractsConfig.json
let rawdata = fs.readFileSync('./contractConfig.json');
let contractsData = JSON.parse(rawdata);
logger.debug(JSON.stringify(contractsData));

policyContractAddress = contractsData.policyContract;
insuranceContractAddress = contractsData.insuranceContract;
claimContractAddress = contractsData.claimContract;
hospitalContractAddress = contractsData.hospitalContract;

logger.debug(policyContractAddress);
logger.debug(insuranceContractAddress);
logger.debug(claimContractAddress);
logger.debug(hospitalContractAddress);

//reading abi from file

//Insurance.sol
var insuranceContractSource = fs.readFileSync("Insurance.json");
var insuranceContract = JSON.parse(insuranceContractSource)["contracts"];
var insuranceabi = JSON.parse(insuranceContract["Insurance.sol:Insurance"].abi);
const deployedInsuranceContract = web3.eth.contract(insuranceabi).at(String(insuranceContractAddress));



logger.info("registering broker");

var brokerName = "mbroker";
var brokerAddress = marshAddress;


var brokerObject = deployedInsuranceContract['getBroker'](brokerAddress);
var brokerNameTemp =  web3.toUtf8(brokerObject[1])

if(brokerNameTemp == ""){
    logger.info("broker not registered");
    logger.debug("brokerAddress : "+marshAddress);
    logger.debug("unlocking brokerAccount");
    web3.personal.unlockAccount(marshAddress, brokerWalletPassword);
    
    var txId = deployedInsuranceContract['registerBroker'](brokerAddress, brokerName, {
        from: brokerAddress,
        gas: 4000000
    });
    
    logger.debug("printing broker registration transaction id transaction id : " + txId);
    var brokerInfo = {
        brokerAddress: brokerAddress,
        brokerName: brokerName,
        txId: txId
    }
    
    logger.debug("brokerInfo : "+JSON.stringify(brokerInfo));
}else{
    logger.info("broker already registered");
}


