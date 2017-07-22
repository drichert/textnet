var fs = require("fs")
var _ = require("underscore")
var synaptic = require("synaptic")
//var neataptic = require("neataptic")
var sprintf = require("sprintf")

//var text = fs.readFileSync("./share/heart-of-darkness.txt").toString()
var text = fs.readFileSync("./share/heart-of-darkness.short.txt").toString()
var chars = text.split("")

var chunks = (arr, chunkSize) => {
  //console.log("!!!", this)
  var _chunks = []
  var start = 0
  var end = start + chunkSize

  while(start < arr.length) {
    _chunks.push(arr.slice(start, end))
    start += chunkSize
    end += chunkSize
  }

  return _chunks
}

const CHAR_LENGTH = 7 // Character length in bits
const WORD_LENGTH = 5 // Word length in characters

// Number of characters to approximate for input filter and output pattern
const PHRASE_LENGTH = WORD_LENGTH * 5

// Network input/output length (number of bits, 7 per character)
const NUM_INPUTS = PHRASE_LENGTH  * CHAR_LENGTH
//const NUM_OUTPUTS = PHRASE_LENGTH * 7
const NUM_OUTPUTS = CHAR_LENGTH // Save one character (7 bits) as output

// Convert input charater to an array of 7 bits (as floats)
var asNetIO = c => {
  return sprintf('%0' + CHAR_LENGTH + 's', c.charCodeAt(0).toString(2))
    .split("")
    .map(parseFloat)
}

var trainingSet = chars.map((c, i) => {
  var input = chars.slice(i, i + PHRASE_LENGTH)
  var output = _.flatten([chars[PHRASE_LENGTH + i]])

  return {
    input: _.flatten(_.compact(input).map(asNetIO)),
    output: _.flatten(_.compact(output).map(asNetIO))
  }
}).filter(obj => {
  return obj.output.length == NUM_OUTPUTS
})

//console.log(trainingSet.length)
//console.log(JSON.stringify(trainingSet))
//console.log("type of training set", trainingSet.chunks)
//console.log(trainingSet.chunks(5))
//console.log(chunks(trainingSet))
//console.log(trainingSet[0].output)
//console.log(chunks(trainingSet, 5).length)

var net = new synaptic.Architect.LSTM(NUM_INPUTS, 4, NUM_OUTPUTS)
var trainer = new synaptic.Trainer(net)

chunks(trainingSet, 5).forEach(chunk => {
  var result = trainer.train(chunk, {
    iterations: 100,
    log: 1
  })

  console.log(result)
})

// TODO: Activate
net.activat
