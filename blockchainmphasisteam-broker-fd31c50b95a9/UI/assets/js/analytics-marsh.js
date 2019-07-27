$(document).ready(function(){
/*
    var ipAddress_marsh   =   "204.236.174.26";
    var portNumber_marsh  =   "5000";
*/
	
	 //	var ipAddress_marsh   =   "172.21.80.81";
	 	var ipAddress_marsh   =   "172.21.80.75";

	
	    var portNumber_marsh  =   "5000";
    $("#users-span").text("0");
    $("#claims-span").text("0");
    $("#approved-policies-span").text("0");
    $("#tpa-span").text("0");
    $("#insurance-span").text("0");
    $("#blockheight-span").text("0");

    setInterval(function getStatistics(){
     $.getJSON("http://"+ipAddress_marsh+":"+portNumber_marsh+"/getStatistics", function(result){
             $("#users-span").text(result.numberOfUsers);
             $("#claims-span").text(result.numberOfClaims);
             $("#approved-policies-span").text(result.policies);
             $("#tpa-span").text(result.numberOfTPA);
             $("#insurance-span").text(result.numberOfInsuranceCompanies);
             $("#blockheight-span").text(result.blockHeight);
        });
    },3000);
    
    
    setInterval(function getClaimsDistribution(){
       claimStatusListDiv  = document.getElementById('claim-status-list-div');
        $.getJSON("http://"+ipAddress_marsh+":"+portNumber_marsh+"/getClaimStatusList", function(result){
            var data = [{
                  y: [result.approvedClaimCount, result.unApprovedClaimCount],
                  x: ['Approved Claims', 'Unapproved Claims'],
                  type: 'bar',
                    marker:{
                        color: ['rgba(156,136,204,1)', 'rgba(222,99,138,0.8)']
                   }
                }];
                
                Plotly.newPlot(claimStatusListDiv, data);
        });
    },4000);
    
    setInterval(function getDependentsByPolicyId(){
         dependentsByPolicyIdDiv = document.getElementById('dependents-by-policy-div');
         $.getJSON("http://"+ipAddress_marsh+":"+portNumber_marsh+"/getClaimsByPolicyId", function(result){
             
             var policyIdList=[];
             var claimsCountList=[];
             
             for(let index = 0; index < result.length; index++){
                policyIdList.push(result[index].policyId);
                claimsCountList.push(result[index].claimIdCount);
             }
             
             var data = [{
              x: policyIdList,
              y: claimsCountList,
              type: 'bar'
               
            }];

            Plotly.newPlot(dependentsByPolicyIdDiv, data);
         });
    },5000);
    
    setInterval(function getClaimCountByEstimate(){
        claimCountByEstimateDiv = document.getElementById('claim-count-estimate-div');
         $.getJSON("http://"+ipAddress_marsh+":"+portNumber_marsh+"/getClaimCountByEstimate", function(result){
            var data = [{
              labels: ['Estimate <= 50000 ','Estimate > 50000'],
              values: [result.lessThanFifty, result.greaterThanFifty],
              type: 'pie'
            }];
             var layout = {
                  height: 450,
                  width: 500
                };
            Plotly.newPlot(claimCountByEstimateDiv, data, layout);
         });
    },4500);
    
    
});