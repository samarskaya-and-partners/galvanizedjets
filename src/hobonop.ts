import * as $ from "jquery";

var key_letters = {
  "latin": { "straight": "n", "round": "o" },
  "cyrillic": { "straight": "н", "round": "о" },
  "greek": { "straight": "η", "round": "ο" }
}

var hobonops = {
  "spacing": "<straight><straight><char><straight>"+
           "<round><straight>"+
           "<round><char><round><round>",
  "start_punctuation": "<punct><char><straight><round><straight><straight>",
  "middle_punctuation": "<straight><punct><straight><straight><char><punct><char><straight><round><punct><round>",
  "wrap_punctuation": "<punct_left><char><straight><straight><punct_right> "+
                            "<punct_left><straight><straight><round><round><punct_right> "+
                            "<punct_left><round><round><char><punct_right>",
  "end_punctuation": "<straight><straight><round><straight><char><punct>",
  "dashes_punctuation": "<char><punct><char><punct><char><punct><char><punct>",
}

var punctuationlist = {
  "middle_punctuation": `‐‑‒–—―~_.‥…,‚„'"‘’‛“”‟:;‹«›»/\\•*⁎⁑⁂❧☞◊†‡※&@`,
  "end_punctuation": '™℠ªº©®¶',
  "start_punctuation": '‥#§℅',
  "wrap_punctuation": [
            ['¿','?'],['¡','!'],
            ['‘','’'],['“','”'],
            ['’','‘'],['”','“'],
            ['‹','›'],['«','»'],
            ['›','‹'],['»','«'],
            ['‚','‚'],['„','„'],
            ['(',')'],['[',']'],['{','}'],
        ],
  "dashes_punctuation": '--'
}

function formPunctuationHobonop(script :string, alphabet :string, type :string) :JQuery<HTMLElement>[] {
  var straight = key_letters[script].straight;
  var round    = key_letters[script].round;
  console.log(type);
  var pattern  = hobonops[type].replace(/\<round\>/g, round).replace(/\<straight\>/g,straight);
  var rv = []
  var punct: string | string[];
  for (punct of punctuationlist[type]) {
    for (var letter of alphabet) {
      var li = $("<li></li>");
      var contents = pattern.replace(/\<char\>/g, letter);
      if (punct.length > 1) {
        contents = contents.replace(/\<punct_left\>/g,punct[0])
        contents = contents.replace(/\<punct_right\>/g,punct[1])
      } else {
        contents = contents.replace(/\<punct\>/g,punct)
      }
      li.append(contents);
      rv.push(li);
    }
  }
  return rv;

}

export function formHobonop(script :string, alphabet :string, type :string) :JQuery<HTMLElement>[] {
  if (type.includes("punctuation")) {
    return formPunctuationHobonop(script, alphabet, type);
  }
  var straight = key_letters[script].straight;
  var round    = key_letters[script].round;
  var pattern  = hobonops[type].replace(/\<round\>/g, round).replace(/\<straight\>/g,straight);
  return Array.from(alphabet).map( (x) => $("<li></li>").append(pattern.replace(/\<char\>/g, x)));
}
