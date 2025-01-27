import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {people} from "../data/people.js"

var thingsOnScreen = []

const root = document.getElementById('timeline');
console.log('root', root);

function addText(parent, text, style) {
    console.log('addText', parent, text, style);
    const textNode = document.createTextNode(text);
    const div = document.createElement('div');
    Object.assign(div.style, style);
    div.appendChild(textNode);
    parent.appendChild(div);
}

function makeThing(thing) {
    const style = {
        position: 'absolute',
        left: ((thing.born + thing.died) / 2) + 'px',
        top: (Math.random() * 500) + 'px',
        // color: 'red'
    }
    addText(root, thing.name, style);
}


for(var person of people) {
    console.log('person', person);

    makeThing(person);

}

