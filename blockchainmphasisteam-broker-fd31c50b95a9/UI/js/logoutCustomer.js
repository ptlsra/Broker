var ipAdd = ipAddress();
var port = portNo();


localStorage.setItem("walletAddress", "");
localStorage.setItem("customerName", "");
localStorage.setItem("userName", "");


$("#incorrectForm").hide();

$("#loginData").submit(function (e) {
	e.preventDefault();

	console.log("ipAdd : " + ipAdd);
	console.log("port : " + port);
	$("#loginData").hide();
	
	var userName = $("#userName").val();
	var password = $("#passwordvalue").val();

	

	


	$.ajax({

		dataType: "json",
		contentType: 'application/json; charset=UTF-8',
		url: "/checkCredentials?userName=" + userName + "&password=" + password,
		type: "GET",
		global: false,
		async: false,
		success: function (result) {
		
			var responseStatus = result.status;
			if (responseStatus == true) {

				var walletAddress = result.customerDetails.walletAddress;
				var customerName = result.customerDetails.customerName;

				localStorage.setItem("walletAddress", walletAddress);
				localStorage.setItem("customerName", customerName);
				localStorage.setItem("userName", userName);
				localStorage.setItem("password", password);
				customerName = customerName.split('_').join(' ');



				//document.getElementById("sucessMessage").innerHTML = "Welcome "+customerName;


				window.location.href = "CustomerDashboard.html";
				return false;
			} else {
				$("#loginData").hide();
				$("#incorrectForm").show();
				document.getElementById("incorrectMessage").innerHTML = "Incorrect Credentials.Please Wait while you are redirected";
				setTimeout(function () {

					window.location.href = "loginCustomer.html";
					return false;
				}, 2000);
			}

	

		}
	});

});
