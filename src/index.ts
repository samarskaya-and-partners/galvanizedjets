import { setupMovingParts } from "./movingparts";
import { setupFunctions, lazyLoadWordlist } from "./functions";
import { handleNewVariableFont } from "./varfonts";
import * as $ from "jquery";

$(() => {
  setupMovingParts();
  setupFunctions();
  lazyLoadWordlist("en", () => {
    /* Start defaults */
    $("#btn_latin").click();
    $("#uppercase_pie").click();
    $("#simple input").click();
    $("#simple").click();
  });
});

window["fontDropCallback"] = function (newFont) {
  var css = `"${newFont.title}", Jets, "Adobe NotDef"`;
  $("#fontdrop_view").css("font-family", css);

  handleNewVariableFont();
};
