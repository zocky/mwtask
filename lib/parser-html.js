/*
** Extremely stupid HTML parser
** It uses a RegExp to extract headings and list items that were produced with the HTML dumper
**/
 
exports.parse = function(html) {
  var list = [];
  var m;
  var re = /<(h(\d)|li)[^>]*line="(\d+)"(\s+depth="(\d+)")?[^>]*>(.*?)<\/\1>/g;
  while (m = re.exec(html)) {
    var i = m[3];
    
    if (list[i]) throw 'Bad HTML, duplicate line number';
    
    list[i] = {
      type: m[2] ? 'heading' : 'task',
      line: i,
      depth: m[5] ? m[5] : m[2],
      text: m[6] 
    }
  }
  return list;
}
