/*
  Given a wordlist as text file on stdin, output a smaller
  wordlist containing at least N options for each letter pair
  with desiredLeftContext letters to the left and desiredRightContext
  letters to the right.

  Does not do anything clever to find a minimal set, because if
  we have >N options per pair that's a nice bonus. Instead it
  finds the *first* N options. If the list is frequency sorted, this
  means you'll get familiar samples first. If doShuffle is true, shuffles
  the array before filtering. This can be used to create more interesting
  samples in a frequency-sorted list.

  If the --strip-accents flag is passed, then accented letters are not
  considered "separate letters" for the purposes of building a representative
  alphabet. (For example, é and e are clearly different in French, but
  ά and α in Greek not so much.)

  Call as
    node compress-wordlist.js [--strip-accents] < in.txt > out.json
*/

var wordOptions         = 5;
var desiredLeftContext  = 3;
var desiredRightContext = 3;
var surelySomeMistake   = 15;
var outlierCutoff       = 0.01;
var doShuffle = true;
var addDummies = false;
var killAccents = process.argv[2] == "--strip-accents";

console.error("Loading dictionary...");
var fs = require('fs');
var obj = fs.readFileSync(process.stdin.fd, 'utf8').split(/\n/).filter( (x) => !x.match(/[\p{Lu}]/u) ).filter( (x) => (x.length < surelySomeMistake && x.length > 2) );
var marked = {}

console.error("Generating alphabet...");
var alphabet;
var alphabetHash = {};
var count = 5000;
var extractor;
if (killAccents) {
  extractor = /([\p{L}])/gu;
} else {
  extractor = /([\p{L}][\p{Mark}]*)/gu;
}
var totals = 0;
for (var w of obj) {
  if (w.length < 4) continue;
  if (killAccents) { w = w.normalize("NFD") }
  do {
    m = extractor.exec(w);
    if (m) {
      if (! (m[1] in alphabetHash)) {
        alphabetHash[m[1]] = 0
      }
      alphabetHash[m[1]]++; totals++;
    }
  } while (m);
  if (count-- < 0) { break;}
}

var mean = totals / Object.keys(alphabetHash).length
Object.keys(alphabetHash).map(function(key, index) {
  alphabetHash[key] /= mean;
});
// Drop outliers
alphabet = Object.keys(alphabetHash).filter( (x) => alphabetHash[x] > outlierCutoff )
alphabet = alphabet.sort( (a,b) => a.normalize("NFD").localeCompare(b.normalize("NFD")) );
console.error(alphabet.join(""));
fs.writeFileSync("alphabet.json", JSON.stringify(alphabet));

if (doShuffle) {
  console.error("Shuffling array...");
  for (let i = obj.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [obj[i], obj[j]] = [obj[j], obj[i]];
  }
}

function addMatches(matches, leftContext, rightContext, l, r) {
  var matchCount = 0;
  var tickTock = true;
  var currentLeft = leftContext;
  var currentRight = rightContext;
  while (matches && matchCount < wordOptions && (currentLeft >= 0) && currentRight >= 0) {
    // process.stderr.write("-".repeat(currentLeft)+l+r+"-".repeat(currentRight)+" ");
    contextualMatches = matches.filter( (x) => x.slice(currentLeft,-currentRight).includes(l+r) ).slice(0,wordOptions)
    matchCount += contextualMatches.length;
    if (tickTock) { currentRight-- } else { currentLeft-- }
    tickTock = !tickTock;
    for (m of contextualMatches) {
      marked[m] = true;
    }
    // process.stderr.write(matchCount+" ");
  }
  // process.stderr.write("\n");

  /* Fake it */
  if (addDummies && matchCount == 0) {
    marked["-".repeat(leftContext)+l+r+"-".repeat(rightContext)] = true;
  }
}

for (l of alphabet) {
  process.stderr.write(l)
  for (r of alphabet) {
    // process.stderr.write(l+r+": ");
    var matches = obj.filter( (x) => x.includes(l+r) );
    addMatches(matches, desiredLeftContext, desiredRightContext, l, r);
    matches = obj.filter( (x) => x.startsWith(l+r) );
    addMatches(matches, 0, desiredRightContext, l, r); // Lr--- for cap-lower
  }
}

console.log(JSON.stringify(Object.keys(marked)))