var requestPromise = require('request-promise');
var promptPromise = require('prompt-promise');

// //
// // FUNCTIONS
// //
var toRadians = val => val * Math.PI / 180;

function calculateDistance(lat1, lon1, lat2, lon2) {

  var R = 6371e3; // metres
  var φ1 = toRadians(lat1); 
  var φ2 = toRadians(lat2);
  var Δφ = toRadians(lat2-lat1);
  var Δλ = toRadians(lon2-lon1);

  var a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  var d = R * c;

  return Math.floor(d/1000); 
}
//Q: Why aren't fxns working as Number.prototype.toRadians??
//by assigning toRadians as a fxn to Number prototype, is it being more strict in accepting its argument (i.e. you HAVE TO HAVE TO be a number?)? 
//A: JS is weird in that "10" * 10 = 100, but "10" + 10 = 1010. This was the weird case where because you're MULTIPLYING, the math is working and returning a number. But to be sure, ALWAYS know what TYPEOF variables you're sending as arguments to your function


//
// Ziad's part
//

// This function wraps the prompt library and re-uses it to return a promise for *one* answer
function simplePrompt(question) {
  return promptPromise(question).then(function(answers) {
    return answers[question]; //answers is object. Ziad is using bracket notation to return back the input user entered. Same thing as using DOT NOTATION "answers.question"
  });
}

// This function takes a city (string) as input. It calls the google maps geocoding API and
// returns a promise for only that part of the response that contains the lat/lng
function getCoordinatesPromise(city) {
  var gMapsUrl = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city;
  
  return requestPromise(gMapsUrl)
  .then(function(gmapsData) {
    gmapsData = JSON.parse(gmapsData);

    var userLat = gmapsData.results[0].geometry.location.lat;
    var userLon = gmapsData.results[0].geometry.location.lng;

    return {lat: userLat, lon: userLon};
  });
}

// This function returns a promise for the lat/lon content at the ISS API url
function getIssPromise() {
  return requestPromise('http://api.open-notify.org/iss-now.json')
  .then(function(result) {
    var issData = JSON.parse(result);
    var issLat = (+issData.iss_position.latitude).toFixed(2);
    var issLon = (+issData.iss_position.longitude).toFixed(2);
    return {lat: issLat, lon: issLon};
  });
}

// This function returns a promise for the distance from the user to the ISS
function computeDistancePromise() {
  
  //call the iss promise to get iss lat and long
  var issPromise = getIssPromise();
  
  //calling the prompt promise through simplePrompt to get user input, THEN call geomaps promise to get user lat and long
  var userPromise = simplePrompt('location: ')
  .then(getCoordinatesPromise);

  // Our function returns the result of Promise.all, which is itself a promise
  // Promise.all takes an array of promises, and returns a promise that resolves
  // when all the promises in the array are resolved. The new promise resolves with
  // an array containing the resolution values of all the promises in the array, in the same order.
  return Promise
  .all([issPromise, userPromise])
  .then(function(results) {
    var issResult = results[0];
    var userResult = results[1];

    return calculateDistance(issResult.lat, issResult.lon, userResult.lat, userResult.lon);
  })

  // This is a manual way of synchronizing the two promises. It's ugly, long and not scalable.
  // issPromise.then(function(result) {
  //   issResult = result;
  //
  //   if (userResult) {
  //     calcTheDistance();
  //   }
  // });
  //
  // userPromise.then(function(result) {
  //   userResult = result;
  //
  //   if (issResult) {
  //     calcTheDistance();
  //   }
  // })
}


// This code would normally be in another module. It consumes (uses) the computerDistancePromise
// function and as a side effect it console.logs the resulting distance.
computeDistancePromise()
.then(function(result) {
  console.log('Your distance from the ISS is: ' + result + "m")
})
// This catch -- sugar for then(null, failureCb) -- will catch any error that happened in the whole asynchronous flow.
.catch(function(err) {
  console.log('something went wrong', err)
})