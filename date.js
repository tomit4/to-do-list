/*This is a simple series of a variable definition and a function that
will return the current date in American standard human readable format.
It was taken from Free Code Camp (with a repetetive series of if statements
that format it with an added '0' if needed, this creates consisttency iin the length
of the string, which allows for easier string manipulation, although
I wonder about a less verbose way of accomplishing this same result)
*/

const todaysDate = new Date();//Creates a new Date Object
//next objective will be to use node module prompt-sync to allow
//the user to create their own dates for their todo lists

function formatDate(date, format) {//Takes a date object, and a format string as arguments
    const map = { //and passes the new date through a series of Date methods
        mm: (date.getMonth() + 1).toString(),//month + 1 to account for array staring at 0 for month..
        dd: date.getDate().toString(),//day
        yy: date.getFullYear().toString().slice(-2)//year
    }//what follows is a series of if statements that add 0 to the begining if the length of the month, day, or year properties
    //are less than 1, essentially if the number is less than 10, it dispalys as, for example 01 instead of 1 
    //there is probably a less verbose way of accomplishing this..
    if (map.mm.length == 1) {
        map.mm = '0' + map.mm;
    }
    if (map.dd.length == 1) {
        map.dd = '0' + map.dd;
    }
    if (map.yy.length == 1) {
        map.yy = '0' + map.yy;
    }
    return format.replace(/mm|dd|yy/gi, matched => map[matched]);//utilizes the String.replace method
    //to essentially filter the date object and return an American human readable format
}

console.log(formatDate(todaysDate, 'mm/dd/yy'));