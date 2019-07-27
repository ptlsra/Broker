var tempLists = [];
var dataSets = [];



var ipAdd = ipAddress();
var port = portNo();



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

//$.get("http://"+ipAdd+":"+port+"/getAllCustomerTransactions", function(response){
$.get("/getAllCustomerTransactions", function (response) {
	//  alert(JSON.stringify(response));
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

		var customerName = item.customerName;
		var replacedCustomerName = customerName.split('_').join(' ');


		tempLists.push(i + 1, '<a title="' + item.transactionId + '"href=#?' + item.transactionId + '>' + item.transactionId.substr(0, 20) + '....', convdataTime, replacedDesc, replacedCustomerName, item.policyId);

		dataSets.push(tempLists);
		tempLists = [];

		//alert(dataSet);		               

	});
	//$('#res').dataTable();

	//alert(dataSet);
	modal.style.display = "none";

	$('#allTxMarsh').DataTable({
		data: dataSets,
		columns: [
			{ title: "SNo" },
			{ title: "Transcation Id" },
			{ title: "TimeStamp " },
			{ title: "Description" },
			{ title: "Customer Name" },
			{ title: "Policy ID" }







		]
	});



});