export default function widget(arg) {
  "use strict";
  let widget = {};

  let options = arg || {},
      container = options.container || "body",
      view = options.view || {},
      label = options.label || "",
      chartInfo = options.chartInfo || "",
      width = options.width || 300,
      marginTop = options.marginTop || 0,
      marginLeft = options.marginLeft || 0;

  let dragging = false;

  let rendering = false;

  let widgetContainer = $('<div class = "i2g-widget"/>')
    .appendTo(container);

  let widgetForm = $('<div class = "ui form"/>')
    .appendTo(widgetContainer);

  let close = $('<div class = "i2g-widget-close"/>')
    .appendTo(widgetForm)
    .css("display", "none")
    .html("\uf057")
    .click(function() {
      close.hide();
      widgetContainer.css("border", "none");
    });

  let labelRow = $('<div class = "field"/>')
  	.appendTo(widgetForm);

  let labelText = $('<h4 class="ui header"/>')
  	.appendTo(labelRow)
  	.html(chartInfo.title)
      .mouseenter(function() {
        labelText.css("cursor", "move");
      })
      .mouseleave(function() {
        labelText.css("cursor", "default");
      });

  let provBox = $('<div/>')
    .appendTo(widgetForm);

  let visImgBox = $('<div class="i2g-widget-img-box field"/>')
    .appendTo(provBox);

  let visImg = $('<img draggable = "false">')
    .appendTo(visImgBox);

  visImg[0].src = "../../" + window.dataFile + "/" + label + ".png";

  // tooltipProv(provenance);

  widget.changePosition = function(margin_top, margin_left) {
    // let width = widgetContainer.width() + 40;
    // if(margin_left + width > view.width) {
    //   margin_left -= width;
    // }
    let height = widgetContainer.height() + 40;
    if(margin_top + height > $(view.container).height()) {
      let heightDiff = (margin_top + height - $(view.container).height());
      margin_top = margin_top - heightDiff < 0 ? margin_top : margin_top - heightDiff;
    }
    marginTop = margin_top;
    marginLeft = margin_left;
  	widgetContainer.css("margin-top", margin_top);
  	widgetContainer.css("margin-left", margin_left);
  	return widget;
  }

  widget.indicate = function() {
    if(!rendering) {
    	close.show();
    }
  }

  widget.getCentroid = function() {
    let width = widgetContainer.width() + 30;
    let height = widgetContainer.height() + 30;
    return [marginLeft + (width / 2), marginTop + (height / 2)];
  }

  widget.hideWidget = function() {
    widgetContainer.hide();
  }

  widget.showWidget = function(newLabel, newProvenance) {
    widgetContainer.show();
    // provBox.empty();
    // provenance = newProvenance;
    labelText.html(newLabel);
    //tooltipProv(provenance);
  }


  widgetContainer.mousedown(function(event) {
    if(event.target.classList.contains("header")) {
      document.onmousemove = dragmove;
      document.onmouseup = dragend;
    }
  });

  function dragmove(event) {
    let dy = event.movementY;
    let dx = event.movementX;
    drag(dy, dx);
  }

  function drag(dy, dx) {
    marginTop += dy;
    marginLeft += dx;
    marginTop = marginTop < 0 ? 0 : marginTop;
    marginLeft = marginLeft < 0 ? 0 : marginLeft;
    marginTop = marginTop > view.height - widgetContainer.height() - 34 ? view.height - widgetContainer.height() - 34 : marginTop;
    marginLeft = marginLeft > view.width - widgetContainer.width() - 36 ? view.width - widgetContainer.width() - 36 : marginLeft;

    widgetContainer.css("margin-top", marginTop);
    widgetContainer.css("margin-left", marginLeft);

    // changeIndicateLine();
  }

  function dragend() {
    document.onmouseup = null;
    document.onmousemove = null;
  }

  return widget;
}