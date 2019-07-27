
var tempLists = [];
var dataSets = [];



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

var walletAddress = getUrlParameter('walletAddress');


//	$.get("http://"+ipAdd+":"+port+"/getCustomerPolicies?customerAddress="+walletAddress, function(response){
$.get("/getCustomerPolicies?customerAddress=" + walletAddress, function (response) {
	//  alert(JSON.stringify(response));
	$.each(response.policies, function (i, item) {

		var unixtimestamp = item.policyValidity;

		// Months array
		var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		// Convert timestamp to milliseconds
		var date = new Date(unixtimestamp * 1000);

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
		var convdataTime = month + '-' + day + '-' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);


		var policyValidity = convdataTime;



		var unixtimestamp = item.timestamp;
		unixtimestamp = unixtimestamp.slice(0, -9);

		// Months array
		var months_arr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		// Convert timestamp to milliseconds
		var date = new Date(unixtimestamp * 1000);

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
		var convdataTime = month + '-' + day + '-' + year + ' ' + hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);


		//tempLists.push(i+1,item.policyId,convdataTime,policyValidity,'<button onclick=myFunction('+policyValidity+')>Click me</button>','<a  href=ViewAllPolicyForCustomer.html?walletAddress='+item.walletAddress+'> View Details');
		tempLists.push(i + 1, item.policyId, convdataTime, policyValidity, '<a  href=ViewPolicyDetailsAdmin.html?walletAddress=' + walletAddress + '&policyId=' + item.policyId + '> View Details');
		dataSets.push(tempLists);
		tempLists = [];




	});


	$('#viewAllCustomers').DataTable({
		data: dataSets,
		columns: [
			{ title: "SNo" },
			{ title: "Policy ID" },
			{ title: "Policy Issued " },
			{ title: "Policy Validity" },
			// {title: "Button"},
			{ title: "Action" }
		]
	});



});
