var fs = require('fs');

var Getopt = require('node-getopt');

getopt = new Getopt([
  ['t' , 'toHtml=ARG'          , 'convert text to HTML'],
  ['f' , 'fromHtml=ARG'        , 'convert HTML to text'],
  ['o' , 'oldHtml=ARG'         , 'patch existing HTML, requires --diff'],
  ['d' , 'diff=ARG'            , 'patch with diff, requires --oldHtml'],
  ['p' , 'parse'               , 'outputs the parsed non-tree instead of HTML or text'],
  ['h' , 'help'                , 'display this help'],
  ['v' , 'version'             , 'show version']
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
    var parsed = require('./lib/parser-text').parse(text);

    if (opt.options.parse) {
      output(parsed);
    } else {
      var html = require('./lib/output-html').output(parsed);
      output(html);
    }
    
  } else if (opt.options.fromHtml) {

    var html = fs.readFileSync(opt.options.fromHtml,'utf8');
    var parsed = require('./lib/parser-html').parse(html);

    if (opt.options.parse) {
      output(parsed);
    } else {
      var text = require('./lib/output-text').output(parsed);
      output(text);
    }
    
  } else if (opt.options.oldHtml && opt.options.diff) {

    var html = fs.readFileSync(opt.options.oldHtml,'utf8');
    var parsed = require('./lib/parser-html').parse(html);
    
    var diff = fs.readFileSync(opt.options.diff,'utf8');
    var changes = require('./lib/parser-diff').parse(diff);
    var changed = require('./lib/patch').patch(parsed,changes);

    if (opt.options.parse) {
      output(changed);
    } else {
      var html = require('./lib/output-html').output(changed);
      output(html);
    }
  } else {
    getopt.showHelp();
  }
} catch (err) {
  console.error('ERROR', err.message || err);
}

