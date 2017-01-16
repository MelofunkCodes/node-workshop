var url = "http://api.open-notify.org/iss-now.json";

var request = require('request');

request(url, function(err, response) {

    if (err) {
        console.log('something bad happened. please try again later');
    }
    else {

        var searchResults = JSON.parse(response.body);
        var latitude = parseFloat(searchResults.iss_position.latitude); //parseFloat needs to be done because otherwise latitude is just a string of the number
        var longitude = parseFloat(searchResults.iss_position.longitude);
        console.log("ISS Latitude: ", latitude.toFixed(2));
        console.log("ISS Longitude: ", longitude.toFixed(2));
    }
});
