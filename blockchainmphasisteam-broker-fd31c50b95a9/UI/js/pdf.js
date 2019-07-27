var ipAddress = ipAddress();
var portNo = portNo();
var walletAddress = localStorage.getItem("walletAddress");
$.get("/getCustomerDetails?customerAddress=" + walletAddress, function (response) {
	// alert(JSON.stringify(response.people));
	//	alert(JSON.stringify(response));
	var customerName = response.customerName;
	customerName = customerName.split('_').join(' ');


	var amount = response.sumInsured;
	var strRepass = amount.split('.');
	if (strRepass[0].length >= 4) {
		strRepass[0] = strRepass[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
	}
	if (strRepass[1] && strRepass[1].length >= 4) {
		strRepass[1] = strRepass[1].replace(/(\d{3})/g, '$1 ');
	}
	strRepass.join('.');
	document.getElementById("customerName").innerHTML = customerName;
	var custAddress = response.customerAddress;
	document.getElementById("customerWalletAddress").innerHTML = custAddress.substr(0, 20) + '...';
	var emailId = response.emailId;
	document.getElementById("customerEmailId").innerHTML = emailId;
	document.getElementById("customerDOB").innerHTML = response.dob;
	document.getElementById("custTenure").innerHTML = response.tenure;
	document.getElementById("customerScheme").innerHTML = response.scheme;



	Number.prototype.padLeft = function (base, chr) {
		var len = (String(base || 10).length - String(this).length) + 1;
		return len > 0 ? new Array(len).join(chr || '0') + this : this;
	}


	var d = new Date,
		dformat = [(d.getMonth() + 1).padLeft(),
			d.getDate().padLeft(),
			d.getFullYear()
		].join('/') +
		' ' + [d.getHours().padLeft(),
			d.getMinutes().padLeft(),
			d.getSeconds().padLeft()
		].join(':');
	//$('#result').html(dformat);

	var amount = response.sumInsured;
	var strRepass = amount.split('.');
	if (strRepass[0].length >= 4) {
		strRepass[0] = strRepass[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
	}
	if (strRepass[1] && strRepass[1].length >= 4) {
		strRepass[1] = strRepass[1].replace(/(\d{3})/g, '$1 ');
	}
	strRepass.join('.');


	document.getElementById("applicationDate").innerHTML = dformat;
	document.getElementById("custAmount").innerHTML = "$ " + strRepass;







	/*     
		$("#custName").val(customerName);
		$("#userName").val(response.username);
		$("#walletAddress").val(response.customerAddress);
		$("#emailId").val(response.emailId);
		$("#scheme").val(response.scheme);
		$("#tenure").val(response.tenure);
		$("#sumInsured").val("$" +strRepass);
		$("#dob").val(response.dob);
		*/


});