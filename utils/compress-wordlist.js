/*
  Given a wordlist as a JSON array on stdin, output a smaller
  wordlist containing at least N options for each letter pair.

  Does not do anything clever to find a minimal set, because if
  we have >N options per pair that's a nice bonus. Instead it
  finds the *first* N options. This is quite helpful because if
  the wordlist is sorted in order of frequency, then the output will
  also contain high frequency words.

  Call as
    node compress-wordlist.js "abcdefghijklmnopqrstuvwxyz" < in.json > out.json
*/

var minimumWordLength = 3;
var wordOptions       = 3;
var alphabet = process.argv[2];
if (!alphabet) {
  console.error("No alphabet provided");
  process.exit(1)
}

var fs = require('fs');
var obj = JSON.parse(fs.readFileSync(process.stdin.fd, 'utf8'));
var marked = {}
for (l of alphabet) {
  console.error(l)
  for (r of alphabet) {
    var matches = obj.filter( (x) => x.match(l+r) && x.length > minimumWordLength ).slice(0,wordOptions+1);
    for (m of matches) {
      marked[m] = true;
    }
  }
}
console.log(JSON.stringify(Object.keys(marked)))