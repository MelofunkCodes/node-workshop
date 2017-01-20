//DUPLICATE
/*
LOGIC
1. Start guesses counter at 4
2. Prompt user for a guesses
3. If user guesses random number, win and end game / or restart game.
4. If user guesses number higher/lower than random number, decrement the guess counter, and return the function call (recursive case)
5. If no more guesses, end game/ restart game


This has bug. Hard to exit game with control+C. 
*/

var prompt = require('prompt');

//=======DEFINING ASYNC FUNCTION===============
function playGame() {
    var random = Math.floor(Math.random() * 100 + 1);
    console.log("\nNEW GAME ", random);
    var i = 4;
    var userGuesses = [];

    //======================mapping out guess scenario===============
    function getGuess() {
        if (i > 0) { //if user still has guesses, keep playing
            prompt.get(['guess'], function(error, result) {
                if (error) {
                    console.log("Error. Invalid input. Enter number");

                    return; //end game
                }
                else {
                    var guess = +result.guess;
                    userGuesses.push(guess);


                    if (!isNaN(guess) && guess > 0 && guess < 101) {
                        if (guess === random) {
                            console.log("You guessed it! Number is " + random);

                            return playGame(); //restart game
                        }
                        else if (guess > random) {
                            i--;
                            console.log("Number too high! You have " + i + " guesses left.");

                            return getGuess();
                        }
                        else if (guess < random) {
                            i--;
                            console.log("Number too low! You have " + i + " guesses left.");

                            return getGuess();
                        }

                    }
                    else {
                        console.log("Guess needs to be a number between 1 and 100. Try again.");

                        return getGuess();
                    }
                }
            });
        }
        else {
            console.log("No more guesses left. The number was " + random + ". \nYour guesses were " + userGuesses + ".\n");
            //console.log("No more guesses left. The number was " + random);

            return playGame();

        }

    }
    //=======================end scenario=======================================
    
    //now to call the fxn to get guesses
    getGuess();
}

//=======CALLING THE FUNCTION==================
playGame();
