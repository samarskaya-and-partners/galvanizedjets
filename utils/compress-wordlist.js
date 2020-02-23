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

  Call as
    node compress-wordlist.js "abcdefghijklmnopqrstuvwxyz" < in.txt > out.json
*/

var wordOptions         = 5;
var desiredLeftContext  = 3;
var desiredRightContext = 3;
var surelySomeMistake   = 15;
var doShuffle = true;

var alphabet = process.argv[2];
if (!alphabet) {
  console.error("No alphabet provided");
  process.exit(1)
}

console.error("Loading dictionary...");
var fs = require('fs');
var obj = fs.readFileSync(process.stdin.fd, 'utf8').split(/\n/).map( (x) => x.toLowerCase() ).filter( (x) => x.length < surelySomeMistake );
var marked = {}

if (doShuffle) {
  console.error("Shuffling array...");
  for (let i = obj.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [obj[i], obj[j]] = [obj[j], obj[i]];
  }
}

function addMatches(matches, currentLeft, currentRight) {
  var matchCount = 0;
  var tickTock = true;
  while (matches && matchCount < wordOptions && (currentLeft >= 0) && currentRight >= 0) {
    process.stderr.write("-".repeat(currentLeft)+l+r+"-".repeat(currentRight)+" ");
    contextualMatches = matches.filter( (x) => x.slice(currentLeft,-currentRight).includes(l+r) ).slice(0,wordOptions)
    matchCount += contextualMatches.length;
    if (tickTock) { currentRight-- } else { currentLeft-- }
    tickTock = !tickTock;
    for (m of contextualMatches) {
      marked[m] = true;
    }
    process.stderr.write(matchCount+" ");
  }
  process.stderr.write("\n");

  /* Fake it */
  if (matchCount == 0) {
    marked["-".repeat(desiredLeftContext)+l+r+"-".repeat(desiredRightContext)] = true;
  }
}

for (l of alphabet) {
  for (r of alphabet) {
    process.stderr.write(l+r+": ");
    var matches = obj.filter( (x) => x.includes(l+r) );
    addMatches(matches, desiredLeftContext, desiredRightContext);
    addMatches(matches, 0, desiredRightContext); // Lr--- for cap-lower
  }
}

console.log(JSON.stringify(Object.keys(marked)))