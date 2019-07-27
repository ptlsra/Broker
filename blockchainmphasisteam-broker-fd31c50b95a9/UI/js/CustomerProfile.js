var ipAdd = ipAddress();
var port = portNo();
var walletAddress = localStorage.getItem("walletAddress");

if (walletAddress == "") {
	window.location.href = "loginCustomer.html";
}
//$.get("http://"+ipAdd+":"+port+"/getCustomerDetails?customerAddress="+walletAddress, function(response){
$.get("/getCustomerDetails?customerAddress=" + walletAddress, function (response) {

	// alert(JSON.stringify(response.people));
	//alert(JSON.stringify(response));
	var customerName = response.customerName;
	customerName = customerName.split('_').join(' ');

	/*

	var amount=response.sumInsured;
	   var strRepass = amount.split('.');
		if (strRepass[0].length >= 4) {
			strRepass[0] = strRepass[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
		}
		if (strRepass[1] && strRepass[1].length >= 4) {
			strRepass[1] = strRepass[1].replace(/(\d{3})/g, '$1 ');
		}
		strRepass.join('.');
		*/


	$("#name").val(customerName);
	$("#userName").val(response.username);
	$("#walletAddress").val(response.customerAddress);
	$("#customerAddress").val(response.customerAddress);
	$("#emailId").val(response.emailId);
	//$("#scheme").val(response.scheme);
	//$("#tenure").val(response.tenure);
	//$("#sumInsured").val(response.sumInsured);
	$("#dob").val(response.dob);


});


$("#name").prop("readonly", true);
$("#userName").prop("readonly", true);
$("#walletAddress").prop("readonly", true);
$("#emailId").prop("readonly", true);
$("#scheme").prop("readonly", true);
$("#tenure").prop("readonly", true);
$("#sumInsured").prop("readonly", true);
$("#dob").prop("readonly", true);


