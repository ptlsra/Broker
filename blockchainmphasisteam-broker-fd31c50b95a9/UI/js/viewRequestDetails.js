var ipAdd = ipAddress();
var port = portNo();
$('#lengths').hide();
$('#policyValidity').hide();
$('#walletAddress').hide();
$('#requestId').hide();
$('#userNames').hide();
$('#schemes').hide();
$('#tenures').hide();
$('#sumInsureds').hide();

$('#txMessageForm').hide();


var ipAddress = ipAddress();
var portNo = portNo();

/*
 *	Set Insurance Company Value in #selectInsCompany drop down.
 */



$.getJSON("/getInsuranceList", function (response) {

	$.each(response, function (i, item) {
		$('#selectInsCompany').append($('<option>', {
				value: item.insuranceAddress,
				text: item.insuranceName
			}

		));
	});
});

/*
 *	Set TPA Company Value in #getTpaList drop down.
 */


$.getJSON("/getTpaList", function (response2) {

	$.each(response2, function (i, item) {
		$('#getTpaList').append($('<option>', {
				value: item.tpaAddress,
				text: item.tpaName
			}

		));
	});
});




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

var requestId = getUrlParameter('requestId');

$('#requestId').val(requestId);
var userName = getUrlParameter('userName');
$('#userNames').val(userName);

var customerAddress = getUrlParameter('customerAddress');
$('#walletAddress').val(customerAddress);

document.getElementById("intro").innerHTML = "View Request Information For Request ID:" + requestId;

/*
 *	Get Request Details And Customer Details.
 */

$.get("/getPolicyRequestListByRequestId?requestId=" + requestId + "&userName=" + userName, function (response) {
	$.get("/getCustomerDetails?customerAddress=" + customerAddress, function (response2) {

		//alert(JSON.stringify(response));
		$('#policyValidity').val(response.policyValidity);


		var customerName = response.customerName;
		var replacedcustomerName = customerName.split('_').join(' ');
		document.getElementById("customerName").innerHTML = replacedcustomerName;
		document.getElementById("customerAddress").innerHTML = response.customerAddress.substr(0, 20) + '...';



		var amount = response.sumInsured;
		var strRepass = amount;

		var strRepass = amount.split('.');
		if (strRepass[0].length >= 4) {
			strRepass[0] = strRepass[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
		}
		if (strRepass[1] && strRepass[1].length >= 4) {
			strRepass[1] = strRepass[1].replace(/(\d{3})/g, '$1 ');
		}
		strRepass.join('.');

		// document.getElementById("sumInsured").innerHTML = "$"+strRepass;
		document.getElementById("sumInsured").innerHTML = strRepass;
		document.getElementById("tenure").innerHTML = response.tenure;
		document.getElementById("scheme").innerHTML = response.scheme;

		$('#schemes').val(response.scheme);
		$('#tenures').val(response.tenure);
		$('#sumInsureds').val(strRepass);
	});




});

/*
 *	Get List Of Dependents For Customer.
 */

$.get("/getDependentsList?requestId=" + requestId + "&userName=" + userName, function (response3) {

	var count = 0;

	var length = response3.length;


	var dep1 = $('#Div1').val();
	count++;
	for (var i = 0; i < length; i++) {
		var input = document.createElement('input');
		var input2 = document.createElement('input');

		var input3 = document.createElement('input');
		input.type = "text";
		input.setAttribute("id", "Div" + count);
		input.setAttribute("name", "Div" + count);
		var depName = response3[i].dependentName;
		depName = depName.split('_').join(' ');
		input.setAttribute("value", depName);

		$("#Div" + count).prop("readonly", true);
		input.style.width = '150px'; // CSS property

		input.setAttribute("readonly", true);
		document.getElementById("parent").appendChild(input);

		input2.type = "text";
		input2.setAttribute("id", "Age" + count);
		input2.setAttribute("name", "Age" + count);
		input2.setAttribute("value", response3[i].age);
		input2.setAttribute("readonly", true);
		$("#Age" + count).prop("readonly", true);
		input2.style.width = '150px'; // CSS property

		input2.style.marginLeft = "15px";
		input2.style.marginTop = "15px";
		document.getElementById("parent").appendChild(input2);

		var array = ["Select Your Gender", "Male", "Female"];

		//Create and append select list
		var selectList = document.createElement('input');

		selectList.type = "text";
		selectList.setAttribute("id", "mySelect" + count);
		selectList.setAttribute("name", "mySelect" + count);
		selectList.setAttribute("value", response3[i].gender);

		selectList.setAttribute("readonly", true);

		selectList.style.width = '150px';

		selectList.style.marginLeft = "15px";

		//Create and append the options


		document.getElementById("parent").appendChild(selectList);


		input3.type = "text";
		input3.setAttribute("id", "Relation" + count);
		input3.setAttribute("name", "Relation" + count);
		input3.setAttribute("placeholder", "Enter Relation ");
		input3.setAttribute("value", response3[i].relation);
		input3.setAttribute("readonly", true);


		input3.style.width = '150px'; // CSS property

		input3.style.marginLeft = "15px";
		document.getElementById("parent").appendChild(input3);

	}

	if (count > 3) {

	}


	$('#lengths').val(length);

});


/*
   	
   	// Get the modal
   	var modal = document.getElementById('myModal');// Get the modal
  
   	var span = document.getElementsByClassName("close")[0];
   	
 // When the user clicks on the button, open the modal
 
   	$("#reqSubmit").click(function(){
   	 modal.style.display = "block";
   	}); 
 

 // When the user clicks on <span> (x), close the modal
 span.onclick = function() {
     modal.style.display = "none";
 }

 // When the user clicks anywhere outside of the modal, close it
 window.onclick = function(event) {
     if (event.target == modal) {
         modal.style.display = "none";
     }
     
     
     
 } 
	*/



$('#reqSubmit').click(function () {
	//alert('clicked');

	// Get the modal
	var modal = document.getElementById('myModal'); // Get the modal

	var span = document.getElementsByClassName("close")[0];

	// When the user clicks on the button, open the modal


	modal.style.display = "block";



	span.onclick = function () {
		modal.style.display = "none";
	}

	window.onclick = function (event) {
		if (event.target == modal) {
			modal.style.display = "none";
		}

	}
	var customerAddress = $("#walletAddress").val();
	var policyValidity = $("#policyValidity").val();
	var selectInsCompany = $("#selectInsCompany").val();
	var getTpaList = $("#getTpaList").val();
	var requestId = $("#requestId").val();
	var userName = $("#userNames").val();
	var scheme = $("#schemes").val();

	var tenure = $("#tenures").val();
	var sumInsureds = $("#sumInsureds").val();

	sumInsured = sumInsureds.split(",").join("");


	$.ajax({

		dataType: "json",
		contentType: 'application/json; charset=UTF-8',
		url: "/createPolicy?customerAddress=" + customerAddress + "&policyValidity=" + policyValidity + "&requestId=" + requestId + "&tpaAddress=" + getTpaList + "&insuranceAddress=" + selectInsCompany + "&userName=" + userName + "&scheme=" + scheme + "&tenure=" + tenure + "&sumInsured=" + sumInsured,
		type: "POST",
		global: false,
		async: false,
		success: function (result) {
			//alert(result);
			modal.style.display = "none";
			document.getElementById("mainForm").style.display = "none";
			document.getElementById("policyTable").style.display = "none";

			document.getElementById("txIdData").innerHTML = result.txId;
			document.getElementById("txMessageForm").style.display = "block";

			setTimeout(function () {

				window.location.href = "admin.html";
			}, 2000);
			// ViewTokenForBaggage.html?baggageId=5615192
		}
	});





});