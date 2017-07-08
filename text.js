var fs = require("fs")
var _ = require("underscore")
var pad = require("underscore.string/pad")
var natural = require("natural")
var synaptic = require("synaptic")

var textPath = "./share/heart-of-darkness.txt"
var text = fs.readFileSync(textPath).toString()

var tokenizer = new natural.WordTokenizer
var metaphone = natural.Metaphone

var words = tokenizer.tokenize(text)

//console.log(_.isArray(words))
var phonetics = words.map(metaphone.process)

var longest =  _(phonetics).reduce((mem, ph) => {
  return mem.length > ph.length ? mem : ph
})

// Use length of binary representation of the number of words we're using
// we'll use a binary value to index the word list
var num_outputs = words.length.toString(2).length

// Convert phonetic index to a flattened array of
// 7-bit binary numbers representing each character in the
// index
var normalize_phonemes = (str, length = null) => {
  var chars = str.split("")

  var bins = chars.map(c => {
    return pad(
        c.charCodeAt().toString(2),
        7,
        "0"
      ).split("")
      .map(bit => {
        return parseInt(bit)
      })
  })

  bins = _(bins).flatten()
  if(length) {
    while(bins.length < length) {
      bins.unshift(0)
    }
  }

  return bins
}

var num_inputs = normalize_phonemes(longest).length


var net = new synaptic.Architect.Perceptron(
  num_inputs,
  2,
  num_outputs
)

var trainer = new synaptic.Trainer(net)

var trainingSet = phonetics.map((ph, ndx) => {
  if(typeof words[ndx + 1] !== "undefined") {
    return {
      input: normalize_phonemes(ph, num_inputs),
      output: pad(
          (ndx + 1).toString(2),
          num_outputs,
          "0"
        ).split("")
        .map(bit => { return parseInt(bit) })
    }
  } else return null;
})
trainingSet = _(trainingSet).compact()
//console.log(trainingSet)

trainer.train(trainingSet, { iterations: 100, log: true })

var test_ndx = 13121
var test_word = words[test_ndx]
//
var test_input = normalize_phonemes(metaphone.process(test_word), num_inputs)
//console.log(test_input)
var test_result = net.activate(test_input)
test_result = parseInt(test_result.map(Math.round).join(""), 2)
console.log(words[test_result])
