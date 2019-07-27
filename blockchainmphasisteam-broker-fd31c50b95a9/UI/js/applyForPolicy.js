var ipAdd = ipAddress();
var port = portNo();

/*
var mubsisapi = {
		step1   : function(){alert("a"); var a="";this.a="ya"; return this;}, 
		step2   : function(){alert("b"); alert(this.a)}
	}

mubsisapi.step1().step2();
	
	
*/

/*
var mubsisapi = {
		step1   :
			function(){
			alert("a");
			var a="";
			this.a="ya"; 
			return this;}, 
		step2   : function(){alert("b"); alert(this.a)}
	}

mubsisapi.step1().step2();
*/
$("#txMessageForm").hide();
/*
	

	
"http://"+ipProperty.getNodeIpAndPortNumber()+"/applyForPolicy?customerName="+customerName+"&customerAddress="+customerAddress+"&userName="+userName+"&policyValidity="+policyValidity+"&sumInsured="+amount+"&scheme="+scheme+"&tenure="+tenure);
*/

$("#secondForm").submit(function (e) {
	e.preventDefault();

	


	var customerAddress = $("#customerAddress").val();
	var policyValidity = $("#policyValidity").val();
	var userName = $("#userNames").val();
	var customerName = $("#customerName").val();

	var amount = $("#amount").val();
	var scheme = $("#scheme").val();
	var tenure = $("#tenure").val();


	var length = $("#length").val();
	//alert(length);
	var actualLength = length;
	length = parseInt(length);
	length = length + 1;
	var index = 1;

	index = parseInt(index);


	var requestIdArray = [];
	var executionOrder = {
		requestPolicy:
			function () {
				requestIdArray = [];
				$.ajax({

					dataType: "json",
					contentType: 'application/json; charset=UTF-8',
					//url: "http://"+ipAdd+":"+port+"/applyForPolicy?customerName="+customerName+"&customerAddress="+customerAddress+"&userName="+userName+"&policyValidity="+policyValidity+"&sumInsured="+amount+"&scheme="+scheme+"&tenure="+tenure,
					url: "/applyForPolicy?customerName=" + customerName + "&customerAddress=" + customerAddress + "&userName=" + userName + "&policyValidity=" + policyValidity + "&sumInsured=" + amount + "&scheme=" + scheme + "&tenure=" + tenure,
					type: "POST",
					global: false,
					async: false,
					success: function (result) {

						var requestId = result.requestId;
						//  document.getElementById("txId").innerHTML = result.txId;

						requestIdArray.push(requestId);

						// ViewTokenForBaggage.html?baggageId=5615192
					}
				});

				// 	this.a="ya"; 
				this.requestId = requestIdArray[0];

				return this;


			},
		addDependents: function () {

			//alert(this.requestId)

			var requestId = this.requestId;

			for (index = 1; index < length; index++) {
				if (index == actualLength) {

					var paramName = '#Div' + index.toString();

					var name = $(paramName).val();

					var paramAge = '#Age' + index.toString();

					var age = $(paramAge).val();

					var paramSelect = '#mySelect' + index.toString();

					var gender = $(paramSelect).val();

					var paramRelation = '#Relation' + index.toString();

					var relation = $(paramRelation).val();


					name = name.split("_").join(" ");







					$.ajax({

						dataType: "json",
						contentType: 'application/json; charset=UTF-8',
						//url: "http://"+ipAdd+":"+port+"/saveDependents?userName="+userName+"&dependentName="+name+"&age="+age+"&gender="+gender+"&relation="+relation+"&requestId="+requestId,
						url: "/saveDependents?userName=" + userName + "&dependentName=" + name + "&age=" + age + "&gender=" + gender + "&relation=" + relation + "&requestId=" + requestId,
						type: "POST",
						global: false,
						async: false,
						success: function (response) {

							//alert("added all Dependents");
							// var element = document.getElementById(id);
							//$('#txMessageForm').show();
							//var txMessageForm = document.getElementById('txMessageForm');
							document.getElementById("txMessageForm").style.display = "block";

							// ViewTokenForBaggage.html?baggageId=5615192
						}
					});




				} else {
					var paramName = '#Div' + index.toString();

					var name = $(paramName).val();

					var paramAge = '#Age' + index.toString();

					var age = $(paramAge).val();

					var paramSelect = '#mySelect' + index.toString();

					var gender = $(paramSelect).val();

					var paramRelation = '#Relation' + index.toString();

					var relation = $(paramRelation).val();


					name = name.split("_").join(" ");







					$.ajax({

						dataType: "json",
						contentType: 'application/json; charset=UTF-8',
						//url: "http://" + ipAdd + ":" + port + "/saveDependents?userName=" + userName + "&dependentName=" + name + "&age=" + age + "&gender=" + gender + "&relation=" + relation + "&requestId=" + requestId,
						url: "/saveDependents?userName=" + userName + "&dependentName=" + name + "&age=" + age + "&gender=" + gender + "&relation=" + relation + "&requestId=" + requestId,
						type: "POST",
						global: false,
						async: false,
						success: function (response) {



							// ViewTokenForBaggage.html?baggageId=5615192
						}
					});

				}
			}
			return this;
		},
		redirectPage: function () {


			document.location.href = "CustomerDashboard.html", true;
			return false;
		}
	}

	






	for (index = 1; index < length; index++) {
		if (index == actualLength) {

			var paramName = '#Div' + index.toString();

			var name = $(paramName).val();

			var paramAge = '#Age' + index.toString();

			var age = $(paramAge).val();

			var paramSelect = '#mySelect' + index.toString();

			var gender = $(paramSelect).val();

			var paramRelation = '#Relation' + index.toString();

			var relation = $(paramRelation).val();



			if(name!="" && age!="" && relation!=""){
				$("#firstForm").hide();
				$("#secondForm").hide();
				executionOrder.requestPolicy().addDependents().redirectPage();
			}else if(name==""){
				$(paramName).addClass("incorrect");

			}else if(age==""){
				//var input=document.getElementById(paramAge);
				//input.setAttribute("placeholder", "Please Enter  Dependent's Age");
				$(paramAge).addClass("incorrect");
			}else if(relation==""){
				//var input=document.getElementById(paramRelation);
				//input.setAttribute("placeholder", "Please Enter  Dependent's Relation");
				$(paramRelation).addClass("incorrect");
			}

			
		}else{


			var paramName = '#Div' + index.toString();

			var name = $(paramName).val();

			var paramAge = '#Age' + index.toString();

			var age = $(paramAge).val();

			var paramSelect = '#mySelect' + index.toString();

			var gender = $(paramSelect).val();

			var paramRelation = '#Relation' + index.toString();

			var relation = $(paramRelation).val();



			if(name!="" && age!="" && relation!=""){
			
			}else if(name==""){
				$(paramName).addClass("incorrect");

			}else if(age==""){
				//var input=document.getElementById(paramAge);
				//input.setAttribute("placeholder", "Please Enter  Dependent's Age");
				$(paramAge).addClass("incorrect");
			}else if(relation==""){
				//var input=document.getElementById(paramRelation);
				//input.setAttribute("placeholder", "Please Enter  Dependent's Relation");
				$(paramRelation).addClass("incorrect");
			}
		}
	}




	/*
	 setTimeout(function(){ 

		 $.ajax({
		 	
		     dataType:"json",
		     contentType: 'application/json; charset=UTF-8',
		     url: "http://"+ipAdd+":"+port+"/applyForPolicy?customerName="+customerName+"&customerAddress="+customerAddress+"&userName="+userName+"&policyValidity="+policyValidity+"&sumInsured="+amount+"&scheme="+scheme+"&tenure="+tenure,
		     type:"POST",
		     global:false,
		     async:false, 
		     success: function(result){
		 	//alert(result);
		 	
		         document.getElementById("txId").innerHTML = result.txId;
		         $("#myModal").modal();
		         
		         setTimeout(function(){ 
		             
		            window.location.href="baggage.html";
		         }, 2000);
		         // ViewTokenForBaggage.html?baggageId=5615192
		  	}
		  });
		  	 }, 1000);
*/
});