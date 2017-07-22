var fs = require("fs")
var _ = require("underscore")
var synaptic = require("synaptic")
//var neataptic = require("neataptic")
var sprintf = require("sprintf")

//var text = fs.readFileSync("./share/heart-of-darkness.txt").toString()
var text = fs.readFileSync("./share/heart-of-darkness.short.txt").toString()
var chars = text.split("")

// Word length in chracters
const WORD_LENGTH = 5
// Number of characters to approximate for input filter and output pattern
const PHRASE_LENGTH = WORD_LENGTH * 5
console.log(PHRASE_LENGTH)

// Network input/output length (number of bits, 7 per character)
const NUM_INPUTS = PHRASE_LENGTH  * 7
const NUM_OUTPUTS = PHRASE_LENGTH * 7
console.log(NUM_INPUTS, NUM_OUTPUTS)

// Convert input charater to an array of 7 bits (as floats)
var asNetIO = c => {
  return sprintf("%07s", c.charCodeAt(0).toString(2))
    .split("")
    .map(parseFloat)
}

var trainingSet = chars.map((c, i) => {
  var input = chars.slice(i, i + PHRASE_LENGTH)
  var output = chars.slice(i + PHRASE_LENGTH, i + PHRASE_LENGTH * 2)

  console.log(i + 1, "of", chars.length);
  return {
    input: _.flatten(input.map(asNetIO)),
    output: _.flatten(output.map(asNetIO))
  }
  //console.log(obj)
  //console.log(input.length, obj.input.length, output.length, obj.output.length)
  //return obj
}).filter(obj => {
  return obj.output.length == NUM_OUTPUTS
})

//console.log(JSON.stringify(trainingSet))

var net = new synaptic.Architect.LSTM(
  NUM_INPUTS,
  4,
  NUM_OUTPUTS
)

var trainer = new synaptic.Trainer(net)

trainer.train(trainingSet, {
  iterations: 100,
  log: 10
})
//trainingSet.map(io => {
//  //var trainResult = trainer.train([io], {
//  var result = trainer.train([io], {
//    iterations: 5,
//    log:
//  })
//
//  console.log(result)
//})
