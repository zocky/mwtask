/*
** Text parser
** Splits the input into lines and tests each line with RegExps
**/

var reHeading = /^\s*(=+)(.*?)\1\s*$/;
var reTask = /^\s*(\*+)(.*)$/;

exports.parse = function(text) {
  var lines = text.split(/\n/);
  var list = lines.map( (line,i) => {

    if (!line.trim()) {
      return undefined;
    }

    var m = line.match(reHeading);

    if (m) {
      return {
        type: 'heading',
        depth: m[1].length,
        text: m[2],
        line: i
      } 
    }
    
    var m = line.match(reTask);
    if (m) {
      return {
        type: 'task',
        depth: m[1].length,
        text: m[2],
        line: i
      } 
    }
    console.log('Unrecognized line:',line);    
    throw 'syntax error';
  })
  return list;
}
