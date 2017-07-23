var fs = require("fs")
var _ = require("underscore")
var synaptic = require("synaptic")
//var neataptic = require("neataptic")
var sprintf = require("sprintf")

//var text = fs.readFileSync("./share/heart-of-darkness.txt").toString()
var text = fs.readFileSync("./share/heart-of-darkness.medium.txt").toString()
//var text = fs.readFileSync("./share/heart-of-darkness.short.txt").toString()
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

// Rounds array of floats returned by the network to a string of
// corresponding characters
var fromBits = bits => {
  bits = bits.slice()

  var str = "", bin, b

  while(bits.length) {
    bin = ""

    _(CHAR_LENGTH).times(() => {
      b = bits.shift()

      if(b > 1) b = 1
      else if(b < 0) b = 0

      b = Math.round(b)
      bin += b
    })
    //console.log("BIN", bin)

    str += String.fromCharCode(parseInt(bin, 2))
  }

  return str
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

var ioChunks = chunks(trainingSet, 5)

ioChunks.forEach((chunk, i) => {
  console.log(i + 1, "of", ioChunks.length)

  var result = trainer.train(chunk, {
    iterations: 100,
    log: 3
  })
})

//tests = [
//  "The sea-reach of the Tham",
//  "an interminable waterway.",
//  "together without a joint,",
//  "of the barges drifting up",
//  "lusters of canvas sharply",
//  "haze rested on the low sh",
//  "The air was dark above Gr",
//  "condensed into a mournful",
//  "and the greatest, town on"
//].map(t => {
//  return _.flatten(t.split("").map(toBits))
//}).forEach(t => {
//  //console.log("T0", typeof t[0], t[0], JSON.stringify(t))
//  var result = fromBits(net.activate(t))
//
//  console.log(result)
//})

const NUM_OUTPUT_CHARS = 3000

var lastPhrase = (bits) => {
  return bits.slice(-(PHRASE_LENGTH * CHAR_LENGTH))
}

var seedStr = "The sea-reach of the Tham"
var bits = _.flatten(seedStr.split("").map(toBits))
//console.log(bits, fromBits(bits), "LAST PHRASE", lastPhrase(bits))
//console.log("LAST PHRASE", lastPhrase(bits))

process.stdout.write(seedStr)

_(NUM_OUTPUT_CHARS).times(n => {
  var newBits = net.activate(lastPhrase(bits))
  //console.log(fromBits(newBits))

  bits = bits.concat(newBits)
  process.stdout.write(fromBits(newBits))
})
console.log()

process.exit()
