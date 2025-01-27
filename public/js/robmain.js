import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {people} from "../data/people.js"

const startYear = -1000;
const endYear = 2025;
const map_height = 500;
const this_year = 2025;

var thingsOnScreen = []

const root = document.getElementById('timeline');
console.log('root', root);

function getIsOverlapping(div1, div2) {
    // Get the bounding rectangles of both elements
    const rect1 = div1.getBoundingClientRect();
    const rect2 = div2.getBoundingClientRect();
    
    // Check if one rectangle is completely to the left of the other
    if (rect1.right < rect2.left || rect2.right < rect1.left) {
        return false;
    }
    
    // Check if one rectangle is completely above the other
    if (rect1.bottom < rect2.top || rect2.bottom < rect1.top) {
        return false;
    }
    
    // If neither of the above conditions is true, the rectangles are overlapping
    return true;
}

function getIsOverlappingAnythingInList(div, otherDivList) {
    for (var other of otherDivList) {
        if (getIsOverlapping(div, other)) {
            return true;
        }
    }
    return false;
}

function addText(parent, text, style) {
    // console.log('addText', parent, text, style);
    const textNode = document.createTextNode(text);
    const div = document.createElement('div');
    Object.assign(div.style, style);
    div.appendChild(textNode);
    parent.appendChild(div);   
    return div; 
}

function addBox(parent, style) {
    const div = document.createElement('div');
    Object.assign(div.style, style);
    parent.appendChild(div);
    return div;
}

function deleteNode(node) {
    node.parentNode.removeChild(node);
}

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
    const style = {
        position: 'absolute',
        left: yearToXPos(centerYear) + 'px',
        top: yPos + 'px',
        whiteSpace: 'nowrap',
        padding: '5px',
        width: 'fit-content',
        transform: 'translateX(-50%)'
    }
    const nameNode = addText(root, thing.name, style);

    if (getIsOverlappingAnythingInList(nameNode, global_namesOnScreen)) {
        // console.log('overlapping. GIving up for ' + thing.name);
        console.log('overlapping. Trying again for: ' + thing.name + ' - attempt ' + attempts);
        deleteNode(nameNode);
        return makeThing(thing, attempts - 1);
    } else {
        global_namesOnScreen.push(nameNode);
    }

    const boxStyle = {
        position: 'absolute',
        left: yearToXPos(thing.born) + 'px',
        width: (yearToXPos(thing.died ?? this_year) - yearToXPos(thing.born)) + 'px',
        top: (yPos + 24) + 'px',
        backgroundColor: '#ddd',
        zIndex: -10,
        height: '2px'
    }
    addBox(root, boxStyle);

}


for(var person of people) {
    console.log('person', person);

    makeThing(person);
}

console.log('globals', global_namesOnScreen);


