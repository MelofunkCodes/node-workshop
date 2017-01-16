// //FIRST PROGRAM
// console.log("Hello World!");
// setTimeout(function(){
//     console.log("Hello World Again!!");
// }, 10000);

//
//EXERCISE
//A wild interval has appeared!
//
console.log("Hello World!");
// setInterval(function(){
//     console.log("Hello World Again!!");
// }, 2000);


// while(true){
//     setTimeout(function() {
//         console.log("Hello World!");
//     },1000);
// } //this will not work because the infinite loop is JS code so it will get put on the stack, the setTimeout as a nonblockable node.js code, will be put in the callback queue, will WAIT for the while loop to finish before executing itself, but while loop will not finish because infinite, so this equal INFINITE WILL NEVER HAPPEN

function go(){
    console.log("Hello World Again!");
    
    setTimeout(go, 10000);
    
    //because this function is not returning anything, it will run like an infinite loop
}

go();

