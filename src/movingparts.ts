import * as $ from "jquery";

export function setupMovingParts () {

  /* Navbar toggles */
  $("#nav_wrapper header").click( () => $("#nav_wrapper").toggleClass("off") )
  $("#loaded_fonts").click( () => $("#loaded_fonts").toggleClass("on") )
  $("#opentype").click( () => $("#opentype").toggleClass("on") )
  $("#line-buttons-multi").hide();
  $("#line-buttons").click( () => {
    $("#line-buttons-single").toggle();
    $("#line-buttons-multi").toggle();
    $("#words").toggleClass("multi_lines");
  })

  $("#time").click( () => {
    $("#time").toggleClass("day")
    $("#custom").toggleClass("night")
  })
  $(document).on('input change', '#font_size input', function() {
    $("#words").css("font-size", $(this).val() + "rem")
  })

  /* Charset toggles */
  $("#btn_latin,#btn_cyrillic,#btn_greek").click( function () {
    var script = this.id.substr(4);
    $("#charsets label").removeClass("selected");
    $(this).addClass("selected");
    $("#charsets").data("script", script);  /* "btn_..." */
    $(".chars").hide()
    $(".chars."+script).show()
  })

  /* Cases toggles */
  $("#uppercase_pie").click( function () { /* upper */
    $("#cases").data("case","upper")
    $("#cases path").removeClass("selected");
    $("#XMLID_3_,#XMLID_6_,#uppercase_pie").addClass("selected");
    $("#words").addClass("uppercase");
    $("#words").removeClass("sentence_case");
  })
  $("#lowercase_pie").click( function () { /* lower */
    $("#cases").data("case","lower")
    $("#cases path").removeClass("selected");
    $("#XMLID_10_,#XMLID_13_,#lowercase_pie").addClass("selected");
    $("#words").removeClass("uppercase");
    $("#words").removeClass("sentence_case");
  })
  $("#sentence_pie").click( function () { /* sentence */
    $("#cases").data("case","sentence")
    $("#cases path").removeClass("selected");
    $("#XMLID_59_,#XMLID_64_,#sentence_pie").addClass("selected");
    $("#words").removeClass("uppercase");
    $("#words").addClass("sentence_case");
  })

  /* Function toggles */
  $("#hobonop,#simple,#extended,#punctuation,#numeric").click( function (evt) {
    $("#kerning_proofs label").removeClass("selected");
    $(this).addClass("selected");
    $("#kerning_proofs").data("function", this);
  })

  /* OpenType Feature toggles */
  $(".ot-feature input").click(function() {
    var featName = $(this).parent()[0].id;
    var cfeatures = $("#opentype").data("featureset")
    cfeatures[featName] = $(this).prop("checked");
    $("#opentype").data("featureset", cfeatures)
    var onFeatures = Object.keys(cfeatures).filter( (x) => cfeatures[x] ).map( (x) => `'${x}'` ).join(",")
    $("#words").css("font-feature-settings", onFeatures)
  })
  $("#opentype").data("featureset", {});
}