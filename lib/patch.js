var parser = require('./parser-text');
exports.patch = function(old,changes) {
  var changed = old.concat();
  changes.forEach( change => {
    if (change.lines !== undefined) {
      var parsed = parser.parse(change.lines);
      changed.splice(change.at,change.len,...parsed);
    } else {
      changed.splice(change.at,change.len);
    }
  })
  return changed;
}
