//
// FUNCTIONS
//
Number.prototype.toRadians = function() {
    return this * Math.PI / 180;
}

//function for calculating distance
function distance(lat1, lat2, lon1, lon2) {
    //code from http://www.movable-type.co.uk/scripts/latlong.html
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
    
    return d;
}

//======================================================
//API for ISS coordinates now
var url = "http://api.open-notify.org/iss-now.json";

//get latitude and longitude of user
//var city = "";

var request = require('request');
var prompt = require('prompt');


/*Logic of below
  1. Prompt user for their location
  2. Request latitude and longitude coordinates of user
  3. Inside that request, request latitude and longitude coordinates of ISS
  4. Still inside that request, call the function that will calculate distance between 2 latitudes and longitudes
*/
//prompt user for current location
// 
// Start the prompt 
// 
prompt.start();

prompt.get(['city'], function(err, result) {
    console.log('Command-line input received:');
    console.log('  city: ' + result.city);

    var urlUser = "https://maps.googleapis.com/maps/api/geocode/json?address=" + result.city;

    //now to get the user's lat and long
    request(urlUser, function(err, response) {

        if (err) {
            console.log('something bad happened. please try again later');
        }
        else {

            var searchResults = JSON.parse(response.body);
            var latitude1 = parseFloat(searchResults.results[0].geometry.location.lat); //parseFloat needs to be done because otherwise latitude is just a string of the number
            var longitude1 = parseFloat(searchResults.results[0].geometry.location.lng);
            console.log("User Latitude: ", latitude1.toFixed(2));
            console.log("User Longitude: ", longitude1.toFixed(2));


            //now get the latitude and longitude of the ISS
            request(url, function(err, response) {

                if (err) {
                    console.log('something bad happened. please try again later');
                }
                else {

                    var searchResults = JSON.parse(response.body);
                    var latitude2 = parseFloat(searchResults.iss_position.latitude); //parseFloat needs to be done because otherwise latitude is just a string of the number
                    var longitude2 = parseFloat(searchResults.iss_position.longitude);
                    console.log("ISS Latitude: ", latitude2.toFixed(2));
                    console.log("ISS Longitude: ", longitude2.toFixed(2));

                    //now inside HERE, calculate distance 
                    console.log("Distance between user and ISS: ", (distance(latitude1, latitude2, longitude1, longitude2) / 1000).toFixed(0), "km");
                }
            });
        }
    });

});
