import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import {people} from "../data/people.js"

const timelineData = people;
const currentYear = new Date().getFullYear();

// Explicitly define the periods
const periods = [];
let period = {
    start: currentYear - 10,
    end: currentYear,
    label: "Last 10 years"
};

// Generate periods working backwards
for (let i = 0; i < 12; i++) {
    periods.push(period);
    period = {
        start: period.start - (period.end - period.start) * 2,
        end: period.start,
        label: `${period.end - (period.end - period.start) * 2} to ${period.start}`
    };
}

periods.reverse();

// Set up dimensions
const margin = { top: 40, right: 100, bottom: 60, left: 100 };
const width = 2000 - margin.left - margin.right;
const height = 800 - margin.top - margin.bottom;

// Create a container div for scrolling
const container = d3.select("#timeline")
    .style("overflow-x", "auto")
    .style("width", "100%")
    .style("padding", "20px 0");

// Create SVG
const svg = container
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Create scale for the periods
const periodScale = d3.scaleLinear()
    .domain([0, periods.length])
    .range([0, width]);

// Function to map a year to x position
function yearToX(year) {
    const period = periods.find(p => year >= p.start && year <= p.end);
    if (!period) {
        const firstPeriod = periods[0];
        const lastPeriod = periods[periods.length - 1];
        if (year < firstPeriod.start) return 0;
        if (year > lastPeriod.end) return width;
    }
    
    const periodIndex = periods.indexOf(period);
    const periodWidth = width / periods.length;
    const periodStart = periodIndex * periodWidth;
    
    const fraction = (year - period.start) / (period.end - period.start);
    return periodStart + (fraction * periodWidth);
}

// Add period boundaries
periods.forEach((period, i) => {
    svg.append("line")
        .attr("class", "period-boundary")
        .attr("x1", periodScale(i))
        .attr("x2", periodScale(i))
        .attr("y1", 0)
        .attr("y2", height)
        .attr("stroke", "#ddd")
        .attr("stroke-dasharray", "2,2");

    svg.append("text")
        .attr("x", periodScale(i))
        .attr("y", height + 20)
        .attr("text-anchor", "middle")
        .text(period.start);
});

// Add final year label
svg.append("text")
    .attr("x", width)
    .attr("y", height + 20)
    .attr("text-anchor", "middle")
    .text(currentYear);

// Function to check if two name labels would overlap
function wouldOverlap(x1, x2, y, placedLabels) {
    const TEXT_HEIGHT = 20;
    const nameWidth = 150; // Approximate width of name label
    
    for (const label of placedLabels) {
        // Check if there's any horizontal overlap
        const horizontalOverlap = Math.max(x1, label.x1) <= Math.min(x2, label.x2);
        // Check if there's any vertical overlap
        const verticalOverlap = Math.abs(y - label.y) < TEXT_HEIGHT;
        
        if (horizontalOverlap && verticalOverlap) {
            return true;
        }
    }
    return false;
}

// Place labels using random sampling
const placedLabels = [];
const MARGIN_TOP = 40;
const MARGIN_BOTTOM = 40;
const MAX_ATTEMPTS = 20;
const NAME_WIDTH = 75; // Half width of name label

// Process people in random order
const shuffledData = [...timelineData].sort(() => Math.random() - 0.5);

shuffledData.forEach(person => {
    const deathYear = person.died === null ? currentYear : person.died;
    const x = yearToX(person.born + (deathYear - person.born) / 2);
    
    let placed = false;
    for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
        // Random y position between margins
        const y = MARGIN_TOP + Math.random() * (height - MARGIN_TOP - MARGIN_BOTTOM);
        
        if (!wouldOverlap(x - NAME_WIDTH, x + NAME_WIDTH, y, placedLabels)) {
            placedLabels.push({
                x1: x - NAME_WIDTH,
                x2: x + NAME_WIDTH,
                y: y
            });
            person.y = y;
            person.placed = true;
            placed = true;
            break;
        }
    }
    
    if (!placed) {
        person.placed = false;
        console.log(`Could not place: ${person.name}`);
    }
});

// Add timeline lines and labels only for successfully placed items
const items = svg.selectAll(".timeline-item")
    .data(timelineData.filter(d => d.placed))
    .join("g")
    .attr("class", "timeline-item");

// Add timeline lines
items.append("line")
    .attr("stroke", "#666")
    .attr("stroke-width", 2)
    .attr("x1", d => yearToX(d.born))
    .attr("x2", d => yearToX(d.died === null ? currentYear : d.died))
    .attr("y1", d => d.y)
    .attr("y2", d => d.y);

// Add names
items.append("text")
    .attr("text-anchor", "middle")
    .attr("x", d => yearToX(d.born + ((d.died === null ? currentYear : d.died) - d.born) / 2))
    .attr("y", d => d.y - 8)
    .text(d => d.name);

// Styles
const styles = `
#timeline {
    border: 1px solid #ddd;
    border-radius: 4px;
}

.timeline-item text {
    font-family: sans-serif;
    font-size: 14px;
}

.timeline-item line:hover {
    stroke: #000;
    stroke-width: 3;
}

.timeline-item text:hover {
    font-weight: bold;
}

#timeline::-webkit-scrollbar {
    height: 8px;
}

#timeline::-webkit-scrollbar-track {
    background: #f1f1f1;
}

#timeline::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}
`;

const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);