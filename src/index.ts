import { setupMovingParts } from './movingparts'
import { setupFunctions,lazyLoadWordlist } from './functions'
import * as opentype from 'opentype.js';

import * as $ from "jquery";
declare var VariableFont;

$( () => {
  setupMovingParts();
  setupFunctions();
  lazyLoadWordlist("latin", () => {
    /* Start defaults */
    $("#btn_latin").click()
    $("#uppercase_pie").click()
    $("#hobonop input").click()
  })
})

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

window["fontDropCallback"] = function(newFont) {
  var css = `"${newFont.title}", Jets, "Adobe NotDef"`
  $("#fontdrop_view").css("font-family", css)

  // @ts-ignore: CSS stylesheets are messy.
  var fontUrl = document.styleSheets[1].rules[0].style.src;
  fontUrl = fontUrl.slice(4, -1) // url( ... )
  var fontData = _base64ToArrayBuffer(fontUrl.split(",")[1]);
  var font = opentype.parse(fontData);

  var varFont = new VariableFont(font);
  var axes = varFont.getAxes()
  if (axes.length > 0) {
    // XXX do a thing
  }
}
