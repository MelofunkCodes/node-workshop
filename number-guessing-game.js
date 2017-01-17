/*
The Penniless Gambler

Challenge: create a simple HTML file that will only be used for the purposes of running JavaScript in the browser. Create a guess.js file and add it to a <script> tag of your HTML file. This is simply so you can load your HTML file in the browser and do the challenge: creating a number guessing game.

Generate a random number between 1 and 100. Using the browser functions prompt and alert, ask the user to guess the number. You should give them 4 tries to guess the number. If they guess wrong, tell them if it's higher or lower. If they guess right, congratulate them. Otherwise, give them a message saying what the correct number was, as well as their list of guesses.
*/

var prompt = require('prompt');

prompt.start();

var random = Math.floor(Math.random() * 100 + 1);
var i = 4;

function promptNumber() {
    return prompt.get(["guess"], function(err, result) {
        if (err) {
            console.log("something bad happened. please try again later");
        }
        else {
            console.log('Command-line input received:');
            console.log('  guess: ' + result.guess);

            //Have to number-fy "result.guess" because prompt.get gets the result in STRING form into ["guess"] array
            
            //This checks if a number was entered and guess was between 1 and 100
            //if not, program will terminate
            if (!isNaN(result.guess) && result.guess > 0 && result.guess < 101) {

                //base condition
                //??? why is it when my base condition i=== 0, program lets me take one more guess?
                if (i === 1) {
                    console.log("No more tries left. Number was " + random);
                    return;
                }

                else if (Number(result.guess) === random) {
                    console.log("You guessed it! Great job! Number was " + random);
                    return;
                }

                //recursive cases
                else if (Number(result.guess) > random) {
                    i--;
                    console.log("Number too high! Try again." + i + " tries left.");
                    return promptNumber();
                }
                else if (Number(result.guess) < random) {
                    i--;
                    console.log("Number too low! Try again." + i + " tries left.");
                    return promptNumber();
                }
            }
            else {
                console.log("You did not enter a number between 1 and 100. Program will terminate.");
                return;
            }

        }

    });


}

//calling function
promptNumber();