
var root = null;

export function setRoot(newRoot) {
    root = newRoot;
}

export function getIsOverlapping(div1, div2) {
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

export function getIsOverlappingAnythingInList(div, otherDivList) {
    for (var other of otherDivList) {
        if (getIsOverlapping(div, other)) {
            return true;
        }
    }
    return false;
}

export function deleteNode(node) {
    node.parentNode.removeChild(node);
}

export function addText({text, x, y, center=false, style}) {
    // console.log('addText', parent, text, style);
    const textNode = document.createTextNode(text);
    const div = document.createElement('div');

    const extendedStyle = {
        position: 'absolute',
        left: x + 'px',
        top: y + 'px',
        whiteSpace: 'nowrap',
        width: 'fit-content',
        transform: center ? 'translateX(-50%)' : null,
        ...style
    }

    Object.assign(div.style, extendedStyle);
    div.appendChild(textNode);
    root.appendChild(div);   
    return div; 
}

export function addRect({x, y, width, height, color, style}) {
    const div = document.createElement('div');
    const extendedStyle = {
        position: 'absolute',
        left: x + 'px',
        top: y + 'px',
        width: width + 'px',
        height: height + 'px',
        backgroundColor: color,
        ...style
    }
    console.log('addRect style', extendedStyle);
    Object.assign(div.style, extendedStyle);
    root.appendChild(div);
    return div;
}
