A simple NPM package to get boundary indexes from JSON string or normal string easily and faster.

## What is Boundary
Here `boundary` indecates `spacial area` which `need to track`. Generally in `JSON` string there may have Objects, Arrays or internal strings. If we need to track their start or end indexes, we can use `JB `[Json Boundary ] 

## When we need this
* When we work with json string we may need to apply regex on it. but we don't want to capture anything from a boundary area who has a special starting & ending char. Then we can get their indexes , can do more complex operation and can apply regex with own logic easily.
* We can find how many strings, objects , arrays or boundaries in our string and can find their size form the start & end indexes.
* When we need to simplify our complex json string .

## Installation
```
npm install json-boundary
```
## Implementation
```
import { JsonBoundary } from "json-boundary";
const JB = new JsonBoundary();

const string = `(string= !"(a='4' && b=6)") && id=50 && tag = [["abc\'d","(xyz)"],{'abc':true},1,2]`;
console.log(JB.getBoundaries(string)); 

// output: [ { start: 10, end: 25 }, { start: 46, end: 81 } ]

/************************************************************** get simple version of our string */
const { str: simpleVersion, id } = JB.getSimple(string, "###");
console.log(simpleVersion);

// output: (string= !###) && id=50 && tag = ###

/************************************************************** now easily apply regex or any other operation to our simple string */
const modified = simpleVersion.replace(
  /(string)(=)(.+###)/g,
  (m, g1, g2, g3) => {
    return `"${g1}":{"equals":${g3.trim()}}`; // replace match with "string":{"equals":!###}"
  }
);
console.log(JB.replaceOriginal(modified, id)); 

// output: ("string":{"equals":!"(a='4' && b=6)") && id=50 && tag = [["abc'd","(xyz)"],{'abc':true},1,2]}

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
  mileStones: "=<>!", // you can change other options also
});

const str = `(string= !"(a='4' && b=6)") && (tag : [["abc\'d","(xyz)"],{'abc':true},1,2])`;
const boundaries = JB.getBoundaries(str);

console.log(boundaries); 


//  [ { start: 10, end: 25 } ] 
//  maShaAllah it capture only string boundary
```

## Features
* `getBoundaries` ⇒ ok // @param `originalString`, `callback(`startIndex, currentIndex, flag`)` ⇒ this call ones for every charerter's index of the string if provided ; @return all boundary indexes
	Here, startIndex = last boundary start point, end= current char index of the original string. flag | -1= outside the boundary | 1 = boundary area is running | 0 = boundary area is end.
	Here, startIndex = last boundary start point, end= current char index of the original string. flag | -1= outside the boundary | 1 = boundary area is running | 0 = boundary area is end.
* `getSimple`        ⇒ ok  // @param `originalString`, `identifier` ; @return a simplify version of original string and a tracking id to perform operation/s
* `replaceOriginal` ⇒ ok   // @param `modifiedString, trackingId`; @return replace the original boundary content to  our modified string then return it.
* getBoundaryMap ⇒ may be in Progress if needed  // @param originalString; @return all boundaries with nasted operation
* others may be included if needed InshaAllah.
## Contributing
Contributions are warmly welcomed! Feel free to submit a Pull Request or open an Issue with any suggestions or improvements.
