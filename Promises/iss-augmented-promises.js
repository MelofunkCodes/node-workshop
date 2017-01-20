//Duplicate
//PROMISES VERSION
/*
LOGIC
1. Ask user for city
2. Get user coordinates
3. Request ISS coordinates
4. Send user and ISS coordinates (their promises) to another promise which will...
5. Calculate distance between city and ISS
6. Output result
7. Catch any errors that bubble up
*/

var promptPromise = require('prompt-promise');
var requestPromise = require('request-promise');

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

    return Math.floor(d / 1000); //returns distance in units [km]
    //this value is 3000 m LESS than Ziad's promise version
    //3 km in space scope is peanuts though
}

//=======SCENARIO MAPPING===============
function simplePrompt(question) {
    return promptPromise(question)
        .then(function(answers) {
           //console.log("answer: ", answer, "\n", "type of: ", typeof answer); //answer is a string
            return answers.question;
        });
}

function getISSPromise() {

    var issURL = "http://api.open-notify.org/iss-now.json";
    return requestPromise(issURL)
        .then(function(result) {
            var issData = JSON.parse(result);

            var issLat = +issData.iss_position.latitude;
            var issLon = +issData.iss_position.longitude;

            return {
                lat: issLat,
                lon: issLon
            };
        });
}

function getUserPromise(city) {
    var url = "https://maps.googleapis.com/maps/api/geocode/json?address=" + city;

    return requestPromise(url)
        .then(function(result) {
            var userData = JSON.parse(result);

            var userLat = +userData.results[0].geometry.location.lat;
            var userLon = +userData.results[0].geometry.location.lng;

            return {
                lat: userLat,
                lon: userLon
            };

        });
}

function calculateDistancePromise() {
    var issPromise = getISSPromise();

    // var userPromise = simplePrompt()
    //     .then(function(result) {
    //         return getUserPromise(result); //result here in this argument is the Google Geomaps API
    //     });

    var userPromise = simplePrompt("Location: ")
        .then(getUserPromise); //same as lines 91-93

    return Promise
        .all([issPromise, userPromise])
        .then(function(results) {
            var issResult = results[0];
            var userResult = results[1];
            
            return gettheDistance(issResult.lat, issResult.lon, userResult.lat, userResult.lon);
        });

}



//=======CALLING THE FUNCTION==================
calculateDistancePromise()
    .then(function(result) {
        console.log("Distance between you and the ISS is: ", result, " m");
    })
    .catch(function(error) {
        console.log("Error happened somewhere.", error);
    });
