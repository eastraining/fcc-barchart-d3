const GRAPH_WIDTH = 1100;
const GRAPH_HEIGHT = 680;
const GRAPH_PADDING = 60;


fetch('https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json')
.then(res => res.json())
.then(data => {   
    const BAR_WIDTH = (GRAPH_WIDTH - GRAPH_PADDING * 2) / data.data.length;

    var tooltip = d3.select('.svgContainer')
    .append('div')
    .attr('id', 'tooltip')
    .html('init')
    .style('opacity', 0);

    var gdpGraph = d3.select('.svgContainer')
    .append('svg')
    .attr('width', GRAPH_WIDTH)
    .attr('height', GRAPH_HEIGHT);

    data.data = data.data.map(x => [new Date(x[0]), x[1], x[0]]);
    
    const xScale = d3.scaleTime()
    .domain([d3.min(data.data, d => d[0]), d3.max(data.data, d => d[0])])
    .range([GRAPH_PADDING, GRAPH_WIDTH - GRAPH_PADDING]);

    const yScale = d3.scaleLinear()
    .domain([0, d3.max(data.data, d => d[1])])
    .range([GRAPH_HEIGHT - GRAPH_PADDING, GRAPH_PADDING]);

    gdpGraph.selectAll('rect')
    .data(data.data)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', d => xScale(d[0]))
    .attr('y', d => yScale(d[1]))
    .attr('width', BAR_WIDTH)
    .attr('height', d => GRAPH_HEIGHT - GRAPH_PADDING - yScale(d[1]))
    .attr('data-date', d => d[2])
    .attr('data-gdp', d => d[1])
    .on('mouseover', function (d, i) {
        let gdpFigure = this.getAttribute('data-gdp').toLocaleString();
        d3.select(this)
        .style('opacity', 0.7);
        tooltip.style('opacity', 1)
        .html(`${this.getAttribute('data-date')}: \$${gdpFigure} billion`)
        .attr('data-date', this.getAttribute('data-date'));
    }).on('mouseout', function (d, i) {
        d3.select(this)
        .style('opacity', 1);
        tooltip.style('opacity', 0);
    });

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    gdpGraph.append('g')
    .attr('transform', `translate (0, ${GRAPH_HEIGHT - GRAPH_PADDING})`)
    .attr('id', 'x-axis')
    .call(xAxis);
    gdpGraph.append('g')
    .attr('transform', `translate (${GRAPH_PADDING}, 0)`)
    .attr('id', 'y-axis')
    .call(yAxis);
})