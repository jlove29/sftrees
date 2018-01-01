/* Source for trees visualization */

// Set up size
let mapWidth = 750;
let mapHeight = 750;

let c1Radius = 150;
let c2Radius = 150;

// Set up projection that the map is using
let projection = d3.geoMercator()
    .center([-122.433701, 37.767683]) // San Francisco, roughly
    .scale(225000)
    .translate([mapWidth / 2, mapHeight / 2]);

let unprojection = d3.geoMercator()
    .center([mapWidth / 2, mapHeight / 2])
    .scale(0.00000444444)
    .translate([-122.433701, 37.767683]);

let click = 0;
let allData;
// Add an SVG element to the DOM
let svg = d3.select('#vis')
    .append('svg')
    .attr('width', mapWidth)
    .attr('height', mapHeight)

// Add SVG map at correct size, assuming map is saved in a subdirectory called `data`
svg.append('image')
    .attr('width', mapWidth)
    .attr('height', mapHeight)
    .attr('xlink:href', 'data/sf-map.svg');



// load data
d3.csv('data/trees.csv', parseInputRow, loadData);
function parseInputRow(d) {
    return {
        lat: +d.Latitude,
        lon: +d.Longitude,
        species: +d.Species,
        address: d.qAddress
    }}
function loadData(error, treeData) {
    if (error) throw error;
    drawCircles(treeData);
    allData = treeData;
    }

let savedX = [0, 0];
let savedY = [0, 0];

function filterData(treeData) {
    let filteredData;
    filteredData = treeData.filter(d => Math.abs(projection([d.lon, d.lat])[0]-savedX[0])**2 + Math.abs(projection([d.lon, d.lat])[1]-savedY[0])**2< c1Radius**2 && Math.abs(projection([d.lon, d.lat])[0]-savedX[1])**2 + Math.abs(projection([d.lon, d.lat])[1]-savedY[1])**2 < c2Radius**2);
    drawCircles(filteredData);
    if (isColors) {
        setColors();
    }
}

let isSite = false;
d3.selectAll('.treeType').on('change', function() { addSite(); });
function addSite() {
    let filteredData = allData;
    if (!d3.select('#b0').property('checked')) {
        isSite = true;
        filteredData = filteredData.filter(d => d.species != 0);
    }
    if (!d3.select('#b1').property('checked')) {
        isSite = true;
        filteredData = filteredData.filter(d => d.species != 1);
    }
    if (!d3.select('#b2').property('checked')) {
        isSite = true;
        filteredData = filteredData.filter(d => d.species != 2);
    }
    if (!d3.select('#b3').property('checked')) {
        isSite = true;
        filteredData = filteredData.filter(d => d.species != 3);
    }
    if (!d3.select('#b4').property('checked')) {
        isSite = true;
        filteredData = filteredData.filter(d => d.species != 4);
    }
    if (!d3.select('#b5').property('checked')) {
        isSite = true;
        filteredData = filteredData.filter(d => d.species != 5);
    }
    if (!d3.select('#b6').property('checked')) {
        isSite = true;
        filteredData = filteredData.filter(d => d.species != 6);
    }
    if (!d3.select('#b7').property('checked')) {
        isSite = true;
        filteredData = filteredData.filter(d => d.species != 7);
    }
    if (!d3.select('#b8').property('checked')) {
        isSite = true;
        filteredData = filteredData.filter(d => d.species != 8);
    }
    if (!d3.select('#b9').property('checked')) {
        isSite = true;
        filteredData = filteredData.filter(d => d.species != 9);
    }
    if (!d3.select('#b10').property('checked')) {
        isSite = true;
        filteredData = filteredData.filter(d => d.species != 10);
    }
    if (isOn) {
        filterData(filteredData);
    } else {
        drawCircles(filteredData);
    }
    if (isColors) {
        setColors();
    }
}

// draw circles at each tree
function drawCircles(treeData) {
    let circles = svg.selectAll('#tree');
    let updatedCircles = circles.data(treeData, d => d.id);
    let enterSelection = updatedCircles.enter();
    let newCircles = enterSelection.append('circle')
        .attr('r', 1)
        .attr('id', 'tree')
        .attr('cx', function (d) { return projection([d.lon, d.lat])[0]; })
        .attr('cy', function (d) { return projection([d.lon, d.lat])[1]; })
        .style('fill', 'green')
        .on('mouseover', function(d) {
            d3.select('#address').text(String(d.address));
            d3.select(this)
                .attr('r', 8);
        })
        .on('mouseout', function() {
            d3.select('#address').text('');
            d3.select(this)
                .attr('r', 1);
        });
    let unselectedCircles = updatedCircles.exit();
    updatedCircles.exit().remove();
}

let isOn = false;
let locButton = d3.select('#location');
locButton.text('Show location filters');
d3.selectAll('#sliders').style('visibility', 'hidden');
d3.selectAll('#sliders').style('height', '0');
locButton.on('click', function() {
    isOn = !isOn;
    if (isOn) {
        d3.select(this).text('Hide location filters');
        addCircleFilter();
        d3.selectAll('#sliders').style('visibility', 'visible');
        d3.selectAll('#sliders').style('height', '110');
    } else {
        d3.select(this).text('Show location filters');
        if (isSite) {
            addSite();
        } else {
            drawCircles(allData);
        }
        svg.select('#circle1').remove();
        svg.select('#circle2').remove();
        d3.selectAll('#sliders').style('visibility', 'hidden');
        d3.selectAll('#sliders').style('height', '0');
    }
});

let colorButton = d3.select('#color');
colorButton.text('Color by species');

var isColors = false;
colorButton.on('click', function() {
    isColors = !isColors;
    setColors();
});

function setColors() {
    if (isColors) {
        d3.selectAll('#tree').style('fill', function(d) {
            if (d.species == 0) { color = '#0074D9'};
            if (d.species == 1) { color = '#7FDBFF'};
            if (d.species == 2) { color = '#2ECC40'};
            if (d.species == 3) { color = '#3D9970'};
            if (d.species == 4) { color = '#FFDC00'};
            if (d.species == 5) { color = '#FF851B'};
            if (d.species == 6) { color = '#FF4136'};
            if (d.species == 7) { color = '#85144b'};
            if (d.species == 8) { color = '#F012BE'};
            if (d.species == 9) { color = '#B10DC9'};
            if (d.species == 10) { color = '#111111'};
            return color;
        });
        colorButton.text('Remove colors');
        d3.select('#c0').style('background-color', '#0074D9');
        d3.select('#c1').style('background-color', '#7FDBFF');
        d3.select('#c2').style('background-color', '#2ECC40');
        d3.select('#c3').style('background-color', '#3D9970');
        d3.select('#c4').style('background-color', '#FFDC00');
        d3.select('#c5').style('background-color', '#FF851B');
        d3.select('#c6').style('background-color', '#FF4136');
        d3.select('#c7').style('background-color', '#85144b');
        d3.select('#c8').style('background-color', '#F012BE');
        d3.select('#c9').style('background-color', '#B10DC9');
        d3.select('#c10').style('background-color', '#111111');
    } else {
        d3.selectAll('#tree').style('fill', 'green');
        colorButton.text('Color by species');
        d3.select('#c0').style('background-color', '#FFFFFF');
        d3.select('#c1').style('background-color', '#FFFFFF');
        d3.select('#c2').style('background-color', '#FFFFFF');
        d3.select('#c3').style('background-color', '#FFFFFF');
        d3.select('#c4').style('background-color', '#FFFFFF');
        d3.select('#c5').style('background-color', '#FFFFFF');
        d3.select('#c6').style('background-color', '#FFFFFF');
        d3.select('#c7').style('background-color', '#FFFFFF');
        d3.select('#c8').style('background-color', '#FFFFFF');
        d3.select('#c9').style('background-color', '#FFFFFF');
        d3.select('#c10').style('background-color', '#FFFFFF');
    }
}

d3.select('#checks').style('height', '0');
let isOpen = false;
let siteButton = d3.select('#site');
siteButton.text('Show species filters');
d3.selectAll('#checks').style('visibility', 'hidden');
siteButton.on('click', function() {
    isOpen = !isOpen;
    if (isOpen) {
        d3.select(this).text('Hide species filters');
        d3.selectAll('#checks').style('visibility', 'visible');
        d3.select('#checks').style('height', '300');
    } else {
        d3.select(this).text('Show species filters');
        d3.selectAll('#checks').style('visibility', 'hidden');
        d3.select('#checks').style('height', '0');
    }
});


function addCircleFilter() {
    let selectionCircles = [
        {'x': 300, 'y': 300, 'radius': c1Radius, 'color': 'blue', 'number': 0, 'id': 'circle1'},
        {'x': 400, 'y': 400, 'radius': c2Radius, 'color': 'blue', 'number': 1, 'id': 'circle2'}
        ];

    savedX = [selectionCircles[0].x, selectionCircles[1].x];
    savedY = [selectionCircles[0].y, selectionCircles[1].y];

    let circles = svg.selectAll('#selectionCircle')
        .data(selectionCircles)
        .enter()
        .append('circle');

    let circleAttributes = circles
        .attr('cx', function (d) { return d.x; })
        .attr('cy', function (d) { return d.y; })
        .attr('r', function (d) { return d.radius; })
        .attr('id', function (d) { return d.id; })
        .style('fill', function(d) { return d.color; })
        .text('+')
        .attr('fill-opacity', 0.05)
        .call(d3.drag()
            .on('drag', dragged));

    if (isSite) {
        addSite()
    } else {
        filterData(allData);
    }
    if (isColors) {
        setColors();
    }
}

function dragged(d) {
    d3.select(this).attr('cx', d.x = d3.event.x).attr('cy', d.y = d3.event.y);
    savedX[d.number] = d.x;
    savedY[d.number] = d.y;
    if (isSite) {
        addSite()
    } else {
        filterData(allData);
    }
    if (isColors) {
        setColors();
    }
    if (d.number == 0) {
        d3.select('#x1box').attr('value', unprojection([d.x, d.y])[0]);
        if (0 < unprojection([d.x, d.y])[1] ) {
            d3.select('#y1box').attr('value', unprojection([d.x, d.y])[1]);
        }
    } else {
        d3.select('#x2box').attr('value', unprojection([d.x, d.y])[0]);
        if (0 < unprojection([d.x, d.y])[1] ) {
            d3.select('#y2box').attr('value', unprojection([d.x, d.y])[1]);
        }
    }
}


d3.select('#radius1').on('input', function() {
    update(+this.value, 1);
});
d3.select('#radius2').on('input', function() {
    update(+this.value, 2);
});

d3.select('#r1box').on('change', function() {
    let r1 = d3.select('#r1box').node().value;
    update(r1*72.6257, 1);
});
d3.select('#r2box').on('change', function() {
    let r2 = d3.select('#r2box').node().value;
    update(r2*72.6257, 2);
});

function update(radius, num) {
    if (num == 1) {
        svg.select('#circle1')
            .attr('r', radius);
        c1Radius = radius;
        d3.select('#r1box')
            .attr('value', Math.max( Math.round(radius/72.6257 * 10) / 10).toFixed(1))
            .property('value', Math.max( Math.round(radius/72.6257 * 10) / 10).toFixed(1));
        d3.select('#radius1')
            .property('value', radius);
    } else {
        svg.select('#circle2')
            .attr('r', radius);
        c2Radius = radius;
        d3.select('#r2box')
            .attr('value', Math.max( Math.round(radius/72.6257 * 10) / 10).toFixed(1))
            .property('value', Math.max( Math.round(radius/72.6257 * 10) / 10).toFixed(1));
        d3.select('#radius2')
            .property('value', radius);
    }
    if (isSite) {
        addSite();
    } else {
        filterData(allData);
    }
    if (isColors) {
        setColors();
    }
}

/*
function updateCoords(coord, x, y, xy, num) {
    if (num == 1) {
        if (xy == 'x') {
            svg.select('#circle1')
                .attr('cx', projection([x, y])[0]);
            savedX[num-1] = projection([x, y])[0];
            d3.select('#x1box')
                .attr('value', x);
        } else {
          svg.select('#circle1')
                .attr('cy', projection([x, y])[1]);
            savedY[num-1] = projection([x, y])[1];
            d3.select('#y1box')
                .attr('value', y);
        }
    } else {
        if (xy == 'x') {
            svg.select('#circle2')
                .attr('cx', projection([x, y])[0]);
            savedX[num-1] = projection([x, y])[0];
            d3.select('#x2box')
                .attr('value', x);
        } else {
          svg.select('#circle2')
                .attr('cy', projection([x, y])[1]);
            savedY[num-1] = projection([x, y])[1];
            d3.select('#y2box')
                .attr('value', y);
        }
    }
}

d3.select('#x1box').on('change', function() {
    let x = d3.select('#x1box').node().value;
    let y = d3.select('#y1box').node().value;
    updateCoords(projection([x, y])[0], projection([x, y])[1], 'x', 1);
});
d3.select('#y1box').on('change', function() {
    let x = d3.select('#x1box').node().value;
    let y = d3.select('#y1box').node().value;
    updateCoords(projection([x, y])[0], projection([x, y])[1], 'y', 1);
});
d3.select('#x2box').on('change', function() {
    let x = d3.select('#x2box').node().value;
    let y = d3.select('#y2box').node().value;
    updateCoords(projection([x, y])[0], projection([x, y])[1], 'x', 2);
});
d3.select('#y2box').on('change', function() {
    let x = d3.select('#x2box').node().value;
    let y = d3.select('#y2box').node().value;
    updateCoords(projection([x, y])[0], projection([x, y])[1], 'y', 2);
});
*/
