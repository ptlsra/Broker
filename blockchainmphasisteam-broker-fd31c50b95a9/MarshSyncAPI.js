#!/usr/bin/env node
console.log("Quorum API for Group Insurance");

/**
 * @file    MarshAPI version 0.1
 * @file    API for marsh to invoke and query smart contract. This api works with only quorum blockchain. Platform will be expanded later. :)
 */

// required modules
var fs = require("fs");
var Web3 = require('web3-quorum');
var cors = require('cors');
var xhr = require('request');
var PDFDocument = require('pdfkit');


//mongod for local storage
// NOTE: install mongodb@2.2.33 
// do --> npm install mongodb@2.2.33 --save

var MongoClient = require('mongodb').MongoClient;
const abiDecoder = require('abi-decoder');
const express = require('express');

// md5 for generating hash
var md5 = require('md5');
const app = express();

// express file upload library
const fileUpload = require('express-fileupload');

var bodyParser = require('body-parser');
app.use(bodyParser.json());

// setting cors option for app
app.use(cors());
app.use(fileUpload());
app.options("*",cors());

// ipfs javascript http-client library
var ipfsAPI = require('ipfs-api');

//ipfs connection
var ipfs = ipfsAPI('/ip4/127.0.0.1/tcp/5001');
console.log("Starting API ");

// connecting to web3 provider
//var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:22001"));
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:22001"));

// contracts


//read contract addresses from contractsConfig.json

let rawdata = fs.readFileSync('../contractConfig.json');  
let contractsData = JSON.parse(rawdata);
console.log(JSON.stringify(contractsData));

var policyContractAddress = contractsData.policyContract;
var insuranceContractAddress = contractsData.insuranceContract;
var claimContractAddress = contractsData.claimContract;
var hospitalContractAddress = contractsData.hospitalContract;

console.log(policyContractAddress);
console.log(insuranceContractAddress);
console.log(claimContractAddress);
console.log(hospitalContractAddress);


//reading abi from file

//Policy.sol
var policyContractSource = fs.readFileSync("./Policy.json");
var policyContract = JSON.parse(policyContractSource)["contracts"];
var policyabi = JSON.parse(policyContract["Policy.sol:Policy"].abi);
const deployedPolicyContract = web3.eth.contract(policyabi).at(String(policyContractAddress));

//Insurance.sol
var insuranceContractSource = fs.readFileSync("./Insurance.json");
var insuranceContract = JSON.parse(insuranceContractSource)["contracts"];
var insuranceabi = JSON.parse(insuranceContract["Insurance.sol:Insurance"].abi);
const deployedInsuranceContract = web3.eth.contract(insuranceabi).at(String(insuranceContractAddress));


//ClaimManagement.sol
var claimContractSource = fs.readFileSync("./ClaimManagement.json");
var claimContract = JSON.parse(claimContractSource)["contracts"];
var claimabi = JSON.parse(claimContract["ClaimManagement.sol:ClaimManagement"].abi);
const deployedClaimContract = web3.eth.contract(claimabi).at(String(claimContractAddress));



//Hospital.sol
var hospitalContractSource = fs.readFileSync("./Hospital.json");
var hospitalContract = JSON.parse(hospitalContractSource)["contracts"];
var hospitalabi = JSON.parse(hospitalContract["Hospital.sol:Hospital"].abi);
const deployedHospitalContract = web3.eth.contract(hospitalabi).at(String(hospitalContractAddress));

//marsh wallet address;


let configRawData = fs.readFileSync('./config.json');  
let configData = JSON.parse(configRawData);


//var marshAddress = "0x2e219248f44546d966808cdd20cb6c36df6efa82";
var marshAddress = configData.brokerWalletAddress;
//var brokerName =   "marsh";

//tpa wallet address;
var tpaAddress = "0x50bb02281de5f00cc1f1dd5a6692da3fa9b2d912";

//insurance wallet address;
var insuranceAddress = "0xcd5b17da5ad176905c12fc85ce43ec287ab55363";


// mongodb url for api's

var mongoUrl = "mongodb://127.0.0.1:27017/";
var claimListDBUrl = "mongodb://localhost:27017/claimlist_db";
var claimListDB;
MongoClient.connect(claimListDBUrl, function(err, claimListDBTemp) {
    claimListDB = claimListDBTemp;
});





function syncClaimList(){
 console.log("****************** sync claim list *********************");
 console.log("******************* get claim list for broker ********************");
    
 var claimListObject = deployedInsuranceContract['getBrokerClaims'](marshAddress);

 var claimList=[];
 for(var index = 0; index < claimListObject.length; index++){
     var claimId = claimListObject[index];
     var initialClaimObject = deployedClaimContract['getInitialClaimDetails'](claimId);
     console.log("printing initial claim details : "+initialClaimObject);
     var claimDetailsObject = deployedClaimContract['getClaimDetails'](claimId);
     var policyId = initialClaimObject[1];
     //get customerName and patientName
     var policyObject   = deployedPolicyContract['getPolicy'](policyId, marshAddress);
     var customerAddress = policyObject[1];
     var customerObject = deployedPolicyContract['getCustomerDetails'](customerAddress);
     var customerName = customerObject[1];
     var patientObject = deployedHospitalContract['getPatientDetails'](initialClaimObject[0]);
     var approverName = deployedInsuranceContract['getCompanyName'](initialClaimObject[6]);
     console.log("printing patientObject  : "+JSON.stringify(patientObject));
     var patientName = patientObject[2];

     var initialClaimDetails = {
         claimId:claimId.toNumber(),
         policyHolderName:customerName,
         patientName:patientName,
         claimStatus:web3.toUtf8(claimDetailsObject[0]),
         patientAddress:initialClaimObject[0],
         policyId:initialClaimObject[1].toNumber(),
         timestamp:initialClaimObject[2].toNumber(),
         claimEstimate:initialClaimObject[3].toNumber(),
         estimateDocument:web3.toUtf8(initialClaimObject[4])+web3.toUtf8(initialClaimObject[5]),
         initiallyApprovedBy:initialClaimObject[6],
         approverName:web3.toUtf8(approverName)
     }

      //push the object into mongodb 
      var query = {claimId:claimId.toNumber()};
      var obj = initialClaimDetails;
      claimListDB.collection("claimlist").update(query,obj,{upsert: true}, function(err,doc){
               if (err) throw err;
               console.log("Record inserted/updated ..");
      })
    }
}

//syncClaimList();
setInterval(function(){
    console.log("*************** starting syncClaimList **************");
    syncClaimList();
},10000);
