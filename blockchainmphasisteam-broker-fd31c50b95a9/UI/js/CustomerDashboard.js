var customerName= localStorage.getItem("customerName");
var customerName = customerName.split('_').join(' ');
document.getElementById("titleContent").innerHTML = "Welcome To Your Dashboard,"+customerName; 

if(customerName==""){
	window.location.href="loginCustomer.html";
}