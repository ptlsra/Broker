	var customerName= localStorage.getItem("customerName");
        	var customerName = customerName.split('_').join(' ');
        	var customerAddress= localStorage.getItem("walletAddress");

        	
        	
        	if(customerName==""){
        		window.location.href="loginCustomer.html";
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
        	$('#policyId').val(policyId);
        	$('#customerAddress').val(customerAddress);
        	
        	
        	document.getElementById("policyPageTitle").innerHTML = "View Policy Details For Policy ID:"+policyId; 
