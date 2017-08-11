var fs = require('fs');
var peg = require('pegjs');

var grammar = fs.readFileSync(__dirname + '/diff.peg','utf8');
var parser = peg.generate(grammar);

exports.parse = function(diff) {
  return parser.parse(diff);
}


