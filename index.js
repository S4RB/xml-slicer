
var util = require('util');
var stream = require('stream');
var sax = require('sax');
var saxpath = require('saxpath');
var util = require('util');
var XmlRecorder = require('../../saxpath/lib/xml_recorder');

var CustomRecorder = function () {
  XmlRecorder.call(this);
};
util.inherits(CustomRecorder, XmlRecorder);

CustomRecorder.prototype.onText = function(text) {
  text = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;') // "
    .replace(/'/g, '&apos;'); // '

  CustomRecorder.super_.prototype.onText.bind(this)(text);
};

function XmlSlicer(opts) {
  if (!(this instanceof XmlSlicer)) return new XmlSlicer(opts);

  stream.Transform.call(this, opts);

  opts = opts || {};
  if (typeof opts.parse === 'function') this._parse = opts.parse;

  var self = this;

  var xpath = opts.xpath || '/*';
  var concurrency = opts.concurrency || 1;
  var queue = [];

  this._parsing = 0;
  this._sax = sax.createStream(true);

  var streamer = new saxpath.SaXPath(this._sax, xpath, new CustomRecorder());
  streamer.on('match', function(fragment) {

    if (self._parsing < concurrency) return parsing(fragment);

    queue.push(fragment);

    function parsing(xml, cb) {
      self._parsing++;
      self._parse(xml, function (err, item) {
        if (err) self.emit('error', err);
        if (item) self.push(item);
        self._parsing--;
        if (!queue.length) return self.emit('idle');
        parsing(queue.shift());
      });
    }

  });
}

util.inherits(XmlSlicer, stream.Transform);

XmlSlicer.prototype._transform = function (chunk, enc, cb) {
  this._sax.write(chunk, enc);
  if (this._parsing) return this.once('idle', cb);
  cb()
};

XmlSlicer.prototype._flush = function (cb) {
  if (this._parsing) return this.once('idle', cb);
  cb();
};

XmlSlicer.prototype._parse = function (slice, cb) {
  cb(null, slice) // do nothing
};

module.exports = XmlSlicer;
