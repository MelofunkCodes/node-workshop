console.log("hello");

// setTimeout(function() {
//     console.log("Hello World Again!");
// }, 10000);

//WILD INTERVAL ==============================
function go() {
    console.log("hello world again!");

    setTimeout(go, 2000);

}

//call the function
go();
