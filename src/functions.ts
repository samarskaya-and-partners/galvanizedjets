import * as $ from "jquery";
import { numeric_html } from "./numeric";
import { formHobonop } from "./hobonop";
import { alphabets } from "./alphabets";
var wordlists = {};

interface callbackType {
  (wordlist: [string]): void;
}

/*
  Call a function with a wordlist, either pulling the wordlist out of
  memory or fetching it via XHR.
*/

export function lazyLoadWordlist(language: string, cb: callbackType) {
  if (language in wordlists) {
    return cb(wordlists[language]);
  }

  if (!(language in alphabets)) {
    alert("Asked for a wordlist I don't understand: " + language);
    return cb([""]); /* Nice try */
  }

  $("#loader").show();
  $.getJSON("wordlists/" + language + ".json", function (data) {
    wordlists[language] = data;
    $("#loader").hide();
    cb(data);
  }).fail(function (e) {
    alert("Failed to get " + language + " wordlist");
  });
}

/* Given a word in a wordlist representing a glyph pair in its data
   attribute, replace it with another random word containing the
   same pair */
var cycle = function () {
  var isSentence = $("#words").hasClass("sentence_case");
  var key = $(this).data("key");
  var language = $("#language").val() as string;
  var wordlist = wordlists[language];
  var words;
  if (isSentence) {
    words = wordlist.filter((x) => x.startsWith(key));
  } else {
    words = wordlist.filter((x) => x.includes(key));
  }
  var randomWord = words[Math.floor(Math.random() * words.length)];
  $(this).text(randomWord);
};

/* The simple wordlist function. Fills the words div with
   words representing all pairs in the alphabet. */
var simple = function (evt) {
  var script = $("#charsets").data("script");
  var wordDiv = $("#words");
  var isSentence = wordDiv.hasClass("sentence_case");
  var language = $("#language").val() as string;
  var alphabet = alphabets[language] || alphabets[script];
  lazyLoadWordlist(language, (wordlist) => {
    wordDiv.empty();
    var ul = $("<ul>");
    wordDiv.append(ul);
    $("#loader").show(() => {
      var notRealWords = [];
      for (var l of alphabet) {
        for (var r of alphabet) {
          var firstWord;
          if (isSentence) {
            firstWord = wordlist.find((x) => x.startsWith(l + r));
          } else {
            firstWord = wordlist.find(
              (x) => x.includes(l + r) && !x.startsWith(l + r)
            );
          }
          if (!firstWord) continue;
          var li = $("<li></li>").append(firstWord);
          li.data("key", l + r);
          li.mouseenter(function () {
            $("#key").text("<" + $(this).data("key") + ">");
          });
          li.click(cycle);
          if (firstWord.includes("--")) {
            notRealWords.push(li);
            continue;
          }
          ul.append(li);
        }
      }
      for (var nrw of notRealWords) {
        ul.append(nrw);
      }
      $("#loader").hide();
    });
  });
  evt.stopImmediatePropagation();
};

/* Some functions (hobonop, numeric, etc.) are intrinsically
   single line rather than multi line, so force the output to
   be single line and update the interface appropriately. */
var setSingleLine = function () {
  $("#words").removeClass("multi_lines");
  $("#line-buttons-multi").hide();
  $("#line-buttons-single").show();
};

/* The hobonop function. Puts letters of the alphabet - finding an
   extended alphabet where one is provided - into a given pattern.
   See top of file for alphabets and patterns. */
var hobonop = function () {
  var script = $("#charsets").data("script");
  console.log("Setting up hobonop for ", script);
  var alphabet = alphabets[script + "_extended"] || alphabets[script];
  var wordDiv = $("#words");
  wordDiv.empty();

  var ul = $("<ul>");
  wordDiv.append(ul);

  setSingleLine();

  ul.append(formHobonop(script, alphabet, "spacing"));
};

/* The numeric function is just static HTML. Since we don't want to mess
   about with HTML templates, the whole text is stored in a Javascript
   variable, which we just insert into the DOM. */
var numeric = function () {
  var wordDiv = $("#words");
  wordDiv.empty();
  setSingleLine();
  wordDiv.append($(numeric_html));
};

/* The punctuation function is a nightmare. Here we go. */
var punctuation = function () {
  var script: string = $("#charsets").data("script");
  var alphabet: string = alphabets[script + "_extended"] || alphabets[script];
  var wordDiv = $("#words");
  wordDiv.empty();
  setSingleLine();

  var addDivider = (x) =>
    $("#words").append($("<h2><span>" + x + "</span></h2>"));

  addDivider("Mid Punctuation");
  wordDiv.append(formHobonop(script, alphabet, "middle_punctuation"));

  addDivider("Wrap Punctuation");
  wordDiv.append(formHobonop(script, alphabet, "wrap_punctuation"));

  addDivider("End Punctuation");
  wordDiv.append(formHobonop(script, alphabet, "end_punctuation"));

  addDivider("Start Punctuation");
  wordDiv.append(formHobonop(script, alphabet, "start_punctuation"));

  addDivider("Dashes");
  wordDiv.append(formHobonop(script, alphabet, "dashes_punctuation"));
};

export function setupFunctions() {
  /* Set up the different kerning test buttons to fire their functionality */
  $("#simple input").click(simple);
  $("#hobonop input").click(hobonop);
  $("#numeric input").click(numeric);
  $("#punctuation input").click(punctuation);

  /* When we change script, we want to re-fire the currently selected
     kerning test. */
  $("#btn_latin input,#btn_cyrillic input,#btn_greek input").click(function () {
    $("#kerning_proofs .selected input").click();
  });

  /* If we are doing the wordlists function and we change case, force
  a reload because we might be going to sentence-case which pulls its
  wordlist from the front not from the middle. */
  $("#uppercase_pie, #lowercase_pie, #sentence_pie").click(function () {
    if ($("#simple").hasClass("selected")) {
      $("#simple input").click();
    }
  });

  $("#language").change(simple);
}
