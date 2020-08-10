import events from './events';

export default function treeDiag(arg) {
	"use strict";

	let treeDiag = {};

	let options = arg || {},
			container = options.container || "body",
			graphIndex = options.graphIndex || "",
			mstTree = options.mstTree || {};

  $(container).empty();
  $("#tooltip-menu" + graphIndex).remove();

	const dx = 100;
	const width = $(container).width();
  const dy = width / 6;
	const margin = ({top: 15, right: 180, bottom: 10, left: 70});
	const diagonal = d3.linkHorizontal().x(d => d.y).y(d => d.x);
	const tree = d3.tree().nodeSize([dx, dy]);
	const root = d3.hierarchy(mstTree);
	const nodeEvents = events(treeDiag).node;

  root.x0 = dy / 2;
  root.y0 = 0;

  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
  });

  const tooltipMenu = $('<div id = "tooltip-menu' + graphIndex + '" class = "tooltipMenu"/>')
		.appendTo("body");

  const svg = d3.select(container)
  		.append("svg")
      .attr("width", width)
      .attr("height", dx)
      .attr("viewBox", [-margin.left, -margin.top, width, dx])
      .style("font", "12px sans-serif")
      .style("user-select", "none");

  const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 2.5);

  const gNode = svg.append("g")
      .attr("cursor", "pointer");

  treeDiag.update = function(source) {
    const duration = 750;
    const nodes = root.descendants().reverse();
    const links = root.links();

    const attachNodeEventHandlers = selection => {
      Object.keys(nodeEvents).forEach(function(evt){
        selection.nodes().forEach(function(elem){
        	bean.on(elem, evt, function(e){
            nodeEvents[evt].call(treeDiag, d3.select(elem).datum(), e);
          });
        });
      })
    }

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const newHeight = right.x - left.x + margin.top + margin.bottom;

    const transition = svg.transition()
        .duration(duration)
        .attr("height", newHeight)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, newHeight])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    // Update the nodes…
    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .call(attachNodeEventHandlers);

    nodeEnter.append("circle")
        .attr("r", 5)
        .attr("fill", d => d._children ? "#555" : "#999");

    nodeEnter.append("text")
        .attr("class", "motif-tree-label")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -10 : 10)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.name)
      .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white");

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });

    return treeDiag;
  }

  treeDiag.width = width;
  treeDiag.container = container;
  treeDiag.graphIndex = graphIndex;

  return treeDiag.update(root);
}