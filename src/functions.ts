import * as $ from "jquery";
import { numeric_html } from "./numeric";

var wordlists = {};

var alphabets = {
  "latin": "abcdefghijklmnopqrstuvwxyz",
  "latin_extended": 'abcdefghijklmnopqrstuvwxyzàáăâäāąåǻãæćčçĉċďđðèéĕěêëėēęğĝġħĥìíĭîïi̇įĩĵķłĺľļńňņñòóŏôõöőōøœŕřŗśšşŝșťțþùúŭûüűūųůũẃŵẅẁýŷÿỳźžż',
  "cyrillic": "абвгдеёжзийклмнопрстуфхцчшщъыьэюя",
  "cyrillic_extended": "абвгдеёжзийклмнопрстуфхцчшщъыьэюяґђѓєѕіїјљњћќўџ",
  "greek": "αβγδεζηθικλμνξοπρσςτυφχψω"
};

var hobonops =  {
  "latin": "nn*nono*oo",
  "cyrillic": "нн*ноно*оо",
  "greek": "ηη*ηοηο*οο"
}

interface callbackType { (wordlist: [string]): void }

/*
  Call a function with a wordlist, either pulling the wordlist out of
  memory or fetching it via XHR.
*/

export function lazyLoadWordlist(language:string, cb: callbackType) {
  if (language in wordlists) { return cb(wordlists[language]) }

  if (! (language in alphabets)) {
    alert("Asked for a wordlist I don't understand: "+language)
    return cb([""]); /* Nice try */
  }

  $("#loader").show();
  $.getJSON("wordlists/"+language+".json", function (data) {
    wordlists[language] = data;
    $("#loader").hide();
    cb(data)
  }).fail(function (e) {
    alert("Failed to get "+language+" wordlist");
  })
}

/* Given a word in a wordlist representing a glyph pair in its data
   attribute, replace it with another random word containing the
   same pair */
var cycle = function () {
  var key = $(this).data("key");
  var script = $("#charsets").data("script");
  var wordlist = wordlists[script];
  var words = wordlist.filter( (x) => x.match(key) )
  var randomWord = words[Math.floor(Math.random() * words.length)]
  $(this).text(randomWord);
}

/* The simple wordlist function. Fills the words div with
   words representing all pairs in the alphabet. */
var simple = function(evt) {
  var script = $("#charsets").data("script");
  var alphabet = alphabets[script];
  var wordDiv = $("#words ul");

  lazyLoadWordlist(script, (wordlist) => {
    wordDiv.empty();
    $("#loader").show( () => {
      for (var l of alphabet) {
        for (var r of alphabet) {
          var firstWord = wordlist.find ( (x) => x.includes(l+r) )
          if (!firstWord) continue;
          var li = $("<li></li>").append(firstWord);
          li.data("key", l+r);
          li.mouseenter(function () {
            $("#key").text("<"+$(this).data("key")+">")
          });
          li.click(cycle);
          wordDiv.append(li)
        }
      }
      $("#loader").hide();
    })
  });
  evt.stopImmediatePropagation();
}

/* Some functions (hobonop, numeric, etc.) are intrinsically
   single line rather than multi line, so force the output to
   be single line and update the interface appropriately. */
var setSingleLine = function () {
  $("#words").removeClass("multi_lines");
  $("#line-buttons-multi").hide();
  $("#line-buttons-single").show();
}

/* The hobonop function. Puts letters of the alphabet - finding an
   extended alphabet where one is provided - into a given pattern.
   See top of file for alphabets and patterns. */
var hobonop = function () {
  var script = $("#charsets").data("script");
  console.log("Setting up hobonop for ", script)
  var alphabet = alphabets[script+"_extended"] || alphabets[script];
  var wordDiv = $("#words ul");
  wordDiv.empty();
  setSingleLine();

  for (var x of alphabet) {
    var li = $("<li></li>").append(hobonops[script].replace(/\*/g, x))
    wordDiv.append(li)
  }
}

/* The numeric function is just static HTML. Since we don't want to mess
   about with HTML templates, the whole text is stored in a Javascript
   variable, which we just insert into the DOM. */
var numeric = function () {
  var wordDiv = $("#words ul");
  wordDiv.empty();
  setSingleLine();
  wordDiv.append($(numeric_html));
}

export function setupFunctions () {
  /* Set up the different kerning test buttons to fire their functionality */
  $("#simple input").click(simple);
  $("#hobonop input").click(hobonop);
  $("#numeric input").click(numeric);

  /* When we change script, we want to re-fire the currently selected
     kerning test. */
  $("#btn_latin input,#btn_cyrillic input,#btn_greek input").click(function () {
    $("#kerning_proofs .selected input").click();
  })
}