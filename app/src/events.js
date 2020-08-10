import widget from './widget';

const tooltipOffset = {
	top: 10,
	left: 10
};

export default function events(view) {
	let events = {};
	let tooltipHash = {};
	let diffOffSet;

	events.node = {
		click: function(d, evt) {
			d.children = d.children ? null : d._children;
			view.update(d);
		},

		mouseenter: function(d, evt) {
			view = this;
			// diffOffSet = getObjectLocation(view.container);
			if(!tooltipHash.hasOwnProperty(d.id)) {
				let newTooltip = widget({
					container: $("#tooltip-menu" + view.graphIndex),
					view: view,
					label: d.data.name,
					chartInfo: d.data.chartInfo
				});
				tooltipHash[d.id] = newTooltip;
			} else {
				tooltipHash[d.id].showWidget(d.label, d.provenance);
			}
			let top = evt.pageY + tooltipOffset.top;
			let left = evt.pageX + tooltipOffset.left;
			tooltipHash[d.id].changePosition(top, left);
		},

		mousemove: function(d, evt) {
			let top = evt.pageY + tooltipOffset.top;
			let left = evt.pageX + tooltipOffset.left;
			tooltipHash[d.id].changePosition(top, left);
		},

		mouseleave: function(d, evt) {
			tooltipHash[d.id].hideWidget();
		}
	};

	return events;
}

function getObjectLocation( container ) {

	let top = 0;
	let left = 0;
	let offset = $(container).offset();

	top += offset.top +
    parseInt( $( container ).css( "border-top-width" ) ) +
    parseInt( $( container ).css( "margin-top" ) ) +
    parseInt( $( container ).css( "padding-top" ) );
	left += offset.left +
    parseInt( $( container ).css( "border-left-width" ) ) +
    parseInt( $( container ).css( "margin-left" ) ) +
    parseInt( $( container ).css( "padding-left" ) );

	return {
		top: top,
		left: left
	};
}