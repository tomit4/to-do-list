const readList = require('./readlist.js');//and now I understand a bit more about how JS files 'talk to one another'
const prompt = require('prompt-sync')();//yep, still need this

let currentRoutineAM = readList.currentRoutineAM,//making the syntax from readlist.js all the same for this file
    currentRoutinePM = readList.currentRoutinePM,
    newRoutineItem = readList.newRoutineItem,
    twelvesArrAM = readList.twelvesArrAM,
    twelvesArrPM = readList.twelvesArrPM,
    finishedAMArr = readList.finishedAMArr,
    finishedPMArr = readList.finishedPMArr,
    finishedArr = readList.finishedArr,
    finishedArrString = readList.finishedArrString; //after seeing how destructuring works, I can see that this would be a good place to do so, but I'll leave it for now.

console.log(finishedArrString);//gives me the current state of the list at this time

function getUserInput () {//this function is yet another constructor similar to newRoutineItem function from readlist.js
    let TASK = prompt('What would you like to do?: ');
    let HOUR = Number(prompt('At what Hour?(double digits): '));
    let MIN = Number(prompt('And Minutes?(double digits): '));
    let AMPM = prompt('AM or PM?: ').toUpperCase();
if (AMPM == 'AM') {
    currentRoutineAM.push(newRoutineItem(TASK, HOUR, MIN, AMPM));//and yet another item is added to the array of list objects, hooray!
}
if (AMPM == 'PM') {
    currentRoutinePM.push(newRoutineItem(TASK, HOUR, MIN, AMPM));
}
}

function firstPrompt () {//function that prompts the user if they'd like to add an item to the list
let makeItem = prompt('Would you like to add to your List?: ');
if (makeItem == 'y' || makeItem == 'yes' || makeItem == 'Yes' || makeItem == 'sure') {
    getUserInput();
} else if (makeItem == 'n' || makeItem == 'no' || makeItem == 'No' || makeItem == 'nah') {
    console.log('Compiling List ...');//I'd like to add an asynchronous function with setTimeout here, but I think I need to know more about asynchronous programming before doing so
	//simply adding a setTimeout(() => console.log('Compiling List ....'), 2000); line doesn't quite work, as it waits until all other prompts and displays are done until displaying it..another cool feature to add/thing to learn.
} else {
    console.error('Please answer yes or no.');
    firstPrompt();
}
}

firstPrompt();//immediately invoked, first thing the user sees after the finishedArrString is logged to the console.

(function makeAnother() {//recursively prompts the user if they'd like to make another list object, until they answer no,
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


currentRoutineAM = currentRoutineAM.sort((a, b) => a.MIN - b.MIN);//and now we have pretty much identical processes to the latter part of the readlist.js code
currentRoutineAM = currentRoutineAM.sort((a, b) => a.HR - b.HR);//sorting the currentRoutine arrays..

currentRoutinePM = currentRoutinePM.sort((a, b) => a.MIN - b.MIN);
currentRoutinePM = currentRoutinePM.sort((a, b) => a.HR - b.HR);

twelvesArrAM = [];//and parsing out the 12s
twelvesArrPM = [];

function twelveFirst(arr) { //certain functions I couldn't figure out why I couldn't simply import them, such as this one,
//for whatever reason it would call the function, but not push it to the twelvesArr arrays..I'm not sure why I had to redefine twelvesFirst function here..
	for (let i = arr.length - 1; i >= 0; i--) {
	  if (arr[i].HR == '12' && arr[i].AMPM == 'AM') {
		twelvesArrAM.push(arr[i]);
		arr.pop();
		}
		else if (arr[i].HR == '12' && arr[i].AMPM == 'PM') {
			twelvesArrPM.push(arr[i]);
			arr.pop();
		}
	}
}


twelveFirst(currentRoutineAM);//same as in readlist.js
twelveFirst(currentRoutinePM);

twelvesArrAM = twelvesArrAM.sort((a,b) => a.MIN - b.MIN);//same as in readlist.js
twelvesArrPM = twelvesArrPM.sort((a,b) => a.MIN - b.MIN);

currentRoutineAM = twelvesArrAM.concat(currentRoutineAM);
currentRoutinePM = twelvesArrPM.concat(currentRoutinePM);


finishedAMArr = [];
finishedPMArr = [];

function prettier (arr) { //similar issue to the twelveFirst function, couldn't import it and
//have it work at the same time..
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

finishedArr = 
finishedArr = (['------------------YOUR CURRENT LIST---------------------']).concat
(['-------------------------AM-----------------------------']).concat
(finishedAMArr).concat
(['-------------------------PM-----------------------------']).concat
(finishedPMArr).concat(['--------------------------------------------------------']);

finishedArrString= finishedArr.join('\n');

console.log(finishedArrString);//gives the current state of the list after the user adds items to their list (or doesn't)

function removeIt(arr, arr2, removeFunc) {//prompts the user if they'd like to remove an item from their list
	let removePrompt = prompt('Remove an Item from your List?: ');
	if (removePrompt == 'Y' || 
		removePrompt == 'y' || 
		removePrompt == 'yes' || 
		removePrompt == 'YES') {
				removeFunc(arr, arr2);//calls a function that presumably will remove an item
				removeAnother();//and also calls a function that will presumably recursively prompt the user if they'd like to remove another item.
	} else {
		console.log('Compiling List ...');//otherwise the list remains unchanged and we'll presumably display the state of the list
	}
}

function removeItems(arr, arr2) {//prompts the user to tell the program exactly which item they'd like removed (spelling, capitalization, the TASK must be spelled exactly to work)
	let whichOne = prompt('What Item?: ');
				let isAMPM = prompt('AM or PM?: ');//prompts the user if said item to be removed is from the AM or PM currentRoutine array.
				for (let i in arr) {
					if (arr[i].TASK == whichOne && 
						arr[i].AMPM == isAMPM) {
					arr.splice(i, 1);//I have to admit I was delighted when I found out about this simple splice feature that acts more or less like the 'delete' feature, but without having to call arr.filter(Boolean) on it afterwards.
				}
				for (let i in arr2) {
					if (arr2[i].TASK == whichOne && 
						arr2[i].AMPM == isAMPM) {
					arr2.splice(i, 1);
				}
			}
		}
	}

removeIt(currentRoutineAM, currentRoutinePM, removeItems);//and here we call the function removeIt to delete the specified items from the array of objects

function removeAnother() {//pretty much a copy pastad function from the makeAnother function, with some small adjustments, that recursively allows the user to delete list items
	let again = prompt('Remove another Item from your To Do List?: ')
	if (again == 'y' || again == 'yes' || again == 'Yes' || again == 'sure') {
		removeItems(currentRoutineAM, currentRoutinePM);
		removeAnother();
	} else if (again == 'n' || again == 'no' || again == 'No' || again == 'sure') {
		console.log('Compiling List ...');
	} else {
		console.error('Please answer yes or no');
		removeAnother();
	}
}

finishedAMArr = [];//and once again we redefine the arrays to store the finished list to nothing, as we will use the prettier function to push the newly compiled lists from currentRoutine arrays into them.
finishedPMArr = [];

prettier(currentRoutineAM);//making em pretty..
prettier(currentRoutinePM);

finishedArr = 
finishedArr = (['------------------YOUR CURRENT LIST---------------------']).concat
(['-------------------------AM-----------------------------']).concat
(finishedAMArr).concat
(['-------------------------PM-----------------------------']).concat
(finishedPMArr).concat(['--------------------------------------------------------']);

finishedArrString= finishedArr.join('\n');//and prettier..

module.exports = {finishedArr, finishedArrString};//wow, not nearly as many things to export this time..