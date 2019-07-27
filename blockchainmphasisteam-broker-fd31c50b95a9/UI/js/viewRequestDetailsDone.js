 $('#lengths').hide();
 $('#policyValidity').hide();
 $('#walletAddress').hide();
 $('#requestId').hide();
 $('#userNames').hide();



 var ipAdd = ipAddress();
 var port = portNo();






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

 $.get("/getPolicyRequestListByRequestId?requestId=" + requestId + "&userName=" + userName, function (response) {
 	//alert(JSON.stringify(response));
 	$.get("/getCustomerDetails?customerAddress=" + customerAddress, function (response2) {
 	//	alert(JSON.stringify(response2));


 		var customerName = response.customerName;
		 var replacedcustomerName = customerName.split('_').join(' ');
		 var scheme=response.scheme;
 		document.getElementById("customerName").innerHTML = replacedcustomerName;
 		document.getElementById("customerAddress").innerHTML = response.customerAddress.substr(0, 20) + '...';

		  scheme = scheme.split('_').join(' ');

 		document.getElementById("scheme").innerHTML = scheme;


 		var amount = response2.sumInsured;
 		var strRepass = amount;

 		var strRepass = amount.split('.');
 		if (strRepass[0].length >= 4) {
 			strRepass[0] = strRepass[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
 		}
 		if (strRepass[1] && strRepass[1].length >= 4) {
 			strRepass[1] = strRepass[1].replace(/(\d{3})/g, '$1 ');
 		}
 		strRepass.join('.');

 		document.getElementById("sumInsured").innerHTML = strRepass;

 		document.getElementById("tenure").innerHTML = response2.tenure;

 		/*
  	    var textBox = document.createElement("input");
  	    textBox.setAttribute("id", "Div"+length);
  	    document.getElementById("parent").appendChild(textBox);
  	    */
 	});




 });



 $.get("/getDependentsList?requestId=" + requestId + "&userName=" + userName, function (response3) {

 	var count = 0;

 	//alert(response3.length);
 	var length = response3.length;
 	//alert(length);


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
 		//txtOffsetDateCleared.setAttribute('size',10); // HTML attribute
 		input.style.width = '150px'; // CSS property

 		input.setAttribute("readonly", true);
 		document.getElementById("parent").appendChild(input);

 		input2.type = "text";
 		input2.setAttribute("id", "Age" + count);
 		input2.setAttribute("name", "Age" + count);
 		input2.setAttribute("value", response3[i].age);
 		input2.setAttribute("readonly", true);
 		$("#Age" + count).prop("readonly", true);
 		//txtOffsetDateCleared.setAttribute('size',10); // HTML attribute
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
 		//	var depName=response3[i].gender;
 		//  selectList.id = "mySelect"+count;
 		// selectList.name = "mySelect"+count;
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

 		//txtOffsetDateCleared.setAttribute('size',10); // HTML attribute
 		input3.style.width = '150px'; // CSS property

 		input3.style.marginLeft = "15px";
 		// $("#Relation"+count).prop("readonly", true);
 		document.getElementById("parent").appendChild(input3);
 		//$('#Submit').show();
 	}

 	if (count > 3) {

 	}

 	// $('#length').val(count);
 	$('#lengths').val(length);

 });