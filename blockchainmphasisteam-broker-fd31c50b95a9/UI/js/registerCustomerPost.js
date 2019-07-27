var ipAdd = ipAddress();
var port = portNo();

$('#regButtonSubmit').click(function () {
	//alert('clicked');

	var firstName = $("#f1-first-name").val();
	var lastName = $("#f1-last-name").val();
	var dob = $("#f1-dob").val();
	var userName = $("#f1-userName").val();
	var email = $("#f1-email").val();
	var password = $("#f1-password").val();

	document.getElementById("registerCustomerForm").style.display = "none";


	document.getElementById("txWaiting").style.display = "block";



	$.ajax({

		dataType: "json",
		contentType: 'application/json; charset=UTF-8',
		url: "/registerCustomer?customerName=" + firstName + "_" + lastName + "&userName=" + userName + "&password=" + password + "&dob=" + dob + "&emailId=" + email,
		type: "POST",
		global: false,
		async: false,
		success: function (result) {
			//alert(result);
			document.getElementById("txWaiting").style.display = "none";
			document.getElementById("txIdData").innerHTML = result.txId;
			document.getElementById("txMessageForm").style.display = "block";


			setTimeout(function () {

				window.location.href = "loginCustomer.html";
			}, 2000);
			// ViewTokenForBaggage.html?baggageId=5615192
		}
	});

});