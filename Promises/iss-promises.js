//Duplicate
//Promise Version

var requestPromise = require('request-promise');

function getISSDataPromise() {

    var issURL = "http://api.open-notify.org/iss-now.json";

    return requestPromise(issURL)
        .then(function(result) {

            //console.log("result: ", result);
            var data = JSON.parse(result); //don't have to put result.body for some reason. But still have to JSON.parse it

            var issLat = data.iss_position.latitude;
            var issLon = data.iss_position.longitude

            return {
                lat: issLat,
                lon: issLon
            };
        });

};

//call fxn
getISSDataPromise()
    .then(function(result) {
        console.log("ISS latitude: ", result.lat);
        console.log("ISS longitude: ", result.lon);
    })
    .catch(function(err) {
        console.log("Error happened. Try again later.");
    });
