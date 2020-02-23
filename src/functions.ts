import * as $ from "jquery";
import { numeric_html } from "./numeric";

var wordlists = {};
window["wordlists"] = wordlists;

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

/*
words:
            highlights   : highlighting,
            italic       : italic,
*/

var cycle = function () {
  var key = $(this).data("key");
  var script = $("#charsets").data("script");
  var wordlist = wordlists[script];
  var words = wordlist.filter( (x) => x.match(key) )
  var randomWord = words[Math.floor(Math.random() * words.length)]
  $(this).text(randomWord);
}

var simple = function(evt) {
  var script = $("#charsets").data("script");
  var alphabet = alphabets[script];
  var wordDiv = $("#words ul");

  lazyLoadWordlist(script, (wordlist) => {
    wordDiv.empty();
    $("#loader").show( () => {
      for (var l of alphabet) {
        for (var r of alphabet) {
          var firstWord = wordlist.find ( (x) => x.match(RegExp(l+r)) )
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

var setSingleLine = function () {
  $("#words").removeClass("multi_lines");
  $("#line-buttons-multi").hide();
  $("#line-buttons-single").show();
}

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

var numeric = function () {
  var wordDiv = $("#words ul");
  wordDiv.empty();
  setSingleLine();
  wordDiv.append($(numeric_html));
}

export function setupFunctions () {
  $("#simple input").click(simple);
  $("#hobonop input").click(hobonop);
  $("#btn_latin input,#btn_cyrillic input,#btn_greek input").click(function () {
    $("#kerning_proofs .selected input").click();
  })
  $("#numeric input").click(numeric);
}