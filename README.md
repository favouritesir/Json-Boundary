A simple NPM package to get boundary indexes from JSON string or normal string easily and faster.

## What is Boundary
Here `boundary` indecates `spacial area` which `need to track`. Generally in `JSON` string there may have Objects, Arrays or internal strings. If we need to track their start or end indexes, we can use `JB `[Json Boundary ] 

# About V1
In this version there is only one implemention whrere **there is no nasted operation.**

## When we need this
When we work with json string we may need to apply regex on it. but we don't want to capture anything from a boundary area who has a special starting & ending char. Then we can get their indexes , can do more complex operation and can apply regex with own logic easily.

We can find how many strings, objects , arrays or boundaries in our string and can find their size form the start & end indexes.

## Lets see an Example
```Javascript
const JB = new JsonBoundary();
const string = '(string= !"(a='4' && b=6)") && id=50 && tag = [["abc\'d","(xyz)"],{'abc':true},1,2]';
console.log(JB.getBoundaries(string)); 

// output: [ { start: 10, end: 25 }, { start: 46, end: 81 } ]
```

## Initialization
```
npm install json-boundary
```
## Implementation
```
import { JsonBoundary } from "json-boundary";
const JB = new JsonBoundary();

const str = `(string= !"(a='4' && b=6)") && (tag = [["abc\'d","(xyz)"],{'abc':true},1,2])`;
const boundaries = JB.getBoundaryIndexes(str);

console.log(boundaries); // [ { start: 10, end: 25 }, { start: 38, end: 73 } ]
```
## Explanation
```Basic
Here default setup is: 
setup={
  mileStones: "!:=@<->^?*$#",
  ignoreCharSet: ";&|",
  boundaries: {
    "[": "]",
    "{": "}",
    '"': '"',
    "'": "'",
  },
}
Where ,
  mileStones    ==> Mile stones tell to start finding boundaries.
  ignoreCharSet ==> Ignore Char inspire to find new mileStone again to start the finding operation.
  boundaries    ==> Boundaries tell to find boundaries between these characters.
  
NB: We can chagange this setup by passing an object during instant creation.
```
## Change the default setup
Suppose our new milestons= "=<>!"
our string is: `(string= !"(a='4' && b=6)") && (tag : [["abc\'d","(xyz)"],{'abc':true},1,2])`
here we just replace "tag =" to "tag :"
Now let see the result
```Javascript
import { JsonBoundary } from "json-boundary";
const JB = new JsonBoundary({
  mileStones: "=<>!",
});

const str = `(string= !"(a='4' && b=6)") && (tag : [["abc\'d","(xyz)"],{'abc':true},1,2])`;
const boundaries = JB.getBoundaryIndexes(str);

console.log(boundaries); 


//  [ { start: 10, end: 25 } ] 
//  maShaAllah it capture only string boundary
```

## Features:
* getBoudnaryIndexes ⇒ ok // @param orginalString; @return all boundary indexes
* getSimplyVersion ⇒ in Progress  // @param orginalString ; @return a simple string and a tracking id to perform operation
* replaceOrginalContent ⇒ in Progress   // @param trackingId, modifiedString; @return replace the orginal boundary content to  
                                                our modified string then return it.
* getBoundaryMap ⇒ in Progress  // @param orginalString; @return all boundaries with nasted operation
* others may be included if needed InshaAllah.
## Contributing:
Contributions are warmly welcomed! Feel free to submit a Pull Request or open an Issue with any suggestions or improvements.


