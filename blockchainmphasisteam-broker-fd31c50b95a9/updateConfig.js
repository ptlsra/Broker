var Web3 = require('web3-quorum');
var fs = require("fs");
var log4js = require('log4js');
var logger = log4js.getLogger('updateConfig.js');
var web3;
logger.level = "debug";

/**
 * printUsage
 */
function printUsage() {
    //TODO
    logger.debug("printUsage");
    logger.info("ARGS[1] - ipfsIP");
    logger.info("ARGS[2] - ipfsPort");
    logger.info("ARGS[3] - mongoIp");
    logger.info("ARGS[4] - mongoPort");
    logger.info("ARGS[5] - appPort");
    logger.info("ARGS[6] - rpcAddress");
    logger.info("ARGS[7] - rpcPort");
}
/**
 * 
 * @param {*} ipfsIp 
 * @param {*} ipfsPort 
 * @param {*} mongoIp 
 * @param {*} mongoPort 
 * @param {*} appPort 
 * @param {*} rpcAddress 
 * @param {*} rpcPort 
 */
function updateConfig(ipfsIp, ipfsPort, mongoIp, mongoPort, appPort, rpcAddress, rpcPort) {
    logger.info("updateConfig");
    logger.debug("ipfsIp : " + ipfsIp);
    logger.debug("ipfsPort : " + ipfsPort);
    logger.debug("mongoIp : " + mongoIp);
    logger.debug("mongoPort : " + mongoPort);
    logger.debug("appPort : " + appPort);
    logger.debug("rpcAddress : " + rpcAddress);
    logger.debug("rpcPort : " + rpcPort);

    /**
     * Read config.json file
     */
    let configRawData = fs.readFileSync('./config.json');
    let configData = JSON.parse(configRawData);

    logger.debug("config.json : " + JSON.stringify(configData));

    var ipfsUrl = "/ip4/" + "127.0.0.1" + "/tcp/" + ipfsPort;
    var web3Url = "http://" + rpcAddress + ":" + rpcPort;

    //app will run at 0.0.0.0
    var appIp = "0.0.0.0";

    web3 = new Web3(new Web3.providers.HttpProvider(web3Url));
    logger.info("Connected to web3");

    //set walletAddress
    //var firstWalletAddress = web3.eth.accounts[0]; //issue #10
    var firstWalletAddress = web3.eth.coinbase;
    var walletPassword = "";

    configData.brokerWalletAddress = firstWalletAddress;
    configData.brokerWalletPassword = walletPassword;
    configData.ipfsUrl = ipfsUrl;
    configData.web3Url = web3Url;
    configData.mongoIp = "127.0.0.1";
    configData.mongoPort = mongoPort;
    configData.appIp = appIp;
    configData.appPort = appPort;
    configData.appIpAddress=mongoIp;
    configData.ipfsIp = ipfsIp;

    /*
    configData.redeploy = false;
    var InsuranceJsonExist = fs.exists("Insurance.json");


    if(InsuranceJsonExist == true){
        logger.info("Insurance.json exist");
        //Insurance.sol
        var insuranceContractSource = fs.readFileSync("Insurance.json");
        var insuranceContract = JSON.parse(insuranceContractSource)["contracts"];
        var insuranceabi = JSON.parse(insuranceContract["Insurance.sol:Insurance"].abi);
        const deployedInsuranceContract = web3.eth.contract(insuranceabi).at(String(insuranceContractAddress));

        logger.info("Checking company details");
        var brokerObject = deployedInsuranceContract['getBroker'](web3.eth.coinbase);
        logger.debug("printing brokerObject : " + brokerObject);
        let brokerName = web3.toUtf8(brokerObject[1]);

        if(brokerName == ""){
            logger.warn("Details are empty. Setting redeploy to TRUE");
            configData.redeploy = true;
        }else{
            logger.info("Company is already registered : "+JSON.stringify(brokerObject));
        }
    }
    */

    logger.debug("New config data : " + JSON.stringify(configData));

    //update config.json
    fs.writeFileSync("./config.json", JSON.stringify(configData));
    logger.info("config.json file updated");

}

//get command line arguments
var cmdArgs = process.argv.slice(2);
logger.debug("args : " + cmdArgs);
//check args length ( should be 9. If not print usage)
if (cmdArgs.length == 7) {
    //deployContract(cmdArgs[0], cmdArgs[1], cmdArgs[2], cmdArgs[3], cmdArgs[4], cmdArgs[5], cmdArgs[6], cmdArgs[7], cmdArgs[8]);
    updateConfig(cmdArgs[0], cmdArgs[1], cmdArgs[2], cmdArgs[3], cmdArgs[4], cmdArgs[5], cmdArgs[6]);
} else {
    printUsage();
}

