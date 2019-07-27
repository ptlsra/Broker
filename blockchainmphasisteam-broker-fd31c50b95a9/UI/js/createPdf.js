var ipAddress=ipAddress();
	var portNo=portNo();
	
	
        (function () {  
        	
            var  
             form = $('#formData'),  
             cache_width = form.width(),  
             a4 = [595.28, 841.89]; // for a4 size paper width and height  
      
            $('#create_pdf').on('click', function () {  
                $('body').scrollTop(0);  
                createPDF(); 
                
                $('#submitDoc').show();
                $('#create_pdf').hide();
                
                $('#policyDocument').show();
                $('#uploadDoc').show();

            });  
            //create pdf  
            function createPDF() {  
                getCanvas().then(function (canvas) {  
                    var  
                     img = canvas.toDataURL("image/png"),  
                     doc = new jsPDF({  
                         unit: 'px',  
                         format: 'a4'  
                     });  
                    doc.addImage(img, 'JPEG', 20, 20);
                    var walletAddress=localStorage.getItem("walletAddress");
                  // alert(walletAddress);
                	//$.get("http://"+ipAddress+":"+portNo+"/getCustomerPolicies?customerAddress="+walletAddress, function(response2){
               	$.get("/getCustomerPolicies?customerAddress="+walletAddress, function(response2){

                	//	alert(response2);
                	
                	//alert(response2.policies.length);
                	var Version=response2.policies.length+1;
                	//alert(Version);

              //      http://172.21.80.81:5000/getCustomerPolicies?customerAddress=0x4913beaafd3c1c29e654294645cdbd0f12666ef3
                	var customerNameForFile=localStorage.getItem("customerName");

                    var fileName=customerNameForFile+"V"+Version+".pdf";
                    doc.save(fileName);  
                    form.width(cache_width); 
                	});
                });  
            }  
      
            // create canvas object  
            function getCanvas() {  
                form.width((a4[0] * 1.33333) - 80).css('max-width', 'none');  
                return html2canvas(form, {  
                    imageTimeout: 2000,  
                    removeContainer: true  
                });  
            }  
      
        }());  