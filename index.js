var fs = require('fs');

var opt = require('node-getopt').create([
  ['t' , 'toHtml=ARG'          , 'convert text to HTML'],
  ['f' , 'fromHtml=ARG'        , 'convert HTML to text'],
  ['o' , 'oldHtml=ARG'         , 'patch existing HTML, requires --diff'],
  ['d' , 'diff=ARG'            , 'patch with diff, requires --oldHtml'],
  ['p' , 'parse'               , 'outputs the parsed non-tree instead of HTML or text'],
  ['h' , 'help'                , 'display this help'],
  ['v' , 'version'             , 'show version']
])              
.bindHelp()     
.parseSystem(); 

if (opt.options.toHtml) {

  var text = fs.readFileSync(opt.options.toHtml,'utf8');
  var parsed = require('./lib/parser-text').parse(text);

  if (opt.options.parse) {
    console.log(parsed);
  } else {
    var html = require('./lib/output-html').output(parsed);
    console.log(html);
  }
  
} else if (opt.options.fromHtml) {

  var html = fs.readFileSync(opt.options.fromHtml,'utf8');
  var parsed = require('./lib/parser-html').parse(html);

  if (opt.options.parse) {
    console.log(parsed);
  } else {
    var text = require('./lib/output-text').output(parsed);
    console.log(text);
  }
  
} else if (opt.options.oldHtml && opt.options.diff) {

  var html = fs.readFileSync(opt.options.oldHtml,'utf8');
  var parsed = require('./lib/parser-html').parse(html);
  
  var diff = fs.readFileSync(opt.options.diff,'utf8');
  var changes = require('./lib/parser-diff').parse(diff);
  var changed = require('./lib/patch').patch(parsed,changes);

  if (opt.options.parse) {
    console.log(changed);
  } else {
    var html = require('./lib/output-html').output(changed);
    console.log(html);
  }
}

