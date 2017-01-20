//Duplicate
/*
LOGIC
1. Ask user for city
2. Get user coordinates
3. Request ISS coordinates
4. Calculate distance between city and ISS
*/

var prompt = require('prompt');
var request = require('request');

//======FUNCTION DELCARATION===================
Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
}

function gettheDistance(lat1, lon1, lat2, lon2) {
    var R = 6371e3; // metres
    var φ1 = lat1.toRadians();
    var φ2 = lat2.toRadians();
    var Δφ = (lat2 - lat1).toRadians();
    var Δλ = (lon2 - lon1).toRadians();

    var a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;

    return Math.floor(d/1000); //returns distance in units [km]
}

//=======DEFINING ASYNC FUNCTION===============
function calculateDistance() {
    prompt.get(['city'], function(err, result) {
        if (err) {
            console.log("Error. Invalid input.");
        }
        else {
            var userURL = "https://maps.googleapis.com/maps/api/geocode/json?address=" + result.city;

            request(userURL, function(err, response) {
                if (err) {
                    console.log("Error. Invalid url with Google's Geolocation API. Try again.");
                }
                else {
                    var userData = JSON.parse(response.body);

                    var userLat = +userData.results[0].geometry.location.lat;
                    var userLon = +userData.results[0].geometry.location.lng;


                    var issURL = "http://api.open-notify.org/iss-now.json";

                    request(issURL, function(err, result) {
                        if (err) {
                            console.log("Error. Invalid API for ISS. Try again.");
                        }
                        else {
                            var issData = JSON.parse(result.body);

                            var issLat = +issData.iss_position.latitude;
                            var issLon = +issData.iss_position.longitude;

                            console.log("Distance between you and the ISS is: ", gettheDistance(issLat, issLon, userLat, userLon), "m");
                            
                        }
                    })
                }
            });
        }
    })
}



//=======CALLING THE FUNCTION==================
calculateDistance();