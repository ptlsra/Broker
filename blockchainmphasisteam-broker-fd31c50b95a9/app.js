#!/usr/bin/env node

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
var morganLogger = require('morgan');

//for logging
var log4js = require('log4js');
var logger = log4js.getLogger('app.js');

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
app.use(morganLogger('dev'));
// setting cors option for app
app.use(cors());
app.use(fileUpload());
app.options("*", cors());

/**
 * read configuration from config file
 */
let configRawData = fs.readFileSync('./config.json');
let configData = JSON.parse(configRawData);

var marshAddress = configData.brokerWalletAddress;
var brokerName = configData.brokerName;
var appPort = configData.appPort;
var brokerWalletPassword = configData.brokerWalletPassword;
var ipfsUrl = configData.ipfsUrl;
logger.level = configData.logLevel;
var web3Url = configData.web3Url;
var mongoIp = configData.mongoIp;
var mongoPort = configData.mongoPort;
var appIp = configData.appIp;
var ipfsIpAddress = configData.ipfsIp;

//ipfs connection
var ipfs = ipfsAPI(ipfsUrl);

//integrating UI
var pathval = __dirname + "/UI/";
console.log(pathval);
app.set('views', pathval);


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

//Policy.sol
var policyContractSource = fs.readFileSync("Policy.json");
var policyContract = JSON.parse(policyContractSource)["contracts"];
var policyabi = JSON.parse(policyContract["Policy.sol:Policy"].abi);
const deployedPolicyContract = web3.eth.contract(policyabi).at(String(policyContractAddress));

//Insurance.sol
var insuranceContractSource = fs.readFileSync("Insurance.json");
var insuranceContract = JSON.parse(insuranceContractSource)["contracts"];
var insuranceabi = JSON.parse(insuranceContract["Insurance.sol:Insurance"].abi);
const deployedInsuranceContract = web3.eth.contract(insuranceabi).at(String(insuranceContractAddress));


//ClaimManagement.sol
var claimContractSource = fs.readFileSync("ClaimManagement.json");
var claimContract = JSON.parse(claimContractSource)["contracts"];
var claimabi = JSON.parse(claimContract["ClaimManagement.sol:ClaimManagement"].abi);
const deployedClaimContract = web3.eth.contract(claimabi).at(String(claimContractAddress));


//Hospital.sol
var hospitalContractSource = fs.readFileSync("Hospital.json");
var hospitalContract = JSON.parse(hospitalContractSource)["contracts"];
var hospitalabi = JSON.parse(hospitalContract["Hospital.sol:Hospital"].abi);
const deployedHospitalContract = web3.eth.contract(hospitalabi).at(String(hospitalContractAddress));



// mongodb url for api's

var mongoUrl = "mongodb://" + mongoIp + ":" + mongoPort + "/";
logger.debug("mongoUrl : " + mongoUrl);
var statsUrl = mongoUrl + "mbroker";
var policyRequesturl = mongoUrl + brokerName + "_policy_request";
var policyRequestDB;

MongoClient.connect(policyRequesturl, function (err, policyRequestTempDB) {
    policyRequestDB = policyRequestTempDB;
});

var claimListDBUrl = "mongodb://" + mongoIp + ":" + mongoPort + "/broker_claimlist_db";
var claimListDB;
MongoClient.connect(claimListDBUrl, function (err, claimListDBTemp) {
    claimListDB = claimListDBTemp;
});




/**
 * 
 * Establish connection for statistics
 * 
 */
var statsDB;
MongoClient.connect(statsUrl, function (err, db) {
    if (err) throw err;
    statsDB = db;
});

var statsDB2;
var statsDBUrl2 = mongoUrl + brokerName + "_policy_request";

MongoClient.connect(statsDBUrl2, function (err, db) {
    if (err) throw err;
    statsDB2 = db;
});



var brokerUrl = mongoUrl + brokerName;
var brokerDB;
MongoClient.connect(brokerUrl, function (err, brokerDBTemp) {
    if (err) throw err;
    brokerDB = brokerDBTemp;
});


var brokerPolicyReqUrl = mongoUrl + brokerName + "_policy_request";
var brokerPolicyReqDB;
MongoClient.connect(brokerPolicyReqUrl, function (err, brokerPolicyReqTempDB) {
    if (err) throw err;
    brokerPolicyReqDB = brokerPolicyReqTempDB;
});


var brokerPolicyReqDependentsUrl = mongoUrl + brokerName + "_policy_request_dependents";
var brokerPolicyReqDependentsDB;
MongoClient.connect(brokerPolicyReqDependentsUrl, function (err, brokerPolicyReqDependentsTempDB) {
    if (err) throw err;
    brokerPolicyReqDependentsDB = brokerPolicyReqDependentsTempDB;
});


var brokerCustomerTxnsURL = mongoUrl + brokerName + "_customer_txns";
var brokerCustomerTxnsDB;
MongoClient.connect(brokerCustomerTxnsURL, function (err, brokerCustomerTxnsTempDB) {
    if (err) throw err;
    brokerCustomerTxnsDB = brokerCustomerTxnsTempDB;
});

var brokerTxnsUrl = mongoUrl + brokerName + "_txns";
var brokerTxnsDB;
MongoClient.connect(brokerTxnsUrl, function (err, brokerTxnsTempDB) {
    if (err) throw err;
    brokerTxnsDB = brokerTxnsTempDB;
});

var brokerUrl = mongoUrl + brokerName;
var brokerDB;
MongoClient.connect(brokerUrl, function (err, brokerTempDB) {
    if (err) throw err;
    brokerDB = brokerTempDB;
});





//************************************************* Events ************************************************** */

/**
 * Registration Event.
 * @event
 */
var registrationEvent;
registrationEvent = deployedPolicyContract.RegisterCustomer({}, {
    fromBlock: 'latest',
    toBlock: 'latest'
});
//logger.debug(myEvent);
registrationEvent.watch(function (error, result) {
    logger.debug("*************** Register Customer Event ***************");
    logger.debug(result);
    logger.debug("*********** prints args of result **********");
    logger.debug(result);
    var args = result.args;
    storeCustomerTransaction(args.userName, result.transactionHash, args.description, args.customerAddress);
    logger.debug("transaction sent to db");
});


/**
 * Policy Creation Event.
 * @event
 */
var policyCreationEvent;
policyCreationEvent = deployedPolicyContract.CreatePolicy({}, {
    fromBlock: 'latest',
    toBlock: 'latest'
});
//logger.debug(myEvent);
policyCreationEvent.watch(function (error, result) {
    logger.debug("*************** Policy Creation Event ***************");
    logger.debug(result);
    logger.debug("*********** prints args of result **********");
    logger.debug(result);
    var args = result.args;

    logger.debug("displaying loanId in number " + args.policyId);
    logger.debug(args.policyId.toNumber());

    storeCustomerTransaction(args.userName, result.transactionHash, args.description, args.customerAddress, args.policyId.toNumber());
    logger.debug("transaction sent to db");
});

/**
 * Adding Dependent Event.
 * @event
 */
var addDependentEvent;
addDependentEvent = deployedPolicyContract.AddDependent({}, {
    fromBlock: 'latest',
    toBlock: 'latest'
});
//logger.debug(myEvent);
addDependentEvent.watch(function (error, result) {
    logger.debug("*************** Add Dependent  Event ***************");
    logger.debug(result);
    logger.debug("*************** prints args of result ***************");
    logger.debug(result);
    var args = result.args;

    logger.debug("displaying loanId in number " + args.policyId);
    logger.debug(args.policyId.toNumber());

    storeCustomerTransaction(args.userName, result.transactionHash, args.description, args.customerAddress, args.policyId.toNumber());
    logger.debug("transaction sent to db");
});

/**
 * Register broker event
 * @event
 * 
 */

var registerBroker;

registerBroker = deployedInsuranceContract.RegisterBroker({}, {
    fromBlock: 'latest',
    toBlock: 'latest'
});
registerBroker.watch(function (error, result) {
    logger.debug("****************** register broker event *********************");
    logger.debug(result);

    logger.debug("printing arguments : " + result.args);
    var args = result.args;
    storeBrokerTransaction("marsh", result.transactionHash, args.description, "");
    logger.debug("transaction sent to db");
});

/**
 * SetPolicyOwner Event
 * @event
 * 
 */

var setPolicyOwner;

setPolicyOwner = deployedInsuranceContract.SetPolicyOwners({}, {
    fromBlock: 'latest',
    toBlock: 'latest'
});
setPolicyOwner.watch(function (error, result) {
    logger.debug("******************  set policy owner event *********************");
    logger.debug(result);
    logger.debug("printing arguments : " + result.args);
    var args = result.args;
    storeBrokerTransaction("marsh", result.transactionHash, args.description, args.policyId.toNumber());
    logger.debug("transaction sent to db");
});


/**
 * 
 * AcceptClaim event
 * @event
 * 
 */

var acceptClaim;

acceptClaim = deployedClaimContract.InitialClaimApproval({}, {
    fromBlock: 'latest',
    toBlock: 'latest'
});
acceptClaim.watch(function (error, result) {
    logger.debug("******************  Accept Claim Event *********************");
    logger.debug(result);
    logger.debug("printing arguments : " + result.args);
    var args = result.args;
    storeBrokerTransaction("marsh", result.transactionHash, args.description, "");
    //updateApproverInfo(result.args.claimId);
    logger.debug("transaction sent to db");
});


/**
 * 
 * Initial claim event
 * @event
 * 
 */
var initialClaim = deployedClaimContract.InitialClaimEvent({}, {
    fromBlock: 'latest',
    toBlock: 'latest'
});
initialClaim.watch(function (error, result) {
    logger.info("initial claim event");
    logger.debug("printing arguments : " + result.args);
    insertClaimRecord(result.args.claimId);
});


/**
 * 
 * FinalClaimApprove event
 * @event
 * 
 */

var finalClaimApproval;
finalClaimApproval = deployedClaimContract.FinalClaimApproval({}, {
    fromBlock: 'latest',
    toBlock: 'latest'
});
finalClaimApproval.watch(function (error, result) {
    logger.debug("****************** Final Claim Approval Event *********************");
    logger.debug(result);
    logger.debug("printing arguments : " + result.args);
    var args = result.args;
    storeBrokerTransaction("marsh", result.transactionHash, args.description, "");
    logger.debug("transaction sent to db");
});

/**
 * 
 * UpdateClaimStatus
 * @event
 * 
 */
var updateClaimStatus;
updateClaimStatus = deployedClaimContract.UpdateClaimStatus({}, {
    fromBlock: 'latest',
    toBlock: 'latest'
});
updateClaimStatus.watch(function (error, result) {
    logger.info("updateClaimStatus");
    logger.debug("result : " + result);
    updateClaimRecord(result.args.claimId, result.args.claimStatus);
});

/**
 * UploadEstimateDocument
 * @event
 */
uploadEstimateDocument = deployedClaimContract.UploadEstimateDocument({}, {
    fromBlock: 'latest',
    toBlock: 'latest'
});

uploadEstimateDocument.watch(function (error, result) {
    logger.info("uploadEstimateDocument");
    logger.debug("result : " + result);
    //new method to update claimlist_db
    //Just update estimateDocument key in the record
    //search the record by claimid
    updateEstimateDocument(result.args.claimId);
});




//*************************************************** API Starts here *****************************************************/

/**
 * API to register/enroll   customer
 * 
 * @function                registerCustomer
 * @param     {string}      customerName            - customer/policyHolder name
 * @param     {string}      userName                - username of the customer
 * @param     {string}      password                - password of the customer
 * @param     {string}      scheme                  - scheme chosen by the customer
 * @param     {number}      sumInsured              - sumInsured by the customer
 * @param     {string}      emailId                 - emailId of the customer
 * @param     {string}      tenure                  - tenure in years
 * @param     {string}      dob                     - date of birth of customer
 * @returns   {JSONObject}  
 */

app.post('/registerCustomer', function (request, response) {
    logger.info("registerCustomer");
    var customerName = request.query.customerName;
    var userName = request.query.userName;
    var password = request.query.password;
    var emailId = request.query.emailId;
    var dob = request.query.dob;


    logger.debug("customerName : " + customerName);
    logger.debug("userName : " + userName);
    logger.debug("password : " + password);
    logger.debug("emailId : " + emailId);
    logger.debug("dob : " + dob);

    var scheme = "";
    var sumInsured = 0;
    var tenure = "";

    //create wallet for customer
    var walletResponse = web3.personal.newAccount("");
    var walletAddress = walletResponse;
    web3.personal.unlockAccount(walletAddress, "");
    logger.debug("marshaddress : " + marshAddress);
    web3.personal.unlockAccount(marshAddress, brokerWalletPassword);
    //sending some ether to customer's wallet
    web3.eth.sendTransaction({
        from: marshAddress,
        to: walletAddress,
        value: 70000000000
    });
    try {
        let promiseA = new Promise((resolve, reject) => {
            let wait = setTimeout(() => {
                var jsonResponse = (deployedPolicyContract['registerCustomer'](walletAddress, customerName, userName, 0, "", {
                    from: marshAddress,
                    gas: 4000000
                }));

                var message = {
                    "walletAddress": walletAddress,
                    "txId": jsonResponse
                }

                response.setHeader('Content-Type', 'application/json');
                response.send(message);
            }, 10000)
        });

        //save details to mongodb 
        logger.debug("***************** store customer details to database *******************");
        logger.debug("************ connected to mongodb client at localhost *************");
        logger.debug("************ storing record **********");
        var myobj = {
            customerName: customerName,
            userName: userName,
            password: password,
            emailId: emailId,
            dob: dob,
            walletAddress: walletAddress
        };

        var collectionName = userName;
        brokerDB.collection(collectionName).insertOne(myobj, function (err, res) {
            if (err) throw err;
            logger.debug("Customer record inserted ....");
            //logger.debug(res);
        });
    } catch (e) {
        logger.fatal("ERROR : " + e);
    }
});


/**
 * API to get customer/policy holder details
 * 
 * @function                    getCustomerDetails
 * @param       {string}        customerAddress      -   wallet address of the customer
 * @returns     {JSONObject}    customerDetails      -   customerAddress, customerName, userName, sumInsured, tenure
 */
app.get('/getCustomerDetails', function (request, response) {
    logger.debug("**************************** get customer details *********************************");

    var customerAddress = request.query.customerAddress;
    logger.debug("printing customer address : " + customerAddress);

    var customerObject = deployedPolicyContract['getCustomerDetails'](customerAddress);

    logger.debug("printing customer Object : " + customerObject);

    var userName = customerObject[2];

    try {
        brokerDB.collection(userName).find().toArray(function (err, userObject) {
            if (err) throw err;
            logger.debug(userObject);
            var customerDetails = {
                "customerAddress": customerObject[0],
                "customerName": customerObject[1],
                "username": customerObject[2],
                "sumInsured": customerObject[3],
                "tenure": customerObject[4],
                "emailId": customerObject[2],
                "scheme": customerObject[5],
                "dob": userObject[0].dob
            }
            response.send(customerDetails);
        });
    } catch (Exception) {
        logger.debug("error in fetching data");
    }
});

/**
 * API to check credentials of customer
 * 
 * @function                checkCredentials
 * @param       {string}    userName                -  userName of the customer
 * @param       {string}    password                -  password of the customer
 * 
 * @returns     {boolean}   status                  -  true if credentials match else false
 */
app.get('/checkCredentials', function (request, response) {
    logger.debug("check credentials");
    var userName = request.query.userName;
    var password = request.query.password;

    brokerDB.collection(userName).find().toArray(function (err, userObject) {
        if (err) throw err;

        logger.debug(userObject);
        var value = false;
        var customerDetails = {};
        try {
            if (userObject[0].password == password) {
                value = true;
                customerDetails = {
                    customerName: userObject[0].customerName,
                    userName: userObject[0].userName,
                    walletAddress: userObject[0].walletAddress
                }
            }

            var status = {
                customerDetails: customerDetails,
                status: value
            }
            return response.send(status);
        } catch (Exception) {
            logger.debug("error in checking credentials ");
            var status = {
                customerDetails: '',
                status: false
            }
            return response.send(status);
        }
    });
});

/**
 * 
 * API for applying for insurance
 * 
 * @function                        applyForInsurance
 * 
 * @param           {string}        customerName
 * @param           {string}        customerAddress
 * @param           {string}        userName
 * @param           {number}        number
 * @param           [string]        dependents              
 * 
 */
app.post('/applyForPolicy', function (request, response) {
    var customerName = request.query.customerName;
    var customerAddress = request.query.customerAddress;
    var userName = request.query.userName;
    var policyValidity = request.query.policyValidity;
    var sumInsured = request.query.sumInsured;
    var tenure = request.query.tenure;
    var scheme = request.query.scheme;

    var isError = false;

    if (isNaN(sumInsured)) {
        console.log(new Error("sumInsured is not a number"));
        isError = true;
    }


    if (isError == false) {
        try {
            logger.debug("customerName : " + customerName);
            logger.debug("customerAddress : " + customerAddress);
            logger.debug("userName : " + userName);
            logger.debug("policyValidity : " + policyValidity);
            logger.debug("printing sum insured : " + sumInsured);
            logger.debug("printing tenure " + tenure);
            logger.debug("printing scheme  : " + scheme);
            //var dependents      = request.query.dependents;
            //logger.debug("printing dependents list : ");
            //store it into database
            logger.debug("************ connected to mongodb client at localhost *************");
            logger.debug("********** storing record **********");
            //var myobj = { transactionId: tx_id, dateTime: date_time, description: description, customerName: customerName, policyId: policyId};
            var requestId = getRandomInt(1000, 1000000);
            var unixTimeStamp = Math.round((new Date()).getTime() / 1000);
            var emptyDependents = {};
            var myObj = {
                requestId: requestId,
                customerName: customerName,
                customerAddress: customerAddress,
                userName: userName,
                policyValidity: policyValidity,
                requestTimeStamp: unixTimeStamp,
                status: "notApproved",
                sumInsured: sumInsured,
                tenure: tenure,
                scheme: scheme
            };
            var collectionName = userName + "policyRequest";
            brokerPolicyReqDB.collection(collectionName).insertOne(myObj, function (err, res) {
                if (err) throw err;
                logger.debug("policy request stored...");
                //return requestId;

                logger.debug("request id is : " + requestId);
                var jsonResponse = {
                    "message": "requestSubmitted",
                    "requestId": requestId
                }

                response.send(jsonResponse);
            });
        } catch (e) {
            logger.error("Error : " + e);
        }
    }else{
        
        response.send({
            "error":"Error in applyForPolicy"
        });
    }
});


/**
 * API to create policy
 * 
 * @function                createPolicy
 * @param     {string}      customerAddress            - customer/policyHolder name
 * @param     {number}      policyValidity             - unix timestamp
 * @param     {file}        policyDocument             - policy document in pdf format generated at marsh
 * 
 * @returns   {JSONObject}  txId
 */
app.post('/createPolicy', function (request, response) {
    logger.debug("************************** create customer policy ******************************");

    try {

        var userName = request.query.userName;
        var requestId = request.query.requestId;
        var customerAddress = request.query.customerAddress;
        var policyValidity = request.query.policyValidity; //unix timestamp
        var insuranceAddress = request.query.insuranceAddress;
        var tpaAddress = request.query.tpaAddress;
        var sumInsured = request.query.sumInsured;
        var tenure = request.query.tenure;
        var scheme = request.query.scheme;

        var isError = false;

        if (isNaN(sumInsured)) {
            console.log(new Error("sumInsured is not a number"));
            isError = true;
        }

        if (isError == false) {

            // get dependents list
            // call contract to add dependent list
            // get tpa and insurance address
            // set policyOwners
            logger.debug("printing customerAddress : " + customerAddress);
            web3.personal.unlockAccount(customerAddress, "");
            logger.debug("customer account unlocked");
            web3.personal.unlockAccount(marshAddress, brokerWalletPassword);
            var transactionId = deployedPolicyContract['createPolicy'](marshAddress, customerAddress, policyValidity, {
                from: String(customerAddress),
                gas: 4000000
            });
            logger.debug("printing transaction id : " + transactionId);

            //add sumInsured and tenure
            var updateTxId = deployedPolicyContract['updateTenureAndSumInsured'](customerAddress, sumInsured, tenure, scheme, {
                from: String(customerAddress),
                gas: 4000000
            });

            //wait for 10 seconds for transaction to be mined
            let promiseA = new Promise((resolve, reject) => {
                let wait = setTimeout(() => {

                    //get policyId of the customer
                    var customerPoliciesObject = deployedPolicyContract['getCustomerPolicies'](customerAddress);
                    logger.debug("printing customer policies : " + JSON.stringify(customerPoliciesObject));
                    var length = customerPoliciesObject[1].length;
                    var policyId = customerPoliciesObject[1][length - 1];

                    //create policyDocument
                    logger.debug("policyId is : " + policyId);
                    //createPolicyDocument(policyId,[],1517218109);

                    // add dependents first

                    var collectionsName = userName + "_dependents";
                    var query = {
                        requestId: requestId
                    };
                    logger.debug("printing userName  : " + userName);
                    logger.debug("printing requestId : " + requestId);
                    brokerPolicyReqDependentsDB.collection(collectionsName).find(query).toArray(function (err, dependentList) {
                        if (err) throw err;
                        logger.debug("printing dependents length : " + dependentList.length);
                        logger.debug(JSON.stringify(dependentList));

                        for (var index = 0; index < dependentList.length; index++) {
                            logger.debug("printing loop index : " + index);

                            var dependent = dependentList[index];
                            logger.debug("printing depedendents at index " + index + " details : " + JSON.stringify(dependent));

                            var txId = deployedPolicyContract['addDependents'](policyId, dependent.dependentName, dependent.age, dependent.gender, dependent.relation, {
                                from: String(customerAddress),
                                gas: 4000000
                            });

                        }
                        logger.debug("dependents   Added");

                        //create document here
                        createPolicyDocument(policyId, dependentList, policyValidity, customerAddress);


                    });
                    //set policy Owners for policyId

                    logger.debug("printing insuranceAddress : " + insuranceAddress);
                    logger.debug("printing tpaAddress : " + tpaAddress);

                    var txId = deployedInsuranceContract['setPolicyOwners'](policyId, marshAddress, insuranceAddress, tpaAddress, {
                        from: marshAddress,
                        gas: 400000
                    });
                    logger.debug("policy owners has been set");

                    // var contents = fs.readFileSync('policies/'+policyId+'.pdf');
                    let promiseA = new Promise((resolve, reject) => {
                        let wait = setTimeout(() => {
                            fs.readFile('policies/policyDocument_' + policyId + '.pdf', function (err, buf) {
                                logger.debug("contents : " + buf);
                                //upload document to ipfs
                                //prepare files array (contains name and file buffer of document)

                                const files = [{
                                    path: "policyDocument_" + policyId + ".pdf",
                                    content: buf
                                },]
                                ipfs.files.add(files, (err, filesAdded) => {

                                    logger.debug(filesAdded);
                                    logger.debug("printing policyDocument hash : " + filesAdded[0].hash);
                                    var policyDocHash = filesAdded[0].hash;

                                    var documentHashFirstSlice = policyDocHash.slice(0, 26);
                                    var documentHashSecondSlice = policyDocHash.slice(26, policyDocHash.length);

                                    logger.debug("hash first slice " + documentHashFirstSlice);
                                    logger.debug("hash second sclice " + documentHashSecondSlice);

                                    //uploading policy document
                                    var uploadTxid = deployedPolicyContract['uploadPolicyDocument'](policyId, documentHashFirstSlice, documentHashSecondSlice, {
                                        from: marshAddress,
                                        gas: 400000
                                    });

                                    logger.debug("printing upload transaction id : " + uploadTxid);
                                    logger.debug("printing policyId : " + policyId);
                                    logger.debug("policy created :)");
                                    var jsonResponse = {
                                        policyId: policyId,
                                        txId: transactionId
                                    }

                                    //update request of the customer
                                    var collectionsName_1 = userName + "policyRequest";
                                    var parsedRequestId = parseInt(requestId);
                                    var previousValue = {
                                        requestId: parseInt(parsedRequestId)
                                    };
                                    var newValue = {
                                        $set: {
                                            status: "Approved"
                                        }
                                    };
                                    var collectionsName =
                                        brokerPolicyReqDB.collection(collectionsName_1).updateOne(previousValue, newValue, function (err, result) {
                                            if (err) throw err;
                                            //logger.debug(result);
                                            logger.debug("********************** updated customer request record **********************");
                                        });
                                    logger.debug("*********************** requestId updated **********************");
                                    response.send(jsonResponse);
                                });
                            });
                        }, 4000);
                    });
                }, 10000);
            });
        }else{
        
            response.send({
                "error":"Error in createPolicy"
            });
        }
    } catch (e) {
        logger.error("ERROR : " + e);
    }

});


/**
 * API to set policy owners for a policy
 * 
 * @function                    setPolicyOwners
 * 
 * @param       {number}        policyId            -   policyId of the customer
 * @param       {string}        insuranceAddress    -   insurance address given by marsh
 * @param       {string}        tpaAddress          -   tpa address given by marsh
 * 
 * @returns     {JSONObject}    txId                -   transaction id
 */

app.post('/setPolicyOwners', function (request, response) {
    logger.info("setPolicyOwners");
    var policyId = request.query.policyId;
    var insuranceAddress = request.query.insuranceAddress;
    var tpaAddress = request.query.tpaAddress;

    var isError = false;

    if (isNaN(policyId)) {
        console.log(new Error("policyId is not a number"));
        isError = true;
    }

    if (isError == false) {

        try {
            logger.debug("********************** set policy owners ************************");
            web3.personal.unlockAccount(marshAddress, brokerWalletPassword);
            var txId = deployedInsuranceContract['setPolicyOwners'](policyId, marshAddress, insuranceAddress, tpaAddress, {
                from: marshAddress,
                gas: 400000
            });
            var jsonResponse = {
                txId: txId
            }
            response.send(jsonResponse);
        } catch (e) {
            logger.error("ERROR : " + e);
        }
    }else{
        
        response.send({
            "error":"Error in setPolicyOwners"
        });
    }
});



/**
 * API to get customer Policy Details
 * 
 * @function                    getPolicyDetails
 * @param       {number}        policyId            -   policyId of the customer
 * @returns     {JSONObject}    policyDetails       -   returns policyDetails
 */
app.get('/getPolicyDetails', function (request, response) {

    try {
        var policyId = request.query.policyId;

        var isError = false;

        if (isNaN(policyId)) {
            console.log(new Error("policyId is not a number"));
            isError = true;
        }

        if (isError == false) {

            logger.debug("********************* get customerPolicyDetails ***************************");
            var policyObject = deployedPolicyContract['getPolicy'](policyId, marshAddress);
            logger.debug("printing policyObject : " + policyObject);
            var policyOwnerStatus = deployedInsuranceContract['getPolicyOwnersStatus'](policyId);
            var policyOwners = deployedInsuranceContract['getPolicyOwners'](policyId);

            //get names of policyOwners
            var brokerName = web3.toUtf8(deployedInsuranceContract['getCompanyName'](policyOwners[2]));
            var insuranceName = web3.toUtf8(deployedInsuranceContract['getCompanyName'](policyOwners[0]));
            var tpaName = web3.toUtf8(deployedInsuranceContract['getCompanyName'](policyOwners[1]));

            var policyProviderObject = {
                brokerAddress: policyOwners[2],
                brokerName: brokerName,
                insuranceAddress: policyOwners[0],
                insuranceName: insuranceName,
                tpaAddress: policyOwners[1],
                tpaName: tpaName
            }

            var policyDetails = {
                policyId: policyId,
                policyProviderAddress: policyObject[0],
                customerAddress: policyObject[1],
                policyValidity: policyObject[2],
                policyDocumentHash: web3.toUtf8(policyObject[3]) + web3.toUtf8(policyObject[4]),
                timeStamp: policyObject[5],
                policyOwnerStatus: policyOwnerStatus,
                insuranceProvider: policyOwners[2],
                policyProviders: policyProviderObject
            }

            response.send(policyDetails);

        }else{
        
            response.send({
                "error":"Error in getPolicyDetails"
            });
        }
    } catch (e) {
        logger.error("ERROR : " + e);
    }

});




/**
 * API to get policy Request Status of a customer 
 * @function  getPolicyRequestStatus
 * 
 * @returns     {JSONArray}            requestList
 * 
 */
app.get('/getPolicyRequestStatus', function (request, response) {
    var userName = request.query.userName;

    var collectionsName = userName + "policyRequest";
    logger.debug("printing collections name " + collectionsName);

    brokerPolicyReqDB.collection(collectionsName).find().toArray(function (err, requestList) {
        if (err) throw err;
        logger.debug(requestList);
        db.close();
        return response.send(requestList.reverse());
    });
});



/**
 * API to add dependent to policy
 * 
 * @function                    addDependent
 * @param       {number}        policyId        - policyId of the customer
 * @param       {string}        customerAddress - account address of the customer
 * @param       {string}        dependent       - dependent name
 * @param       {string}        age             - age
 * @param       {string}        gender          - gender
 * @param       {string}        relation        - relation
 * @returns     (JSONObject)    txId
 */

app.post('/addDependent', function (request, response) {

    logger.debug("******************* add dependent ***********************");
    var policyId = request.query.policyId;
    var dependentName = request.query.dependentName;
    var age = request.query.age;
    var gender = request.query.gender;
    var relation = request.query.relation;
    var customerAddress = request.query.customerAddress;

    var isError = false;

    if (isNaN(policyId)) {
        console.log(new Error("policyId is not a number"));
        isError = true;
    } else {
        if (isNaN(age)) {
            console.log(new Error("age is not a number"));
            isError = true;
        }
    }

    if (isError == false) {

        try {
            //unlock user account
            web3.personal.unlockAccount(customerAddress, "");

            logger.debug(policyId);
            logger.debug(dependentName);
            logger.debug(age);
            logger.debug(gender);
            logger.debug(relation);
            logger.debug(customerAddress);

            logger.debug("*************************** hitting add dependent api ****************************");

            var txId = deployedPolicyContract['addDependents'](policyId, dependentName, age, gender, relation, {
                from: String(customerAddress),
                gas: 4000000
            });

            logger.debug("printing txId : " + txId);

            var jsonResponse = {
                txId: txId
            }

            response.send(jsonResponse);
        } catch (e) {
            console.error("Error in addDependent: " + e);
        }
    } else {
        response.send({
            "error": "Error in addDependent"
        });
    }
});

/**
 * API to get customer policies
 * 
 * @function                    getCustomerPolicies
 * @param       {string}        customerAddress     - walletAddress of the customer
 * @returns     {JSONObject}    customerPolicies    - list of policies taken customer
 * 
 */
app.get('/getCustomerPolicies', function (request, response) {
    var customerAddress = request.query.customerAddress;

    try {
        logger.debug("************************ get customer policies **************************");
        var customerPoliciesObject = deployedPolicyContract['getCustomerPolicies'](customerAddress);
        logger.debug("printing customer policies : " + customerPoliciesObject);

        var policyList = [];

        for (var index = 0; index < customerPoliciesObject[1].length; index++) {
            var policyObject = deployedPolicyContract['getPolicy'](customerPoliciesObject[1][index], marshAddress);
            logger.debug("printing policyObject : " + policyObject);
            var policyOwnerStatus = deployedInsuranceContract['getPolicyOwnersStatus'](customerPoliciesObject[1][index]);

            var customerAddress = policyObject[1];

            var customerDetailsObject = deployedPolicyContract['getCustomerDetails'](customerAddress);

            var customerName = customerDetailsObject[1];

            var policyDetails = {
                policyId: customerPoliciesObject[1][index],
                policyHolderName: customerName,
                policyValidity: policyObject[2],
                policyDocumentHash: (web3.toUtf8(policyObject[3]) + web3.toUtf8(policyObject[4])),
                timestamp: policyObject[5],
                policyOwnerStatus: policyOwnerStatus
            }

            policyList.push(policyDetails);
        }

        var customerPolicies = {
            policies: policyList.reverse()
        }

        response.send(customerPolicies);
    } catch (e) {
        console.error("Error in getCustomerPolicies : " + e);
    }
});


/**
 * 
 * API to get customer/policyHolder's dependents
 * @function                    getDependents
 * @param       {number}        policyId            -   policyId of the customer
 * @returns     {JSONArray}     dependentList       -   list of all dependents
 */
app.get('/getDependents', function (request, response) {
    var policyId = request.query.policyId;

    try {
        logger.debug("******************** get dependents ********************************");

        var dependentsObject = deployedPolicyContract['getDependents'](policyId);

        logger.debug("printing dependents list : " + dependentsObject);
        logger.debug("converting all list objects to utf8 ");
        var dependentList = [];
        var dependentObject;

        for (var index = 0; index < dependentsObject[0].length; index++) {


            //get dependent details
            var dependentDetailsObject = deployedPolicyContract['getDependentDetails'](dependentsObject[1][index]);

            logger.debug("printing age : " + dependentDetailsObject[1]);
            logger.debug("printing gender : " + dependentDetailsObject[2]);

            dependentObject = {
                dependentName: web3.toUtf8(dependentsObject[0][index]),
                dependentId: dependentsObject[1][index],
                age: dependentDetailsObject[1],
                gender: web3.toUtf8(dependentDetailsObject[2]),
                relation: web3.toUtf8(dependentDetailsObject[3])
            }

            dependentList.push(dependentObject);
        }

        var jsonResponse = {
            dependents: dependentList
        }

        response.send(jsonResponse);
    } catch (e) {
        console.error("Error in getDependents : " + e);
    }
});


/**
 * API to get dependent details
 * 
 * @function                        getDependentDetails
 * 
 * @param           {number}        dependentId
 * @returns         {JSONObject}    dependentDetails    
 * 
 */
app.get('/getDependentDetails', function (request, response) {
    var dependentId = request.query.dependentId;
    try {
        var dependentDetailsObject = deployedPolicyContract['getDependentDetails'](dependentId);

        var dependentDetails = {
            dependentName: web3.toUtf8(dependentDetailsObject[0]),
            age: dependentDetailsObject[1],
            gender: web3.toUtf8(dependentDetailsObject[2]),
            relation: web3.toUtf8(dependentDetailsObject[3])
        }
        logger.debug(dependentDetails);

        response.send(dependentDetails);
    } catch (e) {
        console.error("Error in getDependentsDetails"+e);
    }
});


/**
 * 
 * API to get customer's policy document
 * 
 * @function                    getPolicyDocument
 * @param       {number}        policyId                -   policyId of the customer
 * @returns     {JSONObject}    policyDocument          -   policyDocument of the customer
 */

app.get('/getPolicyDocument', function (request, response) {

    try {
        logger.debug("******************* get policyDocument *****************");
        var policyId = request.query.policyId;
        var policyDocumentObject = deployedPolicyContract['getPolicyDocument'](policyId);
        logger.debug("printing policyDocumentObject " + policyDocumentObject);
        var policyDocument = {
            policyDocumentHash: web3.toUtf8(policyDocumentObject[0]) + web3.toUtf8(policyDocumentObject[1])
        }
        response.send(policyDocument);
    } catch (e) {
        console.error("Error in getPolicyDocument: " + e);
    }
});

/**
 * 
 * API to get All Customer Policies
 * 
 * @function                    getAllCustomerPolicies
 * 
 * @returns     {JSONArray}     customerPolicies        -  all customer policies
 */

app.get('/getAllCustomerPolicies', function (request, response) {

    try {
        logger.debug("****************** get all customer policies *********************");
        var policiesObject = deployedInsuranceContract['getBrokerPolicies'](marshAddress);
        var policies = [];
        for (var index = 0; index < policiesObject.length; index++) {
            var policyId = policiesObject[index];

            var policyObject = deployedPolicyContract['getPolicy'](policyId, marshAddress);
            logger.debug("printing policyObject : " + policyObject);
            var policyOwnerStatus = deployedInsuranceContract['getPolicyOwnersStatus'](policyId);

            var policyHolderAddress = policyObject[1];

            var policyHolderDetails = deployedPolicyContract['getCustomerDetails'](policyHolderAddress);

            var insuredAmount = policyHolderDetails[3];
            var customerName = policyHolderDetails[1];
            var customerAddress = policyHolderDetails[0];
            var policyDetails = {
                policyId: policyId,
                policyValidity: policyObject[2],
                policyDocumentHash: (web3.toUtf8(policyObject[3]) + web3.toUtf8(policyObject[4])),
                timestamp: policyObject[5],
                sumInsured: insuredAmount,
                customerName: customerName,
                policyOwnerStatus: policyOwnerStatus,
                policyHolderAddress: customerAddress
            }

            policies.push(policyDetails);
        }
        response.send(policies.reverse());
    } catch (e) {
        console.error("Error in getAllCustomerPolicies");
    }
});


/**
 * Store Customer Transactions In Database.
 * @function                    storeCustomerTransaction
 * @param       {string}        user_name       - user_name of the customer.
 * @param       {string}        tx_id           - transactionId.
 * @param       {string}        description     - description of the transaction.
 * @param       {string}        accountAddress  - wallet address of the insurance company.
 * @param       {number}        policyId        - loanId of the customer
 */
function storeCustomerTransaction(user_name, tx_id, description, accountAddress, policyId) {
    // storing transaction record for a customer into mongodb 
    // collection is by user_name i.e it can be any emailId( but it is unique)

    try {
        logger.debug("***************** store transactions to database *******************");
        var date_time;

        // get blocktimestamp by fetching blockdata
        logger.debug("printing tx_id" + tx_id);
        logger.debug("fetching transaction data  ");
        var transactionData = web3.eth.getTransaction(tx_id);

        logger.debug(transactionData);

        logger.debug("fetching block data  ");
        var blockNumber = transactionData.blockNumber;

        var blockData = web3.eth.getBlock(blockNumber);
        logger.debug("fetching block timestamp  ");
        date_time = blockData.timestamp;

        logger.debug("printing block timestamp   " + date_time);

        // get name of the customer
        var customerName;
        logger.debug("printing account address : " + accountAddress);
        var result = (deployedPolicyContract['getCustomerDetails'](accountAddress));
        logger.debug("printing customer details : " + result);
        customerName = result[1];

        logger.debug("printing customerName : " + customerName);

        let promiseA = new Promise((resolve, reject) => {
            let wait = setTimeout(() => {
                logger.debug("************ connected to mongodb client at localhost *************");
                logger.debug("********** storing record **********");
                var myobj = {
                    transactionId: tx_id,
                    dateTime: date_time,
                    description: description,
                    customerName: customerName,
                    policyId: policyId
                };

                var collectionName = user_name + "txns";
                brokerCustomerTxnsDB.collection(collectionName).insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    logger.debug("Transaction record inserted ....");
                });
            }, 3000)
        });
    } catch (e) {
        console.error("Error in storeTransaction : " + e);
    }
}


/**
 * 
 * store dependents details
 */
app.post('/saveDependents', function (request, response) {
    var requestId = request.query.requestId;
    var userName = request.query.userName;
    var dependentName = request.query.dependentName;
    var age = request.query.age;
    var gender = request.query.gender;
    var relation = request.query.relation;

    var isError = false;

    if (isNaN(requestId)) {
        console.log(new Error("requestId is not a number"));
        isError = true;
    } else {
        if (isNaN(age)) {
            console.log(new Error("age is not a number"));
            isError = true;
        }
    }

    if (isError == false) {

        try {
            logger.debug("************ connected to mongodb client at localhost *************");
            logger.debug("********** storing record **********");
            //var myobj = { transactionId: tx_id, dateTime: date_time, description: description, customerName: customerName, policyId: policyId};
            //var myObj = {customerName: customerName, customerAddress: customerAddress, userName: userName, policyValidity: policyValidity, dependents: dependents, status: "notApproved"};
            var myObj = {
                userName: userName,
                dependentName: dependentName,
                age: age,
                gender: gender,
                relation: relation,
                requestId: requestId
            };
            var collectionName = userName + "_dependents";
            brokerPolicyReqDependentsDB.collection(collectionName).insertOne(myObj, function (err, res) {
                if (err) throw err;
                logger.debug("dependents added");
            });

            var jsonResponse = {
                message: "requestSubmitted"
            }
            response.send(jsonResponse);
        } catch (e) {
            console.error("Error in saveDependents : " + e);
        }
    } else {
        response.send({
            "error": "Error in saveDependents"
        });
    }
});





/**
 * API to get initial claimDetails
 * 
 * @function                    getInititalClaimDetails 
 * @param       {number}        claimId                     - claimId of the patient
 * 
 * @returns     {JSONObject}    initialClaimDetails         - initital claim details of the customer
 */
app.get('/getInitialClaimDetails', function (request, response) {

    try {
        logger.debug("************************** initial claim details *********************************");
        var claimId = request.query.claimId;
        //fetch data from blockchain
        var initialClaimObject = deployedClaimContract['getInitialClaimDetails'](claimId);
        logger.debug("printing initial claim details : " + initialClaimObject);
        var initialClaimDetails = {
            patientAddress: initialClaimObject[0],
            policyId: initialClaimObject[1],
            timestamp: initialClaimObject[2],
            claimEstimate: initialClaimObject[3],
            estimateDocument: web3.toUtf8(initialClaimObject[4]) + web3.toUtf8(initialClaimObject[5]),
            initiallyApprovedBy: initialClaimObject[6]
        }

        response.send(initialClaimDetails);
    } catch (e) {
        console.error("Error in getInitialClaimDetails : " + e);
    }
});


/**
 * API to get dependents
 * 
 * @function getDependents
 * 
 */

app.get('/getDependentsList', function (request, response) {
    var userName = request.query.userName;
    var requestId = request.query.requestId;

    try {
        var collectionsName = userName + "_dependents";
        var query = {
            requestId: requestId
        };
        brokerPolicyReqDependentsDB.collection(collectionsName).find(query).toArray(function (err, dependentList) {
            if (err) throw err;
            logger.debug(dependentList);
            return response.send(dependentList.reverse());
        });
    } catch (e) {
        console.error("Error : " + e);
    }
});

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

/**
 * @function               getPolicyRequestList
 */

app.get('/getPolicyRequestList', function (request, response) {

    try {
        logger.debug("******************** get policy request list ****************");
        var allTransactions = [];

        policyRequestDB.listCollections().toArray(function (err, result) {
            if (err) throw err;
            for (var index = 0; index < result.length; index++) {
                var collectionsName = result[index].name;
                //logger.debug("printing collections name"+collectionsName);
                var query = {
                    status: "notApproved"
                };
                policyRequestDB.collection(collectionsName).find().toArray(function (err, record) {
                    if (err) throw err;
                    //allTransactions.push(record.reverse());
                    for (var index = 0; index < record.length; index++) {
                        allTransactions.push(record[index]);
                    }
                });
            }
            let promiseA = new Promise((resolve, reject) => {
                let wait = setTimeout(() => {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(allTransactions.reverse());
                }, 2500);
            })
        });
    } catch (e) {
        console.error("Error : " + e);
    }
});


/**
 * 
 * @function                    getPolicyRequestListByRequestId
 * @param       {number}        requestId
 */
app.get('/getPolicyRequestListByRequestId', function (request, response) {
    var requestId = request.query.requestId;
    var userName = request.query.userName;

    try {
        logger.debug("******************** get policy request list ****************");
        var collectionsName = userName + "policyRequest";
        logger.debug("collection name is : " + collectionsName);
        var query = {
            requestId: parseInt(requestId)
        };
        brokerPolicyReqDB.collection(collectionsName).find(query).toArray(function (err, policyRequestList) {
            if (err) throw err;
            logger.debug(policyRequestList[0]);
            return response.send(policyRequestList[0]);
        });
    } catch (e) {
        console.error(e);
    }
});

/**
 * Store Broker Transactions In Database.
 * @function                    storeBrokerTransaction
 * @param       {string}        brokerName      - name of the broker.
 * @param       {string}        tx_id           - transactionId.
 * @param       {string}        description     - description of the transaction.
 * @param       {string}        accountAddress  - wallet address of the broker company.
 * @param       {number}        policyId        - loanId of the customer
 */
function storeBrokerTransaction(brokerName, tx_id, description, accountAddress, policyId) {
    // storing transaction record for a customer into mongodb 
    // collection is by user_name i.e it can be any emailId( but it is unique)

    try {
        logger.debug("***************** store transactions to database *******************");

        var date_time;

        // get blocktimestamp by fetching blockdata
        logger.debug("printing tx_id" + tx_id);
        logger.debug("fetching transaction data  ");
        var transactionData = web3.eth.getTransaction(tx_id);

        logger.debug(transactionData);

        logger.debug("fetching block data  ");
        var blockNumber = transactionData.blockNumber;

        var blockData = web3.eth.getBlock(blockNumber);
        logger.debug("fetching block timestamp  ");
        date_time = blockData.timestamp;

        logger.debug("printing block timestamp   " + date_time);
        let promiseA = new Promise((resolve, reject) => {
            let wait = setTimeout(() => {

                logger.debug("************ connected to mongodb client at localhost *************");
                logger.debug("********** storing record **********");
                var myobj = {
                    transactionId: tx_id,
                    dateTime: date_time,
                    description: description,
                    policyId: policyId
                };

                var collectionName = brokerName + "txns";
                brokerTxnsDB.collection(collectionName).insertOne(myobj, function (err, res) {
                    if (err) throw err;
                    logger.debug("Transaction record inserted ....");
                });
            }, 3000)
        });
    } catch (e) {
        console.error("Error : " + e);
    }
}

/**
 * Get Customer Transactions from database
 * @function                    getCustomerTransactions
 * @param       {string}        userName            -   userName of the customer
 * @returns     {JSONArray}     transactionList     -   list of customer transactions
 */
app.get('/getCustomerTransactions', function (request, response) {

    try {
        logger.debug("******************** get transactions for customer ****************");
        var userName = request.query.userName;
        var collectionsName = userName + "txns"
        brokerCustomerTxnsDB.collection(collectionsName).find({}).toArray(function (err, transactionList) {
            if (err) throw err;
            logger.debug(transactionList);
            return response.send(transactionList.reverse());
        });
    } catch (e) {
        console.error("Error : "+e);
    }
});

/**
 * Get Customer Transactions By PolicyId
 * @function                getCustomerTransactionsByPolicyId
 * @param       {string}    userName            - userName of the customer
 * @param       {number}    policyId            - policyId of the customer
 * @returns     {JSONArray} transactionList     - list of customer transactions by loanId
 */
app.get('/getCustomerTransactionsByPolicyId', function (request, response) {

    try {
        logger.debug("******************** get transactions for customer by policyId ****************");
        var userName = request.query.userName;
        var policyId = parseInt(request.query.policyId);
        logger.debug("userName is " + userName);
        logger.debug("loan id is " + policyId);

        var collectionsName = userName + "txns";
        logger.debug("printing collections name " + collectionsName);
        var query = {
            policyId: policyId
        };
        brokerCustomerTxnsDB.collection(collectionsName).find(query).toArray(function (err, transactionList) {
            if (err) throw err;
            logger.debug(transactionList);
            return response.send(transactionList.reverse());
        });
    } catch (e) {
        console.error("Error : " + e);
    }
});


/**
 * Get All Customer Transactions
 * @function                getAllCustomerTransactions
 * @returns     {JSONArray} allTransactions             - list of all customer transactions
 * 
 */
app.get('/getAllCustomerTransactions', function (request, response) {

    try {
        logger.debug("*********************** get all customer transactions *************************");
        var allTransactions = [];
        brokerCustomerTxnsDB.listCollections().toArray(function (err, result) {
            if (err) throw err;
            logger.debug(result);
            //db.close();
            for (var index = 0; index < result.length; index++) {
                var collectionsName = result[index].name;
                logger.debug("printing collectionsName " + collectionsName);
                brokerCustomerTxnsDB.collection(collectionsName).find({}).toArray(function (err, record) {
                    if (err) throw err;
                    //logger.debug("printing length of result : "+record.length);
                    //allTransactions.push(record.reverse());
                    //pushing all transactions into single list
                    for (var i = 0; i < record.length; i++) {
                        allTransactions.push(record[i]);
                    }
                });
            }
            let promiseA = new Promise((resolve, reject) => {
                let wait = setTimeout(() => {
                    response.setHeader('Content-Type', 'application/json');
                    response.send(allTransactions);
                }, 3000)
            })
        });
    } catch (e) {
        console.error("Error : " + e);
    }
});

//Insurance.sol API's

/**
 * API to register broker
 * @function                    registerBroker
 * 
 * @param       {string}        brokerName      -   name of the broker company
 * @returns     {JSONObject}    brokerInfo      -   broker accountAddress, brokerName and txId of registration
 */

app.get('/registerBroker', function (request, response) {

    try {
        logger.debug("********************* register broker on blockchain ****************************");
        var brokerName = request.query.brokerName;
        var brokerAddress = marshAddress;
        logger.debug("unlocking brokerAccount");
        web3.personal.unlockAccount(marshAddress, brokerWalletPassword);
        var txId = deployedInsuranceContract['registerBroker'](brokerAddress, brokerName, {
            from: brokerAddress,
            gas: 4000000
        });
        logger.debug("printing transaction id : " + txId);

        var brokerInfo = {
            brokerAddress: brokerAddress,
            brokerName: brokerName,
            txId: txId
        }

        response.send(brokerInfo);
    } catch (e) {
        console.error("Error : " + e);
    }
});



/**
 * 
 * API to register tpa
 * @function                    registerTPA
 * 
 * @param           {string}    tpaName         - name of the tpa
 * 
 * @returns         {JSONObject} tpaInfo        - tpa info
 */

/*
app.post('/registerTPA',function(request, response){
    logger.debug("************************ register tpa ******************************");

    var tpaName = request.query.tpaName;
    //var tpaAddress = tpaAddress;

    logger.debug("unlocking tpa ");
    web3.personal.unlockAccount(tpaAddress, "");

    var txId = deployedInsuranceContract['registerTPA'](tpaAddress, tpaName, {from: tpaAddress, gas:400000});

    var tpaInfo = {
        tpaAddress:tpaAddress,
        tpaName:tpaName,
        txId:txId
    }

    response.send(tpaInfo);
});
*/

/**
 * API to register insurance
 * @function                    registerInsurance
 * @param       {string}        insuranceName     - name of the insurance company
 * 
 * @returns     {JSONObject}    insuranceInfo     - insurance info
 */

/*
 app.post('/registerInsurance', function(request, response){
    logger.debug("************************* register insurance ****************************");

    var insuranceName  = request.query.insuranceName;
    //var insuranceAddress = insuranceAddress;
    web3.personal.unlockAccount(insuranceAddress, "");

    var txId = deployedInsuranceContract['registerInsuranceCompany'](insuranceAddress, insuranceName, {from: insuranceAddress, gas:400000});

    var insuranceInfo = {
        insuranceAddress:insuranceAddress,
        insuranceName:insuranceName,
        txId: txId
    }

    response.send(insuranceInfo);
 });
*/


/**
 * API to get list of broker from blockchain
 * @function                    getBrokerList
 * 
 * @returns     {JSONArray}     brokerList      -   returns list of brokerInfo (contains brokerName and brokerAddress)
 */
app.get('/getBrokerList', function (request, response) {

    try {
        logger.debug("********************* get list of brokers **********************************");

        var brokerAddressList = deployedInsuranceContract['getListOfBrokers']();

        logger.debug("printing broker list : " + brokerAddressList);
        var brokerList = [];
        for (let index = 0; index < brokerAddressList.length; index++) {
            var brokerObject = deployedInsuranceContract['getBroker'](brokerAddressList[index]);

            var broker = {
                "brokerAddress": brokerObject[0],
                "brokerName": web3.toUtf8(brokerObject[1])
            }

            brokerList.push(broker);
        }

        //sending response to browser
        response.send(brokerList);
    } catch (e) {
        console.error("Error : " + e);
    }

});

/**
 * API to get list of all tpa's
 * @function                getTPAList
 * 
 * @returns     {JSONArray} tpaList             - list of all tpa's in the blockchain
 */
app.get('/getTPAList', function (request, response) {

    try {
        logger.debug("************************* get list of tpa's ***************************");
        var tpaAddressList = deployedInsuranceContract['getListOfTPAs']();
        logger.debug("printing tpa list " + tpaAddressList);
        var tpaList = [];
        for (var index = 0; index < tpaAddressList.length; index++) {
            var tpaObject = deployedInsuranceContract['getTPA'](tpaAddressList[index]);
            var tpa = {
                "tpaAddress": tpaObject[0],
                "tpaName": web3.toUtf8(tpaObject[1])
            }
            tpaList.push(tpa);
        }
        response.send(tpaList);
    } catch (e) {
        console.error("Error : " + e);
    }
});


/**
 * API to get list of all insurance company
 * 
 * @function                getInsuranceList
 * 
 * @returns     {JSONArray} insuranceList       - lis of all insurance comapanies
 */
app.get('/getInsuranceList', function (request, response) {

    try {
        logger.debug("************************* get list of Insurance companies ***************************");

        var insuranceAddressList = deployedInsuranceContract['getListOfInsuranceCompanies']();

        logger.debug("printing insuranceAddressList  " + insuranceAddressList);
        var insuranceList = [];

        for (var index = 0; index < insuranceAddressList.length; index++) {
            var insuranceObject = deployedInsuranceContract['getInsuranceCompany'](insuranceAddressList[index]);

            var insurance = {
                "insuranceAddress": insuranceObject[0],
                "insuranceName": web3.toUtf8(insuranceObject[1])
            }
            insuranceList.push(insurance);
        }

        response.send(insuranceList);
    } catch (e) {
        console.error("Error : " + e);
    }
});

/**
 * API to get broker info
 * @function                    getBrokerInfo
 * @returns     {JSONObject}    brokerInfo      - returns brokerName and brokerAddress
 */
app.get('/getBrokerInfo', function (request, response) {
    try {
        logger.debug("********************** get broker info ****************************");
        var brokerAddress = request.query.brokerAddress;

        var brokerObject = deployedInsuranceContract['getBroker'](brokerAddress);
        logger.debug("printing brokerObject : " + brokerObject);

        var brokerInfo = {
            brokerAddress: brokerObject[0],
            brokerName: web3.toUtf8(brokerObject[1])
        }

        response.send(brokerInfo);
    } catch (e) {
        console.error("Error : " + e);
    }
});

/**
 * API to get policyOwners
 * @function                    getPolicyOwners
 * @param       {string}        policyId
 * 
 * @returns     {JSONObject}    policyOwners    - returns policyId and policyOwners
 * 
 */
app.get('/getPolicyOwners', function (request, response) {

    try {
        logger.debug("********************** get policy owners ***********************");
        var policyId = request.query.policyId;

        var policyOwnerObject = deployedInsuranceContract['getPolicyOwners'](policyId);

        logger.debug("printing policyOwnerObject : " + policyOwnerObject);

        var policyOwners = {
            policyId: policyId,
            insuranceAddress: policyOwnerObject[0],
            tpaAddress: policyOwnerObject[1],
            brokerAddress: policyOwnerObject[2]
        }

        response.send(policyOwners);
    } catch (e) {
        console.error("Error : " + e);
    }
});


/**
 * API to accept claim (initial claim approval)
 * 
 * @function                    acceptClaim
 * 
 * @param       {claimId}       claimId
 * @param       {policyId}      policyId
 * 
 * @returns     {JSONObject}    txId
 */
app.post('/acceptClaim', function (request, response) {

    try {
        logger.debug("************************ accept claim ********************************");
        var claimId = request.query.claimId;
        var policyId = request.query.policyId;

        var isError = false;

        if (isNaN(claimId)) {
            console.log(new Error("claimId is not a number"));
            isError = true;
        } else {
            if (isNaN(policyId)) {
                console.log(new Error("policyId is not a number"));
                isError = true;
            }
        }

        if (isError == false) {
            web3.personal.unlockAccount(marshAddress, brokerWalletPassword);
            var txId = deployedClaimContract['initialClaimApproval'](claimId, policyId, marshAddress, insuranceContractAddress, {
                from: marshAddress,
                gas: 4000000
            });
            var jsonResponse = {
                txId: txId
            }

            response.send(jsonResponse);
        } else {
            response.send({
                "error": "Error in acceptClaim"
            });

        }
    } catch (e) {
        logger.error("ERROR : " + e);
    }
});

/**
 * API for final approval of claim
 * 
 * @function                    approveClaim
 * @param       {claimId}       claimId         -   claimId of the patient
 * @returns     {JSONObject}    txId            -   txId
 */
app.post('/approveClaim', function (request, response) {

    try {
        logger.debug("************************ approve claim ****************************");
        var claimId = request.query.claimId;
        var isError = false;

        if (isNaN(claimId)) {
            console.log(new Error("claimId is not a number"));
            isError = true;
        }

        if (isError == false) {
            web3.personal.unlockAccount(marshAddress, brokerWalletPassword);
            var txId = deployedClaimContract['finalClaimApproval'](claimId, marshAddress, {
                from: marshAddress,
                gas: 4000000
            });
            var jsonResponse = {
                txId: txId
            }
            response.send(jsonResponse);
        } else {
            response.send({
                "error": "Error in approveClaim"
            });
        }
    } catch (e) {
        logger.error("ERROR : " + e);
    }
});


/**
 * 
 * API to get list of claims applied
 * 
 * @function                    getClaimList
 * 
 * @returns     {JSONArray}     claimList
 * 
 */
app.get('/getClaimListForBroker', function (request, response) {
    try {
        logger.debug("******************* get claim list for broker ********************");
        logger.debug("**************** Get Claim Request List ******************");
        claimListDB.collection("claimlist").find().toArray(function (err, result) {
            if (err) throw err;
            logger.debug(result);
            return response.send(result.reverse());
        });
    } catch (e) {
        console.error(e);
    }
});


/**
 * 
 * API to get list of claims for a customer
 * 
 * @function                     getCustomerClaims
 * 
 * @returns      {JSONArray}     customerClaimList
 */
app.get('/getCustomerClaims', function (request, response) {

    try {
        var walletAddress = request.query.walletAddress;
        logger.debug("********************** get customer claims ***********************");
        var claimListObject = deployedInsuranceContract['getBrokerClaims'](marshAddress);

        var claimList = [];
        for (var index = 0; index < claimListObject.length; index++) {
            var claimId = claimListObject[index];
            var initialClaimObject = deployedClaimContract['getInitialClaimDetails'](claimId);
            logger.debug("printing initial claim details : " + initialClaimObject);
            var claimDetailsObject = deployedClaimContract['getClaimDetails'](claimId);
            var policyId = initialClaimObject[1];
            //get customerName and patientName
            var policyObject = deployedPolicyContract['getPolicy'](policyId, marshAddress);
            var customerAddress = policyObject[1];
            var customerObject = deployedPolicyContract['getCustomerDetails'](customerAddress);
            var customerName = customerObject[1];
            var patientObject = deployedHospitalContract['getPatientDetails'](initialClaimObject[0]);
            var approverName = deployedInsuranceContract['getCompanyName'](initialClaimObject[6]);
            logger.debug("printing patientObject  : " + JSON.stringify(patientObject));
            var patientName = patientObject[2];

            var initialClaimDetails = {
                claimId: claimId,
                customerAddress: customerAddress,
                policyHolderName: customerName,
                patientName: patientName,
                claimStatus: web3.toUtf8(claimDetailsObject[0]),
                patientAddress: initialClaimObject[0],
                policyId: initialClaimObject[1],
                timestamp: initialClaimObject[2],
                claimEstimate: initialClaimObject[3],
                estimateDocument: web3.toUtf8(initialClaimObject[4]) + web3.toUtf8(initialClaimObject[5]),
                initiallyApprovedBy: initialClaimObject[6],
                approverName: web3.toUtf8(approverName)
            }
            if (walletAddress == initialClaimDetails.customerAddress) {
                claimList.push(initialClaimDetails);
            }
        }
        response.send(claimList.reverse());
    } catch (e) {
        console.error("Error : " + e);
    }
});



/**
 * 
 * API to get claim details
 * 
 * @function                        getClaimDetails
 * @param           {number}        claimId                 - claimId of the patient
 * @returns         {JSONObject}    claimDetails            - claim details of the patient
 */

app.get('/getClaimDetails', function (request, response) {

    try {
        logger.debug("**************************** get claim details of the patient **********************");
        var claimId = request.query.claimId;
        var claimDetailsObject = deployedClaimContract['getClaimDetails'](claimId);
        var claimOwnersObject = deployedClaimContract['getClaimOwners'](claimId);

        logger.debug("printing claim details : " + JSON.stringify(claimDetailsObject));
        logger.debug("printing owner details : " + JSON.stringify(claimOwnersObject));



        var bill;
        logger.debug("printing length " + claimDetailsObject[1]);
        if (claimDetailsObject[1] == 0) {
            bill = "notFound"
        } else {
            bill = (web3.toUtf8(claimDetailsObject[1][0]) + web3.toUtf8(claimDetailsObject[2][0]));
        }


        var claimDetails = {
            claimStatus: web3.toUtf8(claimDetailsObject[0]),
            bill: bill,
            claimAmount: claimDetailsObject[3],
            brokerAddress: claimOwnersObject[0],
            insuranceAddress: claimOwnersObject[1],
            tpaAddress: claimOwnersObject[2]
        }

        logger.debug("printing claim details : " + claimDetails);
        response.send(claimDetails);

    } catch (e) {
        console.error("Error : "+e);
    }
});


/**
 * API to get list of all customers
 * @function                    function to create policyDocument
 * @returns     {JSONArray}     allCustomers
 */
app.get('/getAllCustomers', function (request, response) {

    try {
        logger.debug("***************************** get all customers ************************");
        var allCustomers = [];

        brokerDB.listCollections().toArray(function (err, result) {
            if (err) throw err;
            logger.debug(result);
            //db.close();
            for (var index = 0; index < result.length; index++) {
                var collectionsName = result[index].name;
                //logger.debug("printing collections name"+collectionsName);
                brokerDB.collection(collectionsName).find({}).toArray(function (err, record) {
                    if (err) throw err;
                    logger.debug("printing record : " + JSON.stringify(record[0]));
                    allCustomers.push(record[0]);
                });
            }

            let promiseA = new Promise((resolve, reject) => {
                let wait = setTimeout(() => {

                    response.setHeader('Content-Type', 'application/json');
                    response.send(allCustomers);
                }, 3000)
            })
        });
    } catch (e) {
        console.error("Error : " + e);
    }
});

/**
 * 
 * @param {*} policyId 
 * @param {*} dependentList 
 * @param {*} policyValidity 
 * @param {*} customerAddress 
 */
function createPolicyDocument(policyId, dependentList, policyValidity, customerAddress) {

    try {
        logger.debug("*********************** creating policy document ***************************");
        logger.debug("printing policyValidity : " + policyValidity);
        //get policy details
        var policyDetails = deployedPolicyContract['getPolicy'](policyId, marshAddress);
        logger.debug("printing policyDetails : " + policyDetails);
        var customerDetails = deployedPolicyContract['getCustomerDetails'](customerAddress);

        logger.debug("printing customer details : " + customerDetails);
        var customerName = customerDetails[1];
        var sumInsured = customerDetails[3];
        var tenure = customerDetails[4];

        var dependentString = "";
        logger.debug("printing dependents : " + JSON.stringify(dependentList));
        for (let index = 0; index < dependentList.length; index++) {

            var dependent = dependentList[index];
            logger.debug("printing dependent at index : " + index + " : " + JSON.stringify(dependent));

            if (index == dependentList.length - 1) {
                dependentString = dependentString + dependent.dependentName + ". ";
            } else {
                dependentString = dependentString + dependent.dependentName + ", ";
            }
        }

        var theDate = new Date(policyValidity * 1000);

        var policyValidityDate = theDate.toLocaleDateString();
        logger.debug("printing converted date : " + policyValidityDate);

        var text = "The policy with policyId " + policyId + " is issued to " + customerName + ". The insured amount is Rs" + sumInsured + ". The policy will expire on " + policyValidityDate + "." + " The policy covers the dependents mentioned above.";

        var signature = "MBroker Companies";
        doc = new PDFDocument;
        doc.pipe(fs.createWriteStream('policies/policyDocument_' + policyId + '.pdf'));

        //# Scale the image
        doc.image('images/mbroker.jpeg');
        doc.moveDown();

        //writing policyId to the pdf
        doc.fontSize(9).text('policyId is           : ' + policyId);
        doc.moveDown();
        doc.fontSize(9).text('Company Name          : ' + "MBroker");
        doc.moveDown();
        doc.fontSize(9).text('Broker Address        : ' + marshAddress);
        doc.moveDown();
        doc.fontSize(9).text('Policy Validity       : ' + policyValidityDate);

        doc.moveDown();
        doc.fontSize(9).text('Dependents            : ' + dependentString);
        doc.moveDown();
        doc.fontSize(9).text('Customer Name         : ' + customerName);
        doc.moveDown();
        doc.fontSize(9).text(text);
        doc.moveDown();
        doc.moveDown();
        doc.moveDown();
        doc.fontSize(11).text(signature);
        logger.debug("*********************** policy document stored ************************");
        doc.end();
    } catch (e) {
        console.error(e);
    }
}


/**
 * updateClaimRecord updates claim status
 * @param {*} claimId 
 * @param {*} claimStatus 
 */
function updateClaimRecord(claimId, claimStatus) {

    var isError = false;

    if (isNaN(claimId)) {
        console.log(new Error("claimId is not a number"));
        isError = true;
    }

    if (isError == false) {
        try {
            //update claim record
            logger.info("updateClaimRecord");
            var query = {
                claimId: claimId.toNumber()
            };

            var initialClaimObject = deployedClaimContract['getInitialClaimDetails'](claimId);
            var initiallyApprovedBy = initialClaimObject[6];
            var approverName = deployedInsuranceContract['getCompanyName'](initialClaimObject[6]);

            var newValues = {
                $set: {
                    claimStatus: web3.toUtf8(claimStatus),
                    initiallyApprovedBy: initiallyApprovedBy,
                    approverName: web3.toUtf8(approverName)
                }
            }

            claimListDB.collection("claimlist").updateOne(query, newValues, function (err, doc) {
                if (err) throw err;
                logger.debug("claimlist_db updated ..");
            });
        } catch (e) {
            logger.error("ERROR : " + e);
        }
    } else {
        console.log("Error in updateClaimRecord");
    }
}


/**
 * sets estimate document hash
 * @param {*} claimId 
 */
function updateEstimateDocument(claimId) {

    var isError = false;

    if (isNaN(claimId)) {
        console.log(new Error("claimId is not a number"));
        isError = true;
    }

    if (isError == false) {
        //method to update claimlist_db
        //Just update estimateDocument key in the record
        //search the record by claimid
        try {
            logger.info("updateEstimateDocument");
            logger.debug("claimId : " + claimId);

            var query = {
                claimId: claimId.toNumber()
            };
            var initialClaimObject = deployedClaimContract['getInitialClaimDetails'](claimId);
            estimateDocument = web3.toUtf8(initialClaimObject[4]) + web3.toUtf8(initialClaimObject[5]);

            var newValues = {
                $set: {
                    estimateDocument: estimateDocument

                }
            }
            logger.debug("trying to update claimlist db for estimate document");
            claimListDB.collection("claimlist").updateOne(query, newValues, function (err, doc) {
                if (err) throw err;
                logger.debug("claimlist_db updated ..");
            });
        } catch (e) {
            logger.error("ERROR : " + e);
        }
    } else {
        console.log("Error in updateEstimateDocument");
    }
}



/**
 * inserts claim record on claim initiation
 * @param {*} claimId
 */
function insertClaimRecord(claimId) {
    logger.info("insertClaimRecord");

    var isError = false;

    if (isNaN(claimId)) {
        console.log(new Error("claimId is not a number"));
        isError = true;
    }

    if (isError == false) {
        try {
            var initialClaimObject = deployedClaimContract['getInitialClaimDetails'](claimId);
            logger.debug("printing initial claim details : " + initialClaimObject);
            var claimDetailsObject = deployedClaimContract['getClaimDetails'](claimId);
            var policyId = initialClaimObject[1];
            //get customerName and patientName
            var policyObject = deployedPolicyContract['getPolicy'](policyId, marshAddress);
            var customerAddress = policyObject[1];
            var customerObject = deployedPolicyContract['getCustomerDetails'](customerAddress);
            var customerName = customerObject[1];
            var patientObject = deployedHospitalContract['getPatientDetails'](initialClaimObject[0]);
            var approverName = deployedInsuranceContract['getCompanyName'](initialClaimObject[6]);
            logger.debug("printing patientObject  : " + JSON.stringify(patientObject));
            var patientName = patientObject[2];

            var initialClaimDetails = {
                claimId: claimId.toNumber(),
                policyHolderName: customerName,
                patientName: patientName,
                claimStatus: web3.toUtf8(claimDetailsObject[0]),
                patientAddress: initialClaimObject[0],
                policyId: initialClaimObject[1].toNumber(),
                timestamp: initialClaimObject[2].toNumber(),
                claimEstimate: initialClaimObject[3].toNumber(),
                estimateDocument: web3.toUtf8(initialClaimObject[4]) + web3.toUtf8(initialClaimObject[5]),
                initiallyApprovedBy: initialClaimObject[6],
                approverName: web3.toUtf8(approverName)
            }

            //push the object into mongodb 
            var query = {
                claimId: claimId.toNumber()
            };
            var obj = initialClaimDetails;
            claimListDB.collection("claimlist").update(query, obj, {
                upsert: true
            }, function (err, doc) {
                if (err) throw err;
                logger.debug("Record inserted/updated ..");
            });

        } catch (e) {
            logger.error("ERROR : " + e);
        }
    } else {
        console.log("Error in insertClaimRecord");
    }
}




//********************************************* Analytics API  ********************************************/


logger.debug("############################ starting marsh statisics API #############################");


/**
 * API to get statistics of GroupInsurance Network
 * 
 * @function                    getStatistics
 * 
 * @returns     {JSONArray}     statistics
 */
app.get('/getStatistics', function (request, response) {
    logger.debug("**************** Get Statistics ********************");
    //get claimList
    var claimListObject = deployedClaimContract['getClaimList']();
    //get number of claims
    var numberOfClaims = claimListObject.length;
    var numberOfPoliciesApproved = 0;
    var numberOfPoliciesNotApproved = 0;
    //get number of clients or registered customers
    let url = mongoUrl + "mbroker";
    statsDB.listCollections().toArray(function (err, userList) {
        if (err) throw err;
        logger.debug("number of customers : " + userList.length);
        var numberOfUsers = userList.length;

        //search for policies which are not approved and not approved

        let url = mongoUrl + "mbroker_policy_request";
        statsDB2.listCollections().toArray(function (err, userList) {
            for (let index = 0; index < userList.length; index++) {
                var userObject = userList[index];
                statsDB2.collection(userObject.name).find({}).toArray(function (err, userDetails) {
                    if (err) throw err;
                    logger.debug("printing record : " + JSON.stringify(userDetails[0]));
                    if (userDetails[0].status == "Approved") {
                        numberOfPoliciesApproved = numberOfPoliciesApproved + 1;
                    } else {
                        numberOfPoliciesNotApproved = numberOfPoliciesNotApproved + 1;
                    }
                });
            }

            var numberOfTPA = deployedInsuranceContract['getListOfTPAs']();
            var numberOfInsuranceCompanies = deployedInsuranceContract['getListOfInsuranceCompanies']();
            var policyList = deployedInsuranceContract['getBrokerPolicies'](marshAddress);
            let promiseA = new Promise((resolve, reject) => {
                let wait = setTimeout(() => {
                    var statistics = {
                        numberOfUsers: numberOfUsers,
                        numberOfClaims: numberOfClaims,
                        approvedPolicies: numberOfPoliciesApproved,
                        unApprovedPolicies: numberOfPoliciesNotApproved,
                        numberOfTPA: numberOfTPA.length,
                        numberOfInsuranceCompanies: numberOfInsuranceCompanies.length,
                        blockHeight: web3.eth.blockNumber,
                        policies: policyList.length
                    }

                    logger.debug("printing number of customers : " + statistics);
                    response.send(statistics);
                }, 2000);
            });
        });
    });
});

/**
 * API to fetch claim status list
 * 
 * @function                    getClaimStatusList
 * 
 * @returns     {JSONArray}     claimStatusList
 * 
 */
app.get('/getClaimStatusList', function (request, response) {
    //get all claims for marsh and find approved and unapproved claims

    try {
        var claimStatusObject;
        var approvedCount = 0;
        var unapprovedCount = 0;
        var claimList = deployedInsuranceContract['getBrokerClaims'](marshAddress);
        logger.debug("printing claimList : " + claimList);
        for (let index = 0; index < claimList.length; index++) {
            let claimIdObject = claimList[index];
            let claimDetailsObject = deployedClaimContract['getClaimDetails'](claimIdObject);
            if (web3.toUtf8(claimDetailsObject[0]) == "approved") {
                approvedCount = approvedCount + 1;
            } else {
                unapprovedCount = unapprovedCount + 1;
            }
        }
        claimStatusObject = {
            approvedClaimCount: approvedCount,
            unApprovedClaimCount: unapprovedCount
        }

        response.send(claimStatusObject);
    } catch (e) {
        console.error(e);
    }
});


/**
 * API to ge claimCount by estimate
 * @function            getClaimCountByEstimate
 * 
 * @returns             claimEstimateCount
 */
app.get('/getClaimCountByEstimate', function (request, response) {

    try {
        logger.debug("************************** get claim count by estimate ********************************");
        //Note :- based on initial claim estimate

        var claimList = deployedClaimContract['getClaimList']();
        var lessThanFifty = 0;
        var greaterThanFifty = 0;

        for (let index = 0; index < claimList.length; index++) {
            let claimIdObject = claimList[index];
            var initialClaimDetails = deployedClaimContract['getInitialClaimDetails'](claimIdObject);
            if (initialClaimDetails[3] <= 50000) {
                lessThanFifty = lessThanFifty + 1;
            } else {
                greaterThanFifty = greaterThanFifty + 1;
            }
        }

        let claimCount = {
            lessThanFifty: lessThanFifty,
            greaterThanFifty: greaterThanFifty
        }

        response.send(claimCount);
    } catch (e) {
        console.error("Error : " + e);
    }
});


/**
 * API to get dependents count by policyId
 * 
 * @function            getDependentsByPolicyId
 * 
 * @returns             dependentList
 */
app.get('/getDependentsByPolicyId', function (request, response) {

    try {
        logger.info("getDependentsByPolicyId");

        var policyList = deployedInsuranceContract['getBrokerPolicies'](marshAddress);
        var dependentList = [];
        logger.debug("policyList : " + policyList);

        for (let index = 0; index < policyList.length; index++) {
            let policyIdObject = policyList[index];
            var dependentListObject = deployedPolicyContract['getDependents'](policyIdObject);

            let dependentCount = {
                policyId: policyIdObject,
                dependents: dependentListObject[1].length
            }
            dependentList.push(dependentCount);
        }

        logger.debug("");
        response.send(dependentList);
    } catch (e) {
        console.error("Error : " + e);
    }
});


/**
 * 
 * API to get claims by policyId
 * 
 * @function getClaimsByPolicyId
 * 
 * 
 */
app.get('/getClaimsByPolicyId', function (request, response) {

    try {
        logger.info("getClaimsByPolicyId");
        var policyListObject = deployedInsuranceContract['getBrokerPolicies'](marshAddress);
        var policyList = [];
        logger.debug("policyListObject : " + policyListObject);
        for (let index = 0; index < policyListObject.length; index++) {
            let policyObject = {
                policyId: policyListObject[index],
                claimIdCount: 0
            }
            policyList.push(policyObject);
        }

        var claimListObject = deployedInsuranceContract['getBrokerClaims'](marshAddress);
        logger.debug("printing claim list : " + JSON.stringify(claimListObject));
        for (let index = 0; index < claimListObject.length; index++) {
            var initialClaimObject = deployedClaimContract['getInitialClaimDetails'](claimListObject[index]);
            logger.debug("printing initial Claim object : " + JSON.stringify(initialClaimObject));
            for (let i = 0; i < policyList.length; i++) {
                if (policyList[i].policyId == initialClaimObject[1].toNumber()) {
                    policyList[i].claimIdCount = policyList[i].claimIdCount + 1;
                }
            }
        }

        logger.debug("policyList : " + JSON.stringify(policyList));

        let promiseA = new Promise((resolve, reject) => {
            let wait = setTimeout(() => {
                response.send(policyList);
            }, 1000);
        });
    } catch (e) {
        console.error("Error : " + e);
    }
});

/**
 * getConfigData
 */
app.get('/getContractConfig', function (request, response) {

    try {
        logger.info("getConfigData");
        /*
        let configRawData = fs.readFileSync('./config.json');  
        let configData = JSON.parse(configRawData);
        */
        let contractConfigRawData = fs.readFileSync('./contractConfig.json');
        let contractConfigData = JSON.parse(contractConfigRawData);

        /*
        var config = {
            contractConfig : contractConfigData,
            appConfig : configData
        }
        */
        //logger.debug("config : "+JSON.stringify(config));
        response.send({
            contractConfigData
        });
    } catch (e) {
        console.error(e);
    }

})

/**
 * 
 * API to get file from ipfs
 * 
 */
app.get('/ipfs', function (req, res) {
    logger.info("ipfs");
    var fileHash = req.query.fileHash;

    try {
        //create and ipfs url and return
        logger.debug("fileHash : " + fileHash);

        /*
        ipfs.files.cat(fileHash, function (err, file) {
            if (err) throw err;
            res.send(file);
        });
        */
        res.send({
            ipfsUrl: "http://" + ipfsIpAddress + ":8080/ipfs/" + fileHash
        });
    } catch (e) {
        logger.error("ERROR : " + e);
    }
});

app.get('/index', function (req, res) {
    res.sendFile(path.join(__dirname + '/UI/index.html'));
    //res.sendFile('/AirportDashboard/index.html');

});


/**
 * Health check API
 */
app.get('/checkHealthStatus', function(req, res){
    logger.info("checkHealthStatus");

    res.send({
        message:"Health check"
    });
});

app.get("/getAppConfig", function (req, res) {
    logger.info("getAppConfig");
    try {
        var configDataRaw = fs.readFileSync("config.json");
        let configData = JSON.parse(configDataRaw);
        res.send(configData);
    } catch (e) {
        console.error("Error : " + e);
    }
});

app.get("/getBrokerWalletAddress", function (req, res) {
    logger.info("getBrokerWalletAddress");
    try {
        let configDataBrokerRaw = fs.readFileSync("./config.json");
        let configDataBroker = JSON.parse(configDataBrokerRaw);
        logger.debug("brokerWalletAddress : " + JSON.stringify(configDataBroker.brokerWalletAddress));

        res.send({
            brokerWalletAddress: configDataBroker.brokerWalletAddress
        });
    } catch (e) {
        console.error("Error : " + e);
    }
});



app.use('/', function (req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    var message = {
        message: "Quorum API"
    }
    res.send(message);
})

// ************** app runs at 0.0.0.0 at port 5000 *****************************
app.listen(appPort, appIp, function () {
    logger.debug("Application started and listening at : " + appIp + "  Port : " + appPort);
});