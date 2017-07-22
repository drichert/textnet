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
const PHRASE_LENGTH = WORD_LENGTH * 5 // Number of characters for input filter

// Network input/output length (number of bits, 7 per character)
const NUM_INPUTS = PHRASE_LENGTH  * CHAR_LENGTH
const NUM_OUTPUTS = CHAR_LENGTH // Save one character (7 bits) as output

// Convert input charater to an array of 7 bits (as floats)
var toBits = c => {
  return sprintf('%0' + CHAR_LENGTH + 's', c.charCodeAt(0).toString(2))
    .split("")
    .map(parseFloat)
}

var fromBits = bits => {
  return String.fromCharCode(
    parseInt(bits.map(b => { return "" + b }).join(""), 2))
}

var trainingSet = chars.map((c, i) => {
  var input = chars.slice(i, i + PHRASE_LENGTH)
  var output = _.flatten([chars[PHRASE_LENGTH + i]])

  return {
    input: _.flatten(_.compact(input).map(toBits)),
    output: _.flatten(_.compact(output).map(toBits))
  }
}).filter(obj => {
  return obj.output.length == NUM_OUTPUTS
})

var net = new synaptic.Architect.LSTM(NUM_INPUTS, 4, NUM_OUTPUTS)
var trainer = new synaptic.Trainer(net)

var io_chunks = chunks(trainingSet, 5)

io_chunks.forEach((chunk, i) => {
  console.log(i + 1, "of", io_chunks.length)

  var result = trainer.train(chunk, {
    iterations: 100,
    log: 3
  })
})

tests = [
  "The sea-reach of the Tham",
  "an interminable waterway.",
  "together without a joint,",
  "of the barges drifting up",
  "lusters of canvas sharply",
  "haze rested on the low sh",
  "The air was dark above Gr",
  "condensed into a mournful",
  "and the greatest, town on"
].map(t => {
  return _.flatten(t.split("").map(toBits))
}).forEach(t => {
  //console.log("T0", typeof t[0], t[0], JSON.stringify(t))
  var result = net.activate(t)

  console.log(result)
})
