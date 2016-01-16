#  XmlSlicer

Slice XML stream using XPath expression

Supported XPath constructs are:
  - '/'-axis (child)
  - '//'-axis (self-or-descendant)
  - node name tests, including namespaces
  - all nodes selector: '*'
  - predicate test:
  - @attribute_name = "literal"


## Usage

Instantiate a new XmlSlicer stream and pipe a XML into it. Then XmlSlicer will emit `data` events on each XPath match. Prior to pass further down the pipe XML fragment can be somehow parsed using internal _XmlSlicer._parse_ method.

## Example

An example of how to use this library is as follows:

```
var fs = require('fs');
var XmlSlicer = require('xml-slicer');

var fileStream = fs.createReadStream('bookstore.xml');
var xmlSLicer = XmlSlicer({xpath: '//book'});
fileStream.pipe(xmlSLicer).pipe(process.stdout);

```

Check out the examples directory for more usage examples.

## To-do list

  - write tests
