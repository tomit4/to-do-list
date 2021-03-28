const prompt = require('prompt-sync')(); //importing the node js module necessary to prompt user
const fs = require('fs'); //and read/save files
let currentRoutineAM = []; //where we'll put our AM routine objects
let currentRoutinePM = []; //same for PM routine objeccts

function newRoutineItem(TASK, HR, MIN, AMPM) { //object constructor that creates the todo tasks
	let newObj = new Object();
	newObj.TASK =TASK;
	newObj.HR = HR;
	newObj.MIN = MIN;
	newObj.AMPM = AMPM;
	return newObj;
}

let fileSplit = readFile().split('\n');//whatever text document is read is split into an array by it's line breaks

function readFile() { //function that prompts the user for the name of their already existing list file
	let wantFile = prompt('Would you like to import your List file?: ');
	if (wantFile == 'y' || wantFile == 'yes' || wantFile == 'Yes') {
		let fileRead = prompt("What's the name of your List file?: ");
		let readIt = fs.readFileSync(fileRead + '.txt', 'utf8');
		return readIt;
	} else {
		console.log('No List file imported');
		let fileSplit = '';
		return fileSplit;
	}
}

(function removeAMPMLines(arr) { //function that removes the AMPM divisions in the todo list based off of whether or not the element has the word 'at' in it (a little janky I know)
	for (let i in arr) {
		if (arr[i].includes('at') == false) {
			arr.splice(arr.indexOf(arr[i]), 1);
		}
	}
})(fileSplit);

const splitArrWords = [];//array to store the string elements of the existing list
const splitArrNums = [];//same for the number elements

(function splitEm (arr, arr2, arr3) {//function that takes the file and splits up it's elements to be parsed into TASK, HOUR, MIN
	for (let i = 0; i < arr.length; i++) {
		arr2.push(arr[i].match(/[\w][\S]*/g));
		arr3.push(arr[i].match(/\d/g))
	}
})(fileSplit, splitArrWords, splitArrNums);

const splitArrAMPM = [];//array to store the AM or PM elements

(function getAMPM (arr, arr2) {//function that iterates through the splitArrWords array and pushes either AM or PM to the splitArrAMPM array, as well as removes the AMPM string from the splitArrWords array
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			if (arr[i][j].match(/[AP]M/)) {//matches any character A or P followed by M
				arr2.push(arr[i][j].charAt(arr[i][j].length -2).concat//and pushes the second to last character concatenated with the last character of that element to the splitArrAMPM array
				(arr[i][j].charAt(arr[i][j].length - 1)));
				arr[i].splice(arr[i].indexOf(arr[i][j]));//and then deletes those characters
			}
		}arr[i] = (arr[i].join(' '));//and then creates a string with the final elements divided up by a space.
	}
})(splitArrWords, splitArrAMPM);

(function removeAt (arr) {//function that iterates over the splitArrWords array and deletes the ' at' part of the string
	for (var i = 0; i < arr.length; i++) {
		arr[i] = arr[i].slice(0, -3);
	}
})(splitArrWords);

const doubleNums = [];//array to store the numbers concatenated together for HR and MIN values.

(function doubleUp (arr, arr2) {//function that concatenates
	for (var i = 0; i < arr.length; i++) {
		for (var j = 0; j < arr[i].length; j++) {
			if (arr[i][j+1] !== undefined) {
			arr2.push(arr[i][j].concat(arr[i][j+1]));//every other number
			arr[i].splice(arr[i][j], 1);//and then deletes it after pushing it to the new doubleNums array.
			}
		}
	}
})(splitArrNums, doubleNums);

const mins = [];//and now to divy up the doubleNums into HR and Mins

(function getMins (arr, arr2) {//function that pushes every odd indexed element from doubleNums array into the mins array
	for (var i = 0; i < arr.length; i++) {
		if (i !== 0 && i % 2 !== 0) {
			arr2.push(arr[i]);
		}
	}
})(doubleNums, mins);

const hrs = []; //same as mins, but for the HR element

(function getHrs (arr, arr2) {//and every even indexed element of the doublenums array will be pushed to hrs array
	for (var i = 0; i < arr.length; i++) {
		if (i == 0 || i % 2 == 0) {
			arr2.push(arr[i]);
		}
	}
})(doubleNums, hrs);

(function fileInput(arr, arr2, arr3, arr4) {//finally we have a function that creates the objects and pushes them to the currentRoutine arrays, taking four arrays and using their commonly indexed 'addresses' to create the new objects
	for (i in arr) { //I have to figure out when to use this vs a standard for loop..
		let TASK = arr[i];
		let HR = arr2[i];
		let MIN =  arr3[i];
		let AMPM  = arr4[i];
		if (AMPM == 'AM') {
		currentRoutineAM.push(newRoutineItem(TASK, HR, MIN, AMPM));
		}
		if (AMPM == 'PM') {
		currentRoutinePM.push(newRoutineItem(TASK, HR, MIN, AMPM));
		}
	}
})(splitArrWords, hrs, mins, splitArrAMPM);

currentRoutineAM = currentRoutineAM.sort((a, b) => a.MIN - b.MIN);//interestingly, sorting by MIN before HR is effective,
currentRoutineAM = currentRoutineAM.sort((a, b) => a.HR - b.HR);//I first ordered  by HR and it didn't sort correctly..

currentRoutinePM = currentRoutinePM.sort((a, b) => a.MIN - b.MIN);
currentRoutinePM = currentRoutinePM.sort((a, b) => a.HR - b.HR);

let twelvesArrAM = [];//and now to make sure that '12' is always first, which again, requires more arrays to push to.
let twelvesArrPM = [];

function twelveFirst(arr) {//first time I've used a for loop that starts from the end..
//it searches for any element that has 12 and pushes it to it's respective twelvesArr array based off of AM/PM element
	for (let i = arr.length - 1; i >= 0; i--) {
	  if (arr[i].HR == '12' && arr[i].AMPM == 'AM') {
		twelvesArrAM.push(arr[i]);
		arr.pop();//and deletes the last element once found so it doesn't infinitely fill the twelvesArr arrays
		
		}
		if (arr[i].HR == '12' && arr[i].AMPM == 'PM') {
			twelvesArrPM.push(arr[i]);
			arr.pop();
		}
	}
}

twelveFirst(currentRoutineAM);//extracts the 12s from the currentRoutine arrays
twelveFirst(currentRoutinePM);

twelvesArrAM = twelvesArrAM.sort((a,b) => a.MIN - b.MIN);//and sorts the new arrays by MIN
twelvesArrPM = twelvesArrPM.sort((a,b) => a.MIN - b.MIN);

currentRoutineAM = twelvesArrAM.concat(currentRoutineAM);//and then concatenates them to the currentRoutine arrays, which again, don't have anything with the HR element of '12' until this is done.
currentRoutinePM = twelvesArrPM.concat(currentRoutinePM);

let finishedAMArr = [];//more empty arrays to put our pretty string/text version of our list
let finishedPMArr = [];

function prettier (arr) {//function that standardizes the format of our list elements
	for (let i in arr) {
		arr[i].HR = arr[i].HR.toString(); 
		if (arr[i].HR.length == 1) {
			arr[i].HR = '0' + arr[i].HR;//if the length of the HR element is less than 1, add a '0' to the beginning of it (i.e. '1' becomes '01')
		}
		if (arr[i].HR == '00') { //looking back on it, this part may not be necessary, but is here in case the user puts in the military '00' for noon or midnight.
			arr[i].HR = '12';
		}
		arr[i].MIN = arr[i].MIN.toString();//same deal as the HR change to '0' + above
		if (arr[i].MIN.length == 1) { 
			arr[i].MIN = '0' + arr[i].MIN;
		}
		if (arr[i].AMPM == 'AM'){//and this is where we add the ' at ' string which also allows us to jankily divy up our read list earlier
			finishedAMArr.push(arr[i].TASK + ' at ' + arr[i].HR+ ':' + arr[i].MIN + arr[i].AMPM);
		}
		if (arr[i].AMPM == 'PM') {
			finishedPMArr.push(arr[i].TASK + ' at ' + arr[i].HR+ ':' + arr[i].MIN + arr[i].AMPM);
		}
	}
}

prettier(currentRoutineAM);//making our list pretty for the user..
prettier(currentRoutinePM);

//below the list is further formated to display in the terminal somewhat nicely, this is where AM and PM are finally joined into a full to do list

let finishedArr = (['------------------YOUR CURRENT LIST---------------------']).concat
(['-------------------------AM-----------------------------']).concat
(finishedAMArr).concat
(['-------------------------PM-----------------------------']).concat
(finishedPMArr).concat(['--------------------------------------------------------']);

let finishedArrString= finishedArr.join('\n');//and formatted with line breaks

//it was pleasant to discover how to get js files to 'talk' to one another using this in conjunction with the requires syntax in node
//I accidentally stumbled across the import/export syntax from ES6 while researching this and wished I could use both, but apparently changing
//the package.json file or using the .mjs format in conjunction with import/export is a big nono, combining ES6 syntax (import/export) with CommmonJS (module.exxports/require)

module.exports = {newRoutineItem, currentRoutineAM, currentRoutinePM, twelvesArrAM, 
twelvesArrPM, finishedAMArr, finishedPMArr, finishedArr, finishedArrString};