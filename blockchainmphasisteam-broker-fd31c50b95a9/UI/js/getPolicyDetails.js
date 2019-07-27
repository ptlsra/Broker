//    http://172.21.80.81:5000/getPolicyDetails?policyId=117


var customerName = localStorage.getItem("customerName");
var customerName = customerName.split('_').join(' ');
var customerAddress = localStorage.getItem("walletAddress");



if (customerName == "") {
	window.location.href = "loginCustomer.html";
}

var getUrlParameter = function getUrlParameter(sParam) {
	var sPageURL = decodeURIComponent(window.location.search.substring(1)),
		sURLVariables = sPageURL.split('&'),
		sParameterName,
		i;

	for (i = 0; i < sURLVariables.length; i++) {
		sParameterName = sURLVariables[i].split('=');

		if (sParameterName[0] === sParam) {
			return sParameterName[1] === undefined ? true : sParameterName[1];
		}
	}
};


var policyId = getUrlParameter('policyId');
var ipAddress = ipAddress();
var portNo = portNo();
var ipfsIpAddress = ipfsIpAddress();
var ipfsPortNo = ipfsPortNo();


//$.get("http://"+ipAddress+":"+portNo+"/getPolicyDetails?policyId="+policyId, function(policyResponse){
$.get("/getPolicyDetails?policyId=" + policyId, function (policyResponse) {

	//$.get("http://"+ipAddress+":"+portNo+"/getCustomerDetails?customerAddress="+customerAddress, function(custResponse){
	$.get("/getCustomerDetails?customerAddress=" + customerAddress, function (custResponse) {

		$('#scheme').val(custResponse.scheme);
		$('#tenure').val(custResponse.tenure);

		var amounts = custResponse.sumInsured;

		var strRepass = amounts.toString().split('.');
		if (strRepass[0].length >= 4) {
			strRepass[0] = strRepass[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
		}
		if (strRepass[1] && strRepass[1].length >= 4) {
			strRepass[1] = strRepass[1].replace(/(\d{3})/g, '$1 ');
		}
		strRepass.join('.');


		$('#sumInsured').val(strRepass);

		document.getElementById("policyIds").innerHTML = policyId;
		document.getElementById("policyProvider").innerHTML = policyResponse.policyProviders.brokerName;
		document.getElementById("Insurer").innerHTML = policyResponse.policyProviders.insuranceName;

		document.getElementById("tpa").innerHTML = policyResponse.policyProviders.tpaName;

		var unixtimestamp = policyResponse.timeStamp;
		unixtimestamp = unixtimestamp.slice(0, -9);

		// Months array
		var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		// Convert timestamp to milliseconds
		var date = new Date(unixtimestamp * 1000);

		// Year
		var year = date.getFullYear();

		// Month
		var month = months_arr[date.getMonth()];

		// Day
		var day = date.getDate();

		// Hours
		var hours = date.getHours();

		// Minutes
		var minutes = "0" + date.getMinutes();

		// Seconds
		var seconds = "0" + date.getSeconds();

		// Display date time in MM-dd-yyyy h:m:s format
		var convdataTime = month + '-' + day + '-' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

		document.getElementById("issuedOn").innerHTML = convdataTime;


		var unixtimestamp = policyResponse.policyValidity;

		// Months array
		var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		// Convert timestamp to milliseconds
		var date = new Date(unixtimestamp * 1000);

		// Year
		var year = date.getFullYear();

		// Month
		var month = months_arr[date.getMonth()];

		// Day
		var day = date.getDate();

		// Hours
		var hours = date.getHours();

		// Minutes
		var minutes = "0" + date.getMinutes();

		// Seconds
		var seconds = "0" + date.getSeconds();

		// Display date time in MM-dd-yyyy h:m:s format
		var convdataTime2 = month + '-' + day + '-' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);

		document.getElementById("policyValidity").innerHTML = convdataTime2;


		$('#btnShow').click(function () {


			$("#dialog").dialog({

				maxWidth: 600,
				maxHeight: 450,
				width: 600,
				height: 450,
				modal: true

			});
			//$("#frame").attr("src", "http://"+ipfsIpAddress+":"+ipfsPortNo+"/ipfs/"+policyResponse.policyDocumentHash);
			$.get("/ipfs?fileHash=" + policyResponse.policyDocumentHash, function (custResponse) {
				$("#frame").attr("src", custResponse.ipfsUrl);
			});
			// }); 
		});
	});
});