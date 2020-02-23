import * as opentype from 'opentype.js';
declare var VariableFont;
import * as $ from "jquery";

// from StackOverflow, of course...
function _base64ToArrayBuffer(base64) {
    var binary_string = window.atob(base64);
    var len = binary_string.length;
    var bytes = new Uint8Array(len);
    for (var i = 0; i < len; i++) {
        bytes[i] = binary_string.charCodeAt(i);
    }
    return bytes.buffer;
}

function makeSliders(axes) {
  for (var axis of axes) {
    console.log(axis);
    var sliderdiv = $('<div class="axisslider"/>');
    var label = $(`<label for="axis_${axis.tag}"/>`).text(axis.name.en);
    sliderdiv.append(label);
    var input = $(`<input type="range" id="axis_${axis.tag}" min="${axis.minValue}" max="${axis.maxValue}" value="${axis.defaultValue}"/>`)
    sliderdiv.append(input);
    $("#varfont_axes").append(sliderdiv);
  }
}

export function handleNewVariableFont () {
  // @ts-ignore: CSS stylesheets are messy.
  var fontUrl = document.styleSheets[1].rules[0].style.src;
  fontUrl = fontUrl.slice(4, -1) // url( ... )
  var fontData = _base64ToArrayBuffer(fontUrl.split(",")[1]);
  var font = opentype.parse(fontData);

  var varFont = new VariableFont(font);
  var axes = varFont.getAxes()
  $("#varfont_axes").empty()

  if (axes.length > 0) {
    makeSliders(axes)
  }
}

export function setupAxisSliders() {
  $(document).on('input change', '#varfont_axes input', function() {
    var varSettings = [];
    $("#varfont_axes input").each(function () {
      var tag = this.id.substr(5) // "axis_"
      varSettings.push(`'${tag}' ${$(this).val()}`);
    })
    $("#words").css("font-variation-settings", varSettings.join(","));
  });
}