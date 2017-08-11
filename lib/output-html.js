OutputHTML = class OutputHTML {
  constructor() {
    this.hDepth = 1;
    this.lDepth = 0;
    this.html = "";
  }
  out(indent,text) {
    this.html += " ".repeat(indent*2) + text + "\n";
  }
  
  closeList( depth = 0 ) {
    while(this.lDepth > depth) {
      this.out(this.hDepth + this.lDepth, `</ol>`);
      this.lDepth --;
    }
  }
  closeSection( depth = 1) {
    this.closeList();
    while(this.hDepth > depth) {
      this.out(this.hDepth, `</section>`);
      this.hDepth --;
    }
  }
  
  heading(i,def) {
    this.closeSection(def.depth);
    
    while(this.hDepth < def.depth) {
      this.hDepth ++;
      this.out(this.hDepth, `<section>`);
    }
    this.out(this.hDepth+1, `<h${this.hDepth} line="${i}">${def.text}</h${this.hDepth}>`);
  }
  task(i,def) {
    this.closeList(def.depth);
    while(this.lDepth < def.depth) {
      this.lDepth ++;
      this.out(this.lDepth + this.hDepth, `<ol>`);
    }
    this.out(this.lDepth+this.hDepth+1, `<li line="${i}" depth="${def.depth}">${def.text}</li>`);
  }
  dump(list) {
    for (var i=0; i<list.length; i++) {
      var def = list[i];
      if (!def) continue;
      if (def.type == 'heading') {
        this.heading(i,def);
      } else if (def.type == 'task') {
        this.task(i,def);
      } else throw 'bad input from parser'
    }
    this.closeSection()
  }
}

exports.output = function (list) {
  var output = new OutputHTML();
  output.dump(list);
  return output.html;
}
