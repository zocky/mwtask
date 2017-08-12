var fs = require('fs');
var peg = require('pegjs');

var Getopt = require('node-getopt');

getopt = new Getopt([
  ['t' , 'toHtml=ARG'          , 'convert text to HTML'],
  ['f' , 'fromHtml=ARG'        , 'convert HTML to text'],
  ['h' , 'help'                , 'display this help'],
]);

getopt.bindHelp();
var opt = getopt.parseSystem(); 
var output;
if (opt.argv[0]) {
  output = function(obj) {
    fs.writeFileSync(
      opt.argv[0],
      typeof obj == 'string' ? obj : JSON.stringify(obj),
      'utf8'
    );
  }
} else {
  output = console.log.bind(console);
}


try {
  if (opt.options.toHtml) {

    var text = fs.readFileSync(opt.options.toHtml,'utf8');
    var grammar = fs.readFileSync(__dirname + '/lib/text2html.peg','utf8');
    var parser = peg.generate(grammar);
    var parsed = parser.parse(text);
    output(parsed);
    
  } else if (opt.options.fromHtml) {

    var text = fs.readFileSync(opt.options.fromHtml,'utf8');
    var grammar = fs.readFileSync(__dirname + '/lib/html2text.peg','utf8');
    var parser = peg.generate(grammar);
    var parsed = parser.parse(text);
    output(parsed);

  } else {
    getopt.showHelp();
  }  
} catch (err) {
  console.error('ERROR', err.message || err);
}

