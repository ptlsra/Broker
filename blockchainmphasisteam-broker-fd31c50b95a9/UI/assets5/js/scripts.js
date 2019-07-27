
function scroll_to_class(element_class, removed_height) {
	var scroll_to = $(element_class).offset().top - removed_height;
	if($(window).scrollTop() != scroll_to) {
		$('html, body').stop().animate({scrollTop: scroll_to}, 0);
	}
}

function bar_progress(progress_line_object, direction) {
	var number_of_steps = progress_line_object.data('number-of-steps');
	var now_value = progress_line_object.data('now-value');
	var new_value = 0;
	if(direction == 'right') {
		new_value = now_value + ( 100 / number_of_steps );
	}
	else if(direction == 'left') {
		new_value = now_value - ( 100 / number_of_steps );
	}
	progress_line_object.attr('style', 'width: ' + new_value + '%;').data('now-value', new_value);
}

jQuery(document).ready(function() {
	
    /*
        Fullscreen background
    */
   
    
    $('#top-navbar-1').on('shown.bs.collapse', function(){
    	$.backstretch("resize");
    });
    $('#top-navbar-1').on('hidden.bs.collapse', function(){
    	$.backstretch("resize");
    });
    
    /*
        Form
    */
    $('.f1 fieldset:first').fadeIn('slow');
    
    $('.f1 input[type="text"], .f1 input[type="password"], .f1 textarea').on('focus', function() {
    	$(this).removeClass('input-error');
    });
    
    
    
    $('#f1-dob').on('blur', function() {
    	
		var email=$('#f1-email').val();
		var dob=$('#f1-dob').val();

    	if(email!="" && dob!=""){
    		document.getElementById("f1-Dob").innerHTML =$('#f1-dob').val(); 
    		document.getElementById("f1-mail").innerHTML =$('#f1-email').val(); 
    	$("#next2").show();
    	}
    	/*var amount=$('#f1-amount').val();
    	
    	if(amount!=""){
    		
    		   
 		   var strRepass = amount;
 		   /*
 	        if (strRepass[0].length >= 4) {
 	        	strRepass[0] = strRepass[0].replace(/(\d)(?=(\d{3})+$)/g, '$1,');
 	        }
 	        if (strRepass[1] && strRepass[1].length >= 4) {
 	        	strRepass[1] = strRepass[1].replace(/(\d{3})/g, '$1 ');
 	        }
 	        strRepass.join('.');
 	        
 	      */
    		/*document.getElementById("f1-scheme").innerHTML =$('#scheme').val(); 
    		document.getElementById("f1-tenure").innerHTML =$('#tenure').val(); 

    		//document.getElementById("f1-Address").innerHTML =$('#f1-address').val(); 
 		   document.getElementById("f1-Amount").innerHTML  =strRepass;  
 		  $('#f1-amount').val(strRepass);
    		
    		$("#next3").show();
    	}
    	*/
    });
   
    
   
    
    
    
    
   
    
    
    
    
    
    
   
    
    
 $('#f1-repeat-password').on('blur', function() {
    	
    	
    	
    	var repPass=$('#f1-repeat-password').val();
    	var pass=$('#f1-password').val();
    	
    	  if(repPass.match(pass) && repPass!="")  
    	     {  
    		  $("#wrongPass").hide();
    		  $("#next3").show();
    		  document.getElementById("f1-Password").innerHTML =$('#f1-password').val(); 
    		  //document.getElementById("f1-mail").innerHTML =$('#f1-email').val(); 
    		  
    	     }  
    	   else  
    	     {  
    		   $("#wrongPass").show();
    		   $("#next3").hide();
    	       //alert("Not a valid Phone Number"); 
    	      
    	         
    	     }  
    	
    	
    });
    /*Next Username Button */
    
    $('#f1-userName').on('blur', function() {
    	
    	
    	
		var userName=$('#f1-userName').val();
		var lastName=$('#f1-last-name').val();
		var firstName=$('#f1-first-name').val();

    	function validateEmail(email) {
			var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
			return re.test(email);
		  }
		  var validEmail=validateEmail(userName)
		  
    	// var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;  
    	  if(userName && lastName && firstName && validEmail==true)  
    	     {  
    		  $("#next1").show();
			  $('#f1-email').val(userName);

    		  document.getElementById("f1-firstName").innerHTML =$('#f1-first-name').val(); 
    		    document.getElementById("f1-lastName").innerHTML =$('#f1-last-name').val(); 
				document.getElementById("f1-username").innerHTML =$('#f1-userName').val(); 

    		    
    		  
    	     }  
    	   else  
    	     {  
    		   $("#next1").hide();
    	       //alert("Not a valid Phone Number"); 
    	      
    	         
    	     }  
    	
    	
    });
    
    // next step
    $('.f1 .btn-next').on('click', function() {
    	var parent_fieldset = $(this).parents('fieldset');
    	var next_step = true;
    	// navigation steps / progress steps
    	var current_active_step = $(this).parents('.f1').find('.f1-step.active');
    	var progress_line = $(this).parents('.f1').find('.f1-progress-line');
    	
    	// fields validation
    	parent_fieldset.find('input[type="text"], input[type="password"], textarea').each(function() {
    		if( $(this).val() == "" ) {
    			$(this).addClass('input-error');
    			next_step = false;
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    	// fields validation
    	
    	if( next_step ) {
    		parent_fieldset.fadeOut(400, function() {
    			// change icons
    			current_active_step.removeClass('active').addClass('activated').next().addClass('active');
    			// progress bar
    			bar_progress(progress_line, 'right');
    			// show next step
	    		$(this).next().fadeIn();
	    		// scroll window to beginning of the form
    			scroll_to_class( $('.f1'), 20 );
	    	});
    	}
    	
    });
    
    // previous step
    $('.f1 .btn-previous').on('click', function() {
    	// navigation steps / progress steps
    	var current_active_step = $(this).parents('.f1').find('.f1-step.active');
    	var progress_line = $(this).parents('.f1').find('.f1-progress-line');
    	
    	$(this).parents('fieldset').fadeOut(400, function() {
    		// change icons
    		current_active_step.removeClass('active').prev().removeClass('activated').addClass('active');
    		// progress bar
    		bar_progress(progress_line, 'left');
    		// show previous step
    		$(this).prev().fadeIn();
    		// scroll window to beginning of the form
			scroll_to_class( $('.f1'), 20 );
    	});
    });
    
    // submit
    $('.f1').on('submit', function(e) {
    	
    	// fields validation
    	$(this).find('input[type="text"], input[type="password"], textarea').each(function() {
    		if( $(this).val() == "" ) {
    			e.preventDefault();
    			$(this).addClass('input-error');
    		}
    		else {
    			$(this).removeClass('input-error');
    		}
    	});
    	// fields validation
    	
    });
    
    
});