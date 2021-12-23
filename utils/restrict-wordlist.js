/*
  Given a wordlist as text file on stdin, output a smaller
  wordlist containing only those words with characters within
  the given unicode start and end range

  Call as
    node restrict-wordlist.js 00SS 00EE < in.json > out.json
*/
var start = parseInt(process.argv[2], 16);
var end = parseInt(process.argv[3], 16);

console.error("Loading wordlist...");
var fs = require("fs");
var obj = JSON.parse(fs.readFileSync(process.stdin.fd, "utf8"));
obj = obj.filter((s) =>
  Array.from(s, (c) => c.codePointAt(0)).every((c) => c >= start && c <= end)
);

console.log(JSON.stringify(obj));
