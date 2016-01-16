var XmlSlicer = require('../');
var fs = require('fs');

var fileStream = fs.createReadStream(__dirname + '/bookstore.xml');
var xmlSLicer = XmlSlicer({
  xpath: '//book',
  parse: function (slice, cb) {
    cb(null, '\n--- matched XML ---\n' + slice + '\n');
  }
});
fileStream.pipe(xmlSLicer).pipe(process.stdout);
