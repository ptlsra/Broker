

var tempLists = [];
var dataSets = [];



var ipAddress = ipAddress();
var portNo = portNo();
var userName = localStorage.getItem("userName");

var customerName = localStorage.getItem("customerName");
var customerName = customerName.split('_').join(' ');

if (customerName == "") {
	window.location.href = "loginCustomer.html";
}

document.getElementById("txPageTitle").innerHTML = "All Transactions For " + customerName;





// $.get("http://"+ipAddress+":"+port+"/getAllWallets", function(response){
//	$.get("http://"+ipAddress+":"+portNo+"/getCustomerTransactions?userName="+userName, function(response){
//  alert(JSON.stringify(response));
$.get("/getCustomerTransactions?userName=" + userName, function (response) {
	$.each(response, function (i, item) {
		//alert(JSON.stringify(item));


		var unixtimestamp = item.dateTime;
		unixtimestamp = unixtimestamp.toString().slice(0, -9);

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

		// document.getElementById('datetime').innerHTML = convdataTime;
		var desc = item.description;
		var replacedDesc = desc.split('_').join(' ');


		tempLists.push(i + 1, '<a title="' + item.transactionId + '"href=#?' + item.transactionId + '>' + item.transactionId.substr(0, 20) + '....', convdataTime, replacedDesc, item.policyId);

		dataSets.push(tempLists);
		tempLists = [];

		//alert(dataSet);		               

	});
	//$('#res').dataTable();

	//alert(dataSet);
	$('#allTx').DataTable({
		data: dataSets,
		columns: [
			{ title: "SNo" },
			{ title: "Transcation Id" },
			{ title: "TimeStamp " },
			{ title: "Description" },
			{ title: "Policy ID" }







		]
	});



});