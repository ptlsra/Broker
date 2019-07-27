
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
//$.get("http://"+ipAdd+":"+port+"/getAllCustomers", function(response){
//  alert(JSON.stringify(response));
$.get("/getAllCustomers", function (response) {
	$.each(response, function (i, item) {

		var customerName = item.customerName;
		var newcustomerName = customerName.split('_').join(' ');

		var amount = item.sumInsured;
		var strRepass = amount;
		/*var strRepass = amount.split('.');
		 if (strRepass[0].length >= 4) {
			   strRepass[0] = strRepass[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
		 }
		 if (strRepass[1] && strRepass[1].length >= 4) {
			   strRepass[1] = strRepass[1].replace(/(\d{3})/g, '$1 ');
		 }
		 strRepass.join('.');
	   */

		//	tempLists.push(i+1,newcustomerName,item.scheme,strRepass,item.tenure,'<a  href=ViewAllPolicyForCustomer.html?walletAddress='+item.walletAddress+'> View Details');
		tempLists.push(i + 1, newcustomerName, '<a  href=ViewAllPolicyForCustomer.html?walletAddress=' + item.walletAddress + '> View Details');
		dataSets.push(tempLists);
		tempLists = [];



	});

	modal.style.display = "none";

	$('#viewAllCustomers').DataTable({
		data: dataSets,
		columns: [
			{ title: "SNo" },
			{ title: "Customer Name" },
			//   {title: "Selected Scheme "},
			//  {title: "Sum Insured (in Rs)"},
			// {title:"Tenure"},
			{ title: "Action" }







		]
	});



});