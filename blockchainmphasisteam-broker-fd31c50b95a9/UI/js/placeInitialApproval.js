var ipAdd = ipAddress();
var port = portNo();



$('#submitInitialClaimRequest').click(function () {
	//alert('clicked');



	var claimId = $("#MclaimId").val();
	var policyId = $("#MpolicyId").val();



	document.getElementById("claimDetailsForm").style.display = "none";
	document.getElementById("custInfoForm").style.display = "none";
	document.getElementById("depForm").style.display = "none";





	$.ajax({

		dataType: "json",
		contentType: 'application/json; charset=UTF-8',
		url: "/acceptClaim?claimId=" + claimId + "&policyId=" + policyId,
		type: "POST",
		global: false,
		async: false,
		success: function (result) {
			//alert(result);

			document.getElementById("txIdData").innerHTML = result.txId;
			document.getElementById("txMessageForm").style.display = "block";


			setTimeout(function () {

				window.location.href = "admin.html";
			}, 2000);
			// ViewTokenForBaggage.html?baggageId=5615192
		}
	});





});