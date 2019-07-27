

	 var tempLists=[];
	 var dataSets=[];
	 

        	
        	var ipAddress=ipAddress();
        	var portNo=portNo();
        	var userName=localStorage.getItem("userName");
        	var walletAddress=localStorage.getItem("walletAddress");
        	
        	var customerName= localStorage.getItem("customerName");
        	var customerName = customerName.split('_').join(' ');
        	
        	if(customerName==""){
        		window.location.href="loginCustomer.html";
        	}
        	
        	document.getElementById("policyPageTitle").innerHTML = "All Policy For "+customerName; 

       	 

        	 
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
               	
             // $.get("http://"+ipAddress+":"+port+"/getAllWallets", function(response){
       	//$.get("http://"+ipAddress+":"+portNo+"/getCustomerPolicies?customerAddress="+walletAddress, function(response){
		$.get("/getCustomerPolicies?customerAddress="+walletAddress, function(response){
       	 //  alert(JSON.stringify(response));
 			$.each(response.policies, function(i, item) {
 				//alert(JSON.stringify(item));
 				 var unixtimestamp = item.policyValidity;
 				 
 				// alert(unixtimestamp)
 			//	unixtimestamp=unixtimestamp.slice(0,-9);
 				//alert(unixtimestamp)
 				 // Months array
 				 var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

 				 // Convert timestamp to milliseconds
 				 var date = new Date(unixtimestamp*1000);

 				 // Year
 				 var year = date.getFullYear();

 				 // Month
 				 var month = months_arr[date.getMonth()];

 				 // Day
 				 var day = date.getDate();

 				 // Hours
 				 var hours = date.getHours();

 				 // Minutes
 				 var minutes = "0" + date.getMinutes();

 				 // Seconds
 				 var seconds = "0" + date.getSeconds();

 				 // Display date time in MM-dd-yyyy h:m:s format
 				 var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
 				 
 				 
 				 
 				 var unixtimestamp = item.timestamp;
 				unixtimestamp=unixtimestamp.slice(0,-9);

 				 // Months array
 				 var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

 				 // Convert timestamp to milliseconds
 				 var date = new Date(unixtimestamp*1000);

 				 // Year
 				 var year = date.getFullYear();

 				 // Month
 				 var month = months_arr[date.getMonth()];

 				 // Day
 				 var day = date.getDate();

 				 // Hours
 				 var hours = date.getHours();

 				 // Minutes
 				 var minutes = "0" + date.getMinutes();

 				 // Seconds
 				 var seconds = "0" + date.getSeconds();

 				 // Display date time in MM-dd-yyyy h:m:s format
 				 var convdataTime2 = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
 				
 				// document.getElementById('datetime').innerHTML = convdataTime;
 				 
 				$.ajax({
 					 
				 	dataType: "json",
		            //url: "http://"+ipAddress+":"+portNo+"/getDependents?policyId="+item.policyId,
		            url: "/getDependents?policyId="+item.policyId,
					global: false,
		            type: 'GET',
		            async: false, //blocks window close
		            success: function(response2) {
		            	//alert(JSON.stringify(response2));
		            	var numberOfDep=response2.dependents.length;
		            	if(numberOfDep==0){
		            		tempLists.push(i+1,item.policyId,convdataTime2,convdataTime,'<a  href=ViewPolicyDetails.html?policyId='+item.policyId+'> View Details');
		     				
		    				dataSets.push(tempLists);
		    				tempLists=[];
			       
			    			 
 					}
		            	else{
 				
	tempLists.push(i+1,item.policyId,convdataTime2,convdataTime,'<a  href=ShowPolicyDependents.html?policyId='+item.policyId+'> View Details');
 		 				
 						dataSets.push(tempLists);
 						tempLists=[];
 		 				}
 		        	
 					}
		            	
		            
		        });
 				 
 				 
 		       
 		        
 		   	});	
		
				modal.style.display = "none";

		$('#allTx').DataTable( {
			data: dataSets,
			columns: [
				 { title: "SNo" },
			    { title: "ID" },
			    {title:"Issued On"},
			    {title: "Validity "},
			    {title:"Action"}
			    
			    
			    
			    
			    

			  
			]
    		
 			 });	
        });