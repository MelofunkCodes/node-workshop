//Duplicate

var request = require('request');

function getISSData(){
    
    var issURL = "http://api.open-notify.org/iss-now.json";
    
    request(issURL, function(error, result){
        if(error){
            console.log("Error. Possible invalid ISS API. Try again later.");
        }
        else{
            var data = JSON.parse(result.body);
            
            var issLat = data.iss_position.latitude;
            var issLon = data.iss_position.longitude
            
            console.log("ISS latitude: ", issLat);
            console.log("ISS longitude: ", issLon);
        }
    })
    
};

//call fxn
getISSData();