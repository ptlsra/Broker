
    $(document).ready(function() {
    	$('#policyId').hide();
    	$('#length').hide();
    	$('#Submit').hide();
    	$('#customerAddress').hide();
    	$('#userNames').hide();
    	$('#customerName').hide();
    	//customerName
    	
    	var customerNames=localStorage.getItem("customerName");
    	//alert(customerNames);
    	var userNames= localStorage.getItem("userName");
    	$('#userNames').val(userNames);
    	$('#customerName').val(customerNames);
    	
    	var count=0;
    	addBox = function(){
    		//alert($("input:text").length);
    		var length=$("input:text").length;
    		
    		var dep1=$('#Div1').val();
    		count++;
    		if(count >0 && count<4 ){
    			var input = document.createElement('input'); 
    			var input2 = document.createElement('input'); 
    			
    			var input3 = document.createElement('input'); 
        		input.type = "text"; 
        		input.setAttribute("id", "Div"+count);
        		input.setAttribute("name", "Div"+count);
				input.setAttribute("placeholder", "Enter Dependent's Name");

        		$("#Div"+count).prop('required',true);
        		//txtOffsetDateCleared.setAttribute('size',10); // HTML attribute
        		input.style.width = '200px';   // CSS property
        		  document.getElementById("parent").appendChild(input);
        		  
        		input2.type = "number"; 
        		input2.setAttribute("id", "Age"+count);
        		input2.setAttribute("name", "Age"+count);
        		input2.setAttribute("placeholder", "Enter Age");
				$("#Age"+count).prop('required',true);

        		//txtOffsetDateCleared.setAttribute('size',10); // HTML attribute
        		input2.style.width = '200px';   // CSS property
        		
        		input2.style.marginLeft = "5px";
        	    document.getElementById("parent").appendChild(input2);
        	    
        	    var array = ["Male","Female"];

        	  //Create and append select list
        	  var selectList = document.createElement("select");
        	  selectList.id = "mySelect"+count;
        	  selectList.name = "mySelect"+count;
        	  
        	 
        	  selectList.style.marginLeft = "5px";

        	  //Create and append the options
        	  for (var i = 0; i < array.length; i++) {
        	      var option = document.createElement("option");
        	      option.value = array[i];
        	      option.text = array[i];
        	      selectList.appendChild(option);
        	  }
        	  
        	  document.getElementById("parent").appendChild(selectList);
        	  
        	  
        	  input3.type = "text"; 
      		input3.setAttribute("id", "Relation"+count);
      		input3.setAttribute("name", "Relation"+count);
			  input3.setAttribute("placeholder", "Enter Relation ");
			  $("#Relation"+count).prop('required',true);


      		
      		//txtOffsetDateCleared.setAttribute('size',10); // HTML attribute
      		input3.style.width = '200px';   // CSS property
      		
      		input3.style.marginLeft = "5px";
      	    document.getElementById("parent").appendChild(input3);
    			$('#Submit').show();
    		}
    		
    		if(count>3){
    			
    		}
    	
    	    $('#length').val(count);
    		/*
    	    var textBox = document.createElement("input");
    	    textBox.setAttribute("id", "Div"+length);
    	    document.getElementById("parent").appendChild(textBox);
    	    */
    	}
 
    });