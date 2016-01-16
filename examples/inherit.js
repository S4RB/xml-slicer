
var util = require('util');
var stream = require('stream');
var fs = require('fs');
var XmlSlicer = require('../');
var xml2js = require('xml2js');

var fileStream = fs.createReadStream(__dirname + '/bookstore.xml');
var xmlSLicer = XmlSlicer({
  xpath: '//book',
  parse: function (slice, cb) {
    cb(null, '\n--- matched XML ---\n' + slice + '\n');
  }
});

function BookParser() {
  if (!(this instanceof BookParser)) return new BookParser();

  XmlSlicer.call(this, {
    xpath: '//book',
    readableObjectMode: true
  });
}

util.inherits(BookParser, XmlSlicer);

BookParser.prototype._parse = function (slice, cb) {
  xml2js.parseString(slice, cb);
}

var fileStream = fs.createReadStream(__dirname + '/bookstore.xml');

var writable = stream.Writable({objectMode: true})
writable._write = function (chunk, enc, next) {
    console.log('\n--- matched XML ---\n', util.inspect(chunk, {colors: true}));
    next();
};

fileStream.pipe(BookParser()).pipe(writable)
