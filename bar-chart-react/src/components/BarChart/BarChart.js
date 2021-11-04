import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";

const BarChart = ({ data }) => {
  const svgElementRef = useRef();
  const gElementRef = useRef();

  useEffect(() => {
    update(data);
  }, [data]);

  useEffect(() => {
    return () => clear();
  }, []);

  const update = (data) => {
    //!bad example
    const body = d3.select("body");
    d3.select(".bad-example").remove();
    body
      .append("div")
      .attr("class", "bad-example")
      .attr("style", "position: absolute; top: 20px, left: 10px;")
      .attr("x", 10)
      .attr("y", 10)
      .attr("font-size", "24px")
      .text("Этот элемент находится вне корневого элемента React");
    //end of bad example

    // find svg tag for getting width and height attributes, define margin, define width and height of chart
    const svgElement = d3.select(svgElementRef.current);
    const margin = 200;
    const width = svgElement.attr("width") - margin;
    const height = svgElement.attr("height") - margin;

    // find <g> tag and translate it
    const gElement = d3.select(gElementRef.current).attr("transform", "translate(" + 100 + "," + 100 + ")");

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
      .text("Population bar chart (React)");

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
  };

  const clear = () => {
    // find <g> tag and translate it
    // const gElement = d3.select(gElementRef.current).attr("transform", "translate(" + 100 + "," + 100 + ")");
    // gElement.selectAll("*").remove();

    // manually find and remove items outside our node tree
    const badElement = d3.select(".bad-example");
    badElement.remove();
  };

  return (
    <>
      <svg ref={svgElementRef} width="1000" height="500">
        <g ref={gElementRef} className="chart"></g>
      </svg>
    </>
  );
};

export default BarChart;

BarChart.defaultProps = {
  data: [],
};

BarChart.propTypes = {
  data: PropTypes.array,
};
