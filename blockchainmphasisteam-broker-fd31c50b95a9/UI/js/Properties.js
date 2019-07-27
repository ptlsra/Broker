
/*
$.get("/getAppConfig", function (data) {
	alert(JSON.stringify(data));

});
*/
/*
function getIpAddress( callback ) {
    $.getJSON('/getAppConfig')
	.done(function(data) {
		callback(data.appIpAddress);
	});
}
*/
//var arr=[];
function ipAddress() {
	//var ipAddress="172.21.80.75";
	//var ipAddress="204.236.174.26";
	//var ipAddress="13.56.107.236";
	//var ipAddress="13.57.161.171";
	/*
	var ip = "";
 	$.get("/getAppConfig", function (data) {
		ip = data.appIpAddress;
		//alert(data.appIpAddress);
		//return ipAddress;
		//arr.push(ip);
		console.log("ip : "+ip);
		return ip;
	});
	//alert("returning ip "+arr[0]);
	//	return arr[0]; 
	//console.log("Printing data : "+JSON.stringify(data));
	//return data;
			 // The function returns the ipAddress
	//console.log("ip : "+ip);
	return ip;
	*/
	/*
	var data = $.getJSON("test.json");
	alert(JSON.stringify(data));
	*/
	/*
	$.get("/getAppConfig", function(test) {
		console.log(JSON.stringify(test));
	});
	*/
	return "localhost";
}

function portNo() {
	/*
	var portNo="5000";
	return portNo;              // The function returns the portNo
	*/
		var pNo = "5000";
		return pNo;
}

function ipfsPortNo() {
	var portNo="8090";
    return portNo;              // The function returns the ipfs portNo
}

function ipfsIpAddress() {
	//var ipAddress="13.57.161.171";
	//var ipAddress="204.236.174.26";
	//var ipAddress="13.56.107.236";
	/*
	var ipAddress = "172.21.80.75"
	return ipAddress;              // The function returns the ipAddress
	*/
	/*
	$.get("/getAppConfig", function (data) {
		var ipAddress = data.appIpAddress;
		return ipAddress;
	});
	*/
	return "localhost";
}

function explorerPath() {
// eg : http://172.21.80.75:8500/BlockchainExplorerV0.4/index.html
	var explorerPath="http://172.21.80.75:8500/BlockchainExplorerV0.4/index.html";
    return explorerPath;              // The function returns the ipAddress
}


