// set the dimensions and margins of the graph
let par = document.getElementById('my_dataviz');
let w = par.offsetWidth;
let h = par.offsetHeight;
console.log(w, h);

const margin = { top: 0, right: 0, bottom: 0, left: 0 },
    width = w - margin.left - margin.right, // 460
    height = h - margin.top - margin.bottom; // 400

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    // .attr("transform", `translate(${margin.left}, ${margin.top})`)
    .call(d3.zoom().on("zoom", function (event) {
        svg.attr("transform", event.transform)
     }))
    .append("g");

//Read the data
d3.csv("https://gist.githubusercontent.com/iyzg/172dd2bb76f4c5c582dfd8b969fdce24/raw/a1840b03f486442285537209ae291466211b255e/real-resolutions.csv").then(function (data) {

    // Add X axis
    console.log(d3.extent(data, d => parseFloat(d.x)));
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => parseFloat(d.x)))
        .range([0, width]);

    // Add Y axis
    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => parseFloat(d.y)))
        .range([height, 0]);

    // const sidebar = d3.select("#sidebar");
    var color = d3.scaleOrdinal()
        .domain(['Health', 'Education', 'Philanthropy', 'Humor', 'Organization', 'Career', 'Leisure', 'Finance', 'Relationships', 'Growth'])
        .range(['#CC6677', '#332288', '#DDCC77', '#117733', '#88CCEE', '#882255', '#44AA99', '#999933', '#AA4499', '#DDDDDD'])

    var Tooltip = d3.select("#my_dataviz")
        .append("div")
        // .style("opacity", 0)
        .style('visibility', 'hidden')
        .attr("class", "tooltip")
        .style("background-color", "white")
        .style("border", "solid")
        .style("border-width", "2px")
        .style("border-radius", "5px")
        .style("padding", "5px")
        .style("position", "absolute")
        .on('mouseover', (event) => {
            // A bug where if the user's cursor gets on top of the Tooltip, it flashes infinitely until the user's cursor moves
            // Very distracting and this gets rid of it completely. Besides, the cursor should never be over the Tooltip anyway
            Tooltip.style('visibility', 'hidden');
        });

    data.forEach((row, index) => {
        svg.append("circle")
            .attr("id", `dot-${index}`)
            .attr("class", `topic-${row.topic}`)
            .attr("cx", x(row.x))
            .attr("cy", y(row.y))
            .attr("r", 5)
            .style("fill", color(row.topic))
            .style("opacity", 1)
            .on("mouseover", function (e) {
                highlightDot(index, row.topic);
                Tooltip.style('visibility', 'visible');
            })
            .on("mousemove", (event, feature) => {
                Tooltip
                    .text(row.tweet)
                    .style('left', (event.x + 10) + 'px')
                    .style('top', (event.y + 10) + 'px');
            })
            .on("mouseout", function () {
                Tooltip.style('visibility', 'hidden');
                resetOpacity();
            });
    });

    // Function to highlight dot and fade others
    function highlightDot(index, topic) {
        const targetClass = `topic-${topic}`;

        svg.selectAll("circle")
            .transition()
            .duration(300) // Set the duration for the transition
            .style("opacity", function() {
                const hasTargetClass = d3.select(this).classed(targetClass);
                return hasTargetClass ? 1 : 0.1;
            })
            // .style("opacity", (d, i) => i === index ? 1 : 0.5); // Gradual opacity change
    }

    function resetOpacity() {
        svg.selectAll("circle")
            .transition()
            .duration(300) // Smooth transition
            .style("opacity", 1); // Reset opacity to 1
    }
})

// ** WORD ROTATION ** //
const words = ['Health', 'Education', 'Philanthropy', 'Humor', 'Organization', 'Career', 'Leisure', 'Finance', 'Relationships', 'Growth']

let index = 0;

function showNextWord() {
    const wordContainer = document.getElementById('word-container');
    wordContainer.classList.remove('fade-up');
    wordContainer.classList.add('fade-in');
    wordContainer.textContent = words[index];
    index = (index + 1) % words.length;

    setTimeout(() => {
        wordContainer.classList.remove('fade-in');
        wordContainer.classList.add('fade-up');
    }, 4000);
}

showNextWord();
setInterval(showNextWord, 5000);