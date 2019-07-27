var tempLists = [];
var dataSets = [];



var ipAddress = ipAddress();
var portNo = portNo();

/*
 * 		View All Policy Requests Made by All Customers
 * 
 */

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


var count = 0;

$.get("/getPolicyRequestList", function (response) {
	//alert(JSON.stringify(response));
	$.each(response, function (i, item) {
		count++;
		if (item.status == "notApproved") {
			var unixtimestamp = item.requestTimeStamp;

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


			var customerName = item.customerName;
			var replacedcustomerName = customerName.split('_').join(' ');


			tempLists.push(count, item.requestId, replacedcustomerName, '<a title="' + item.customerAddress + '"href=#?' + item.customerAddress + '>' + item.customerAddress.substr(0, 10) + '....', convdataTime, '<a  href=ViewRequestDetails.html?customerAddress=' + item.customerAddress + '&userName=' + item.userName + '&requestId=' + item.requestId + '> Approve Request');

			dataSets.push(tempLists);
			tempLists = [];
		}



		if (item.status == "Approved") {
			var unixtimestamp = item.requestTimeStamp;

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


			var customerName = item.customerName;
			var replacedcustomerName = customerName.split('_').join(' ');


			tempLists.push(count, item.requestId, replacedcustomerName, '<a title="' + item.customerAddress + '"href=#?' + item.customerAddress + '>' + item.customerAddress.substr(0, 10) + '....', convdataTime, '<a  href=ViewRequestDetailsDone.html?customerAddress=' + item.customerAddress + '&userName=' + item.userName + '&requestId=' + item.requestId + '> Request Approved');

			dataSets.push(tempLists);
			tempLists = [];
		}




	});
	
	modal.style.display = "none";

	$('#viewAllPolicyRequests').DataTable({
		data: dataSets,
		columns: [{
				title: "SNo"
			},
			{
				title: "Request ID"
			},
			{
				title: "Customer Name"
			},
			{
				title: "Address"
			},
			{
				title: "Timestamp"
			},
			{
				title: "Current Action"
			}
		]
	});
});