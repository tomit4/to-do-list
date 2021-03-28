const writeList = require('./writelist.js');//and here we go, final stretch..bringing in our writelist.js file..
const prompt = require('prompt-sync')();//and yes, prompt-sync is still needed.
const fs = require('fs');//and we'll have to bring back our read/write functionality to save the list at the end of this
let finishedArrString = writeList.finishedArrString;//and assigning our variables from the writelist.js file to the same names..
let finishedArr = writeList.finishedArr;

const currentDate = new Date();//the following is the reformatting of the current time (which I'm encountering some strange bugginess depending on which computer I use...)
//I could have put this functionality elsewhere in either the readlist.js or writelist.js files..but I simply didn't want to display the currentTime and the current hour's
//list until the end of the program..so, yeah.
let currentHour = currentDate.getHours();
let currentMinutes = currentDate.getMinutes();
let currentTime = getTime(currentHour);

function getTime (now) {//displays the current time in American Standard time (not military time)
	if (now > 12) {
		now = 12;
		if (now < 1) {
			now = '12';
			}
		if (now < 10 && now > 0) {
			now = '0' + now;
		}
		if (currentMinutes < 10) {
			currentMinutes = '0' + currentMinutes;
		}
		return now +':' + currentMinutes + 'PM';
	} if (now < 1) {
		now = '12';
	}
	    if (now < 10) {
			now = '0' + now;
		}
		if (currentMinutes < 10 && currentMinutes !== '00') {
			currentMinutes = '0' + currentMinutes;
		}
		return now + ':' + currentMinutes + 'AM';
}

function alertMe (arr, time) {//function that checks the current time against the formatted list to see if the HR characters match, if so, the user is notified of the task(s) to be accomplished at the hour it currently is.
	for (let i in arr) {
		if (arr[i].charAt(arr[i].length - 7) == time.charAt(0) && 
		arr[i].charAt(arr[i].length - 6) == time.charAt(1) && 
		arr[i].charAt(arr[i].length -2) == time.charAt(5)) {
		console.log("This Hour's Tasks: " + arr[i]);
		}
	}
}

console.log(finishedArrString);//displays the final list
alertMe(finishedArr, currentTime);//and alerts the user if there's any tasks that need to be accomplished that hour
console.log('The Current Time is: ' + currentTime);//and also tells the user the current time (buggy on different computers!..not sure why..)

(function writeIt() {//finally, we ask the user of they'd like to save their file, if so, the .txt format is automatically applied to the end of whatever string value they provide.
	let writePrompt = prompt('Would you like to save your list?: ');
	if (writePrompt == 'y' || writePrompt == 'yes' || writePrompt == 'Yes') {
		let fileName = prompt('What would you like to name your file?: ');
		fs.writeFile(fileName + '.txt', finishedArrString, () => {
			console.log(fileName + '.txt was saved.');
		});
	}else {
		console.log('List not saved.');
	}
})();

//and that's it!  This is definitely not an ideal way of creating a todo list in javascript from what I've seen on other projects.  It has been pointed out to me that a more object
//oriented approach to creating this application would have been far more efficient, but I learned a vast amount from just attempting to write this.  It is more or less my first Javascript Application
//and I learned alot.  Various ways of iterating over one dimensional arrays, basics of string manipulation, different ways of utilizing functions, and also the basics of how objects work in
//Javascript became more apparent to me over the course of writing this.  There is obviously alot more for me to learn, but this was a decent enough starting place, and returning to this basic assignment
//attempting to add more functionality like organizing the list by date, and/or adding asynchronous aspects to the program will probably teach me even more.
//Thanks for reading.