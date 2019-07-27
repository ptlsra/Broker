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
        	
        	var ipAddress=ipAddress();
        	var portNo=portNo();
        	//var table="";
        	document.getElementById("policyPageTitle").innerHTML = "View Policy Details For Policy ID:"+policyId; 
        	  var table = document.getElementById("depTable");
           	 var row = table.insertRow(0);
     	    var cell1 = row.insertCell(0);
     	   var cell2 = row.insertCell(1);
     	  var cell3 = row.insertCell(2);
     	 var cell4 = row.insertCell(3);
     	 var cell5 = row.insertCell(4);
     	  cell1.innerHTML = "Dependent ID";
     	   cell2.innerHTML = "Name";
     	   cell3.innerHTML = "Age";
     	   cell4.innerHTML = "Gender";
     	  cell5.innerHTML = "Relation";
        	$.get("/getDependents?policyId="+policyId, function(response2){
           	//	alert(JSON.stringify(response2));
           		var numberOfDep=response2.dependents.length;
           		
           	
           	 for(var i=0;i<numberOfDep;i++){
           		  row = table.insertRow(i+1);
            	     cell1 = row.insertCell(0);
            	     var cell2 = row.insertCell(1);
                	  var cell3 = row.insertCell(2);
                	 var cell4 = row.insertCell(3);
                	 var cell5 = row.insertCell(4);
                	 
                	 var depName=response2.dependents[i].dependentName;
                	 depName = depName.split('_').join(' ');
            	    cell1.innerHTML = response2.dependents[i].dependentId;
            	    cell2.innerHTML = depName;
            	    cell3.innerHTML = response2.dependents[i].age;
            	    cell4.innerHTML = response2.dependents[i].gender;
            	    cell5.innerHTML = response2.dependents[i].relation;
           	 }
           	   
            });
        	
        	