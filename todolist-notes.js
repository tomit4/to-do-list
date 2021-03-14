const prompt = require('prompt-sync')();  //Import node prompt-sync
const fs = require('fs');  //and node file sync.
const currentDate = new Date();  //This and the next three lines are all to get the current time.
let currentHour = currentDate.getHours();
let currentMinutes = currentDate.getMinutes();
const currentTime = getTime(currentHour);
let currentRoutineAM = [];  //Splitting up the Routine into AMPM.
let currentRoutinePM = [];

function getTime (now) {  //converts the current displayed time to 'civilian' time.
	if (now > 12) {
		now -= 12;
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

function newRoutineItem(TASK, HR, MIN, AMPM) { //creates a 'to do' item, and assigns it a name and a time.
	let newObj = new Object();
	newObj.TASK =TASK;
	newObj.HR = HR;
	newObj.MIN = MIN;
	newObj.AMPM = AMPM;
	return newObj;
}

fileSplit = readFile().split('\n'); //line breaks the list.

function readFile() { //opens a txt file that has the user's current To Do List.
	let wantFile = prompt('Would you like to import your List file?: ');
	if (wantFile == 'y' || wantFile == 'yes' || wantFile == 'Yes') {
		let fileRead = prompt("What's the name of your List file?: ");
		let readIt = fs.readFileSync(fileRead + '.txt', 'utf8');
		return readIt;
	} else {
		console.log('No List file imported');
		let fileSplit = '';
		firstPrompt();
		return fileSplit;
	}
}

(function removeAMPMLines(arr) { //The format of the list includes AM and PM headers that will be need to be removed.
	for (let i in arr) {
		if (arr[i].includes('at') == false) { //all of the list items will have the text ' at ' in it, so it's a good way too filter out the AMPM headers.
			arr.splice(arr.indexOf(arr[i]), 1); //for future use, this is better than the delete method.
		}
	}
})(fileSplit);

const splitArrWords = []; //now divide up the number and word elements.
const splitArrNums = [];

(function splitEm (arr, arr2, arr3) {
	for (let i = 0; i < arr.length; i++) {
		arr2.push(arr[i].match(/[\w][\S]*/g)); //regex that returns all words and gets ride of all spaces
		arr3.push(arr[i].match(/\d/g)) //regex that targets all numbers.
	}
})(fileSplit, splitArrWords, splitArrNums);

const splitArrAMPM = []; //and get the AMPM.

(function getAMPM (arr, arr2) {
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			if (arr[i][j].match(/[AP]M/)) {
				arr2.push(arr[i][j].charAt(arr[i][j].length -2).concat
				(arr[i][j].charAt(arr[i][j].length - 1)));
				arr[i].splice(arr[i].indexOf(arr[i][j]));
			}
		}arr[i] = (arr[i].join(' '));
	}
})(splitArrWords, splitArrAMPM);

(function removeAt (arr) { //and get rid of ' at '
	for (var i = 0; i < arr.length; i++) {
		arr[i] = arr[i].slice(0, -3); //based off of the consistent length of the AMPM and number properties.
	}
})(splitArrWords);

const doubleNums = []; //now double-digit the time numbers.

(function doubleUp (arr, arr2) {
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			if (arr[i][j+1] !== undefined) {
			arr2.push(arr[i][j].concat(arr[i][j+1]));
			arr[i].splice(arr[i][j], 1);
			}
		}
	}
})(splitArrNums, doubleNums);

const mins = []; //every even indexed number will be our minutes.

(function getMins (arr, arr2) {
	for (var i = 0; i < arr.length; i++) {
		if (i !== 0 && i % 2 !== 0) {
			arr2.push(arr[i]);
		}
	}
})(doubleNums, mins);

const hrs = []; //and eveery odd indexed number will be our hours.

(function getHrs (arr, arr2) {
	for (var i = 0; i < arr.length; i++) {
		if (i == 0 || i % 2 == 0) {
			arr2.push(arr[i]);
		}
	}
})(doubleNums, hrs);

//the array of words, hours, minutes and AMPM from our saved to do list are used to create new todo objects.
(function fileInput(arr, arr2, arr3, arr4) {
	for (i in arr) {
		let TASK = arr[i];
		let HOUR = arr2[i];
		let MIN =  arr3[i];
		let AMPM  = arr4[i];
		if (AMPM == 'AM') {
		currentRoutineAM.push(newRoutineItem(TASK, HOUR, MIN, AMPM));
		}
		if (AMPM == 'PM') {
		currentRoutinePM.push(newRoutineItem(TASK, HOUR, MIN, AMPM));
		}
	}
})(splitArrWords, hrs, mins, splitArrAMPM);

//Creates Task objects from user input.
function getUserInput () {
		let TASK = prompt('What would you like to do?: ');
		let HOUR = Number(prompt('At what Hour?(double digits): '));
		let MIN = Number(prompt('And Minutes?(double digits): '));
		let AMPM = prompt('AM or PM?: ').toUpperCase();
	if (AMPM == 'AM') {
		currentRoutineAM.push(newRoutineItem(TASK, HOUR, MIN, AMPM));
	}
	if (AMPM == 'PM') {
		currentRoutinePM.push(newRoutineItem(TASK, HOUR, MIN, AMPM));
	}
}

//Prompt user if they would like to add to their list.
function firstPrompt () {
	let makeItem = prompt('Would you like to add to your List?: ');
	if (makeItem == 'y' || makeItem == 'yes' || makeItem == 'Yes' || makeItem == 'sure') {
		getUserInput();
	} else if (makeItem == 'n' || makeItem == 'no' || makeItem == 'No' || makeItem == 'nah') {
		console.log('Compiling List ...')
	} else {
		console.error('Please answer yes or no.');
		firstPrompt();
	}
}

//firstPrompt(); //The user is prompted to define their first list item.

(function makeAnother() {  //recursively creates more to do items as long as the user says yes. 
	let again = prompt('Add another Item to your To Do List?: ')
	if (again == 'y' || again == 'yes' || again == 'Yes' || again == 'sure') {
		getUserInput();
		makeAnother();
	} else if (again == 'n' || again == 'no' || again == 'No' || again == 'sure') {
		console.log('Compiling List ...');
	} else {
		console.error('Please answer yes or no');
		makeAnother();
	}
})();

currentRoutineAM = currentRoutineAM.sort((a, b) => a.MIN - b.MIN); //sort the minutes and hours numericallly.
currentRoutineAM = currentRoutineAM.sort((a, b) => a.HR - b.HR);

currentRoutinePM = currentRoutinePM.sort((a, b) => a.MIN - b.MIN);
currentRoutinePM = currentRoutinePM.sort((a, b) => a.HR - b.HR);

let twelvesArrAM = []; //and because 1 is greater than 12 in 'civilian' time, reorder all noon and midnight hours.
let twelvesArrPM = [];

function twelveFirst(arr) {
	for (let i = arr.length - 1; i >= 0; i--) {
	  if (arr[i].HR == 12 && arr[i].AMPM == 'AM') {
		twelvesArrAM.push(arr[i]);
		arr.pop();
		
		}
		if (arr[i].HR == 12 && arr[i].AMPM == 'PM') {
			twelvesArrPM.push(arr[i]);
			arr.pop();
		}
		if (arr[i].HR == undefined) {
			break;
		}
	}
}

twelveFirst(currentRoutineAM);
twelveFirst(currentRoutinePM);

twelvesArrAM = twelvesArrAM.sort((a,b) => a.MIN - b.MIN); //and sorted numerically by minutes.
twelvesArrPM = twelvesArrPM.sort((a,b) => a.MIN - b.MIN);

currentRoutineAM = twelvesArrAM.concat(currentRoutineAM); //then twelves will be added back into the routines.
currentRoutinePM = twelvesArrPM.concat(currentRoutinePM);

let finishedAMArr = [];
let finishedPMArr = [];

function prettier (arr) { //creates a standard text presentation of the to do list items.
	for (let i in arr) {
		arr[i].HR = arr[i].HR.toString(); 
		if (arr[i].HR.length == 1) {
			arr[i].HR = '0' + arr[i].HR;
		}
		if (arr[i].HR == '00') { 
			arr[i].HR = '12';
		}
		arr[i].MIN = arr[i].MIN.toString();
		if (arr[i].MIN.length == 1) { 
			arr[i].MIN = '0' + `${arr[i].MIN}`;
		}
		if (arr[i].AMPM == 'AM'){
			finishedAMArr.push(arr[i].TASK + ' at ' + arr[i].HR+ ':' + arr[i].MIN + arr[i].AMPM);
		}
		if (arr[i].AMPM == 'PM') {
			finishedPMArr.push(arr[i].TASK + ' at ' + arr[i].HR+ ':' + arr[i].MIN + arr[i].AMPM);
		}
	}
}

prettier(currentRoutineAM);
prettier(currentRoutinePM);

let finishedArr = //and finally the AMPM lists become one, with AMPM headers addeed.
(['-------------------------AM-----------------------------']).concat
(finishedAMArr).concat
(['-------------------------PM-----------------------------']).concat
(finishedPMArr);

console.log(finishedArr); //and show me the finished results.

(function removeIt(arr, arr2) { //function to delete to do items.
	let removePrompt = prompt('Remove an Item from your List?: ');
	if (removePrompt == 'Y' || 
		removePrompt == 'y' || 
		removePrompt == 'yes' || 
		removePrompt == 'YES') {
				finishedAMArr = [];
				finishedPMArr = [];
				let whichOne = prompt('What Item?: ');
				let isAMPM = prompt('AM or PM?: ');
				for (let i in arr) {
					if (arr[i].TASK == whichOne && 
						arr[i].AMPM == isAMPM) {
					arr.splice(i, 1);
				}
				for (let i in arr2) {
					if (arr2[i].TASK == whichOne && 
						arr2[i].AMPM == isAMPM) {
					arr2.splice(i, 1);
				}
			}
		}prettier(currentRoutineAM);
		prettier(currentRoutinePM);
	}
})(currentRoutineAM, currentRoutinePM);

finishedArr = //after deletion of items from the list, it is redefined
(['-------------------------AM-----------------------------']).concat
(finishedAMArr).concat
(['-------------------------PM-----------------------------']).concat
(finishedPMArr);

const finishedArrString= finishedArr.join('\n'); //and indented.

currentRoutine = currentRoutineAM.concat(currentRoutinePM); //the array of objects is also joined as a final list.

function alertMe (arr, time) { //function that alerts the user to the current hour's tasks.
	for (let i in arr) {
		if (arr[i].charAt(arr[i].length - 7) == time.charAt(0) && 
		arr[i].charAt(arr[i].length - 6) == time.charAt(1) && 
		arr[i].charAt(arr[i].length -2) == time.charAt(5)) {
		console.log("This Hour's Tasks: " + arr[i]);
		}
	}
}

function writeIt() { //function that prompts user to save txt file.
	let writePrompt = prompt('Would you like to save your list?: ');
	if (writePrompt == 'y' || writePrompt == 'yes' || writePrompt == 'Yes') {
		let fileName = prompt('What would you like to name your file?: ');
		fs.writeFile(fileName + '.txt', finishedArrString, () => {
			console.log(fileName + '.txt was saved.');
		});
	}else {
		console.log('List not saved.');
	}
}

//final presentation in the console:
console.log('-----------------------MY-LIST--------------------------');
console.log(finishedArrString);
console.log('--------------------------------------------------------');
alertMe(finishedArr, currentTime);
console.log('The Current Time is: ' + currentTime);
console.log('--------------------------------------------------------');
writeIt();