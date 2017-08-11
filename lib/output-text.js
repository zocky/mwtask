OutputText = class OutputText {
  constructor() {
    this.line = 1;
    this.text = '';
  }
  out(text) {
    this.text += text + "\n";
  }
  empty() {
    this.out('')
  }
  heading(def) {
    var bars = "=".repeat(def.depth);
    this.out(`${bars} ${def.text} ${bars}`);
  }
  task(def) {
    var aster = "*".repeat(def.depth);
    this.out(`${aster} ${def.text}`);
  }
  
  dump(list) {
    for (var i=0; i<list.length; i++) {
      var def = list[i];
      if (!def) {
        this.empty();
      } else if (def.type == 'heading') {
        this.heading(def);
      } else if (def.type == 'task') {
        this.task(def);
      } else throw 'bad input from parser'
    }
  }
}

exports.output = function (list) {
  var output = new OutputText();
  output.dump(list);
  return output.text;
}
