// change to local storage setting later
//var ipAddress   =   localStorage.getItem("ipAddress");
//var portNumber  =   localStorage.getItem("portNo");
//var ipAddress = "172.21.80.81";
var ipAddress = "172.21.80.75";
//var portNumber = "4000";
var portNumber = "5500";
/**
* function to plot transactions Vs timestamp
*
*/
function plotTransactionsVsTimestamp(){
       transactionsVsTimestamp  = document.getElementById('live-txn-div');
       $.getJSON("http://"+ipAddress+":"+portNumber+"/getTransactionCountByTimestamp", function(result){
            
            //get txCount and timestamp
            var blockTimeStamp   = result.timestamp;
            var txCount     = result.txCount;

            var time = new Date(blockTimeStamp * 1000);
            var data = [{
              x: [time], 
              y: [txCount],
              mode: 'lines',
              line: {color: '#80CAF6'}
            }] 

            Plotly.plot(transactionsVsTimestamp, data);

            var cnt = 0;

            var interval = setInterval(function() {
                //fetch blockNumber and txCount every second and update the chart.
                $.getJSON("http://"+ipAddress+":"+portNumber+"/getTransactionCountByTimestamp", function(result){
                        var txCount     = result.txCount;
                        var blockTimeStamp = result.timestamp;
                        var time = new Date(blockTimeStamp * 1000);
                    
                          var update = {
                              x:  [[time]],
                              y: [[txCount]]
                          }

                         Plotly.extendTraces(transactionsVsTimestamp, update, [0]);

                          if(cnt === 100) clearInterval(interval);
                });
            }, 1000);
    });
}

plotTransactionsVsTimestamp();
