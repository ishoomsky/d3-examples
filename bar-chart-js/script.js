// initial data
const data = [
  { year: 1000, population: 400000 },
  { year: 1750, population: 800000 },
  { year: 1850, population: 1262000 },
  { year: 1900, population: 1656000 },
  { year: 1950, population: 2518629 },
  { year: 1955, population: 2755823 },
  { year: 1960, population: 3021475 },
  { year: 1965, population: 3334874 },
  { year: 1970, population: 3692492 },
  { year: 1975, population: 4068109 },
  { year: 1980, population: 4434682 },
  { year: 1985, population: 4830979 },
  { year: 1990, population: 5263593 },
  { year: 1995, population: 5674380 },
  { year: 2000, population: 6070581 },
  { year: 2005, population: 6343628 },
  { year: 2013, population: 7162119 },
];

function update() {
  // find svg tag for getting width and height attributes, define margin, define width and height of chart
  const svgElement = d3.select("svg");
  const margin = 200;
  const width = svgElement.attr("width") - margin;
  const height = svgElement.attr("height") - margin;

  // find <g> tag and translate it
  const gElement = d3.select("g.chart").attr("transform", "translate(" + 100 + "," + 100 + ")");

  // it returns xScale function
  const calculateXScale = () => {
    // create x axis scale
    return d3
      .scaleBand()
      .range([0, width])
      .domain(data.map((d) => d.year))
      .padding(0.4);
  };
  // it returns yScale function
  const calculateYScale = () => {
    // create y axis scale
    return d3
      .scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, (d) => d.population)]);
  };

  // add heading
  d3.selectAll(".heading-text").remove();
  svgElement
    .append("text")
    .attr("class", "heading-text")
    .attr("transform", "translate(100,0)")
    .attr("x", 50)
    .attr("y", 50)
    .attr("font-size", "24px")
    .text("Population bar chart");

  // draw new y-axis (Population), remove previous y-axis
  d3.selectAll(".y-axis").remove();
  gElement
    .append("g")
    .attr("class", "y-axis")
    .call(
      d3
        .axisLeft(calculateYScale())
        .tickFormat((d) => d.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
        .ticks(10)
    )
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", "-5.5em")
    .attr("text-anchor", "end")
    .attr("fill", "#5F6368")
    .attr("style", "font: bold 16px sans-serif")
    .text("Population");

  // draw new draw x-axis (Year) remove previous x-axis
  d3.selectAll(".x-axis").remove();
  gElement
    .append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(calculateXScale()))
    .append("text")
    .attr("y", height - 250)
    .attr("x", width - 15)
    .attr("text-anchor", "end")
    .attr("fill", "#5F6368")
    .attr("style", "font: bold 16px sans-serif")
    .text("Year");

  // draw bars by using pattern 'enter-update-exit' (in case when data changes)
  gElement
    .selectAll(".bar")
    .data(data)
    .join(
      (enter) => {
        //enter block, there are we add new bar elements
        const xScale = calculateXScale();
        const yScale = calculateYScale();

        return enter
          .append("rect")
          .attr("class", "bar")
          .attr("x", (d) => xScale(d.year))
          .attr("y", (d) => yScale(d.population))
          .attr("width", xScale.bandwidth())
          .attr("height", (d) => height - yScale(d.population));
      },
      (update) => {
        //update block, there are we update properties of all updated elements
        const xScale = calculateXScale();
        const yScale = calculateYScale();

        return update
          .attr("x", (d) => xScale(d.year))
          .attr("y", (d) => yScale(d.population))
          .attr("width", xScale.bandwidth())
          .attr("height", (d) => height - yScale(d.population));
      },
      (exit) => {
        //exit block - it removes all elements which were removed from array
        return exit.remove();
      }
    );
}
update();

const handleAdd = () => {
  data.push({
    year: data[data.length - 1].year + 1,
    population: data[data.length - 1].population * 1.011,
  });
  update();
};
const handleRemove = () => {
  data.pop();
  update();
};

const addButton = document.querySelector("#add-button");
const removeButton = document.querySelector("#remove-button");

addButton.addEventListener("click", handleAdd);
removeButton.addEventListener("click", handleRemove);
