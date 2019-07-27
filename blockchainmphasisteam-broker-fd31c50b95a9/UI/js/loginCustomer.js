var ipAdd = ipAddress();
var port = portNo();

$("#incorrectForm").hide();

/*
$("#userName").change(function(){
	
	var email = $("#userName").val();

	if (email !== "") {  // If something was entered
		if (isValidEmailAddress(email)==false) {
			var element=document.getElementById("userName");
			element.setCustomValidity("Not a valid email Address.");
		//	$('#userName').get(0).setCustomValidity('This not a valid email address');
			return true;  
		}
	}else{
		$('#userName').get(0).setCustomValidity('This field cannot be empty');
			return true;  
	} 
	return false;
  }); 

  function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
	return pattern.test(emailAddress);
};
*/



$("#loginData").submit(function (e) {
	e.preventDefault();

	console.log("ipAdd : " + ipAdd);
	console.log("port : " + port);
	$("#loginData").hide();
	/*
	$.getJSON('test.json', function(obj) {
		console.log(JSON.stringify(obj));
	});
	*/
	var userName = $("#userName").val();
	var password = $("#passwordvalue").val();

	

	


	$.ajax({

		dataType: "json",
		contentType: 'application/json; charset=UTF-8',
		//url: "http://" + ipAdd + ":" + port + "/checkCredentials?userName=" + userName + "&password=" + password,
		url: "/checkCredentials?userName=" + userName + "&password=" + password,
		type: "GET",
		global: false,
		async: false,
		success: function (result) {
			//alert(JSON.stringify(result));
			//	{"customerDetails":{"userName":"adamJones@gmail.com","walletAddress":"0xa9324707dabfb21953cb589fc6c45ee0d99b5863"},"status":true}

			var responseStatus = result.status;
			//alert(responseStatus);
			if (responseStatus == true) {

				//	alert(result.customerDetails.walletAddress);
				var walletAddress = result.customerDetails.walletAddress;
				var customerName = result.customerDetails.customerName;

				//alert(customerName);
				//	alert("yes");
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

			/*
	        document.getElementById("txId").innerHTML = result.txId;
	      
	        
	        }
	        
	        setTimeout(function(){ 
	            
	           window.location.href="baggage.html";
	        }, 2000);
	        
	        */

		}
	});

});
