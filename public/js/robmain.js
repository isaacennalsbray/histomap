// import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {people} from "../data/people.js"
import {
    getIsOverlapping, getIsOverlappingAnythingInList, 
    setRoot, addText, addRect, deleteNode
} from "./util.js"

setRoot(document.getElementById('timeline'));

const this_year = 2025;

// Give half space to after 1500. Half to -500 to 1500
var offset = 2200;
var min_year = -1000;
var max_year = 2025;
var range = 4000.0;
function yearToXPos(year) {
    const minV = Math.log(offset - min_year);
    const maxV = Math.log(offset - max_year);
    const thisV = Math.log(offset - year);
    return range - (range * ((thisV - maxV) / (minV - maxV)))
}

var global_namesOnScreen = [];

function makeThing(thing, attempts=20) {
    if (attempts == 0) {
        console.log('could not place ' + thing.name);
        return;
    }

    const centerYear = (thing.born + (thing.died ?? this_year)) / 2;

    const yPos = Math.random() * 500;
    const nameNode = addText({
        text: thing.name, center:true,
        x: yearToXPos(centerYear), y: yPos,
        style: {padding: '5px'}
    })

    if (getIsOverlappingAnythingInList(nameNode, global_namesOnScreen)) {
        deleteNode(nameNode);
        return makeThing(thing, attempts - 1);
    } else {
        global_namesOnScreen.push(nameNode);
    }

    addRect({
        x: yearToXPos(thing.born), y: yPos + 24,
        width: (yearToXPos(thing.died ?? this_year) - yearToXPos(thing.born)),
        color: '#ddd',
        height: 2,
        style: {zIndex: -10}      
    })
}

for(var person of people) {
    makeThing(person);
}

console.log('globals', global_namesOnScreen);


