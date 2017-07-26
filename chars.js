const config = require("./config")
const NUM_OUTPUT_CHARS = 1000

var fs = require("fs")
var _ = require("underscore")
var synaptic = require("synaptic")

var convert = require("./convert")

var chars = fs
  .readFileSync("./share/heart-of-darkness.txt")
  .toString()
  .split("")

var chunks = (arr, chunkSize) => {
  arr = arr.slice()

  let output = []

  while(arr.length) {
    output.push(_(arr).first(chunkSize))
    arr = _(arr).rest(chunkSize)
  }

  return output
}

var trainingSet = chars.map((c, i) => {
  var numInputChars = config.inputs / config.charLength;
  var numOutputChars = config.outputs / config.charLength;

  var input = chars.slice(i, i + numInputChars)
  var output = chars.slice(
    i + numInputChars, i + numInputChars + numOutputChars)

  //console.log("INPUT", input, "OUTPUT", output)
  //console.log("IO INPUT", convert.toIO(input), "IO OUTPUT", convert.toIO(output))

  return {
    //input: convert.toIO(_.flatten(_.compact(input))),
    //output: convert.toIO(_.flatten(_.compact(output)))
    input: convert.toIO(input),
    output: convert.toIO(output)
  }
}).filter(obj => {
  return obj.output.length == config.outputs
})

var net = new synaptic.Architect.LSTM(config.inputs, 4,4,4,4,4,4,4,4,4, config.outputs)
var trainer = new synaptic.Trainer(net)

var testStr = [
  "The sea-reach of the Tham",
  "an interminable waterway.",
  "together without a joint,",
  "of the barges drifting up",
  "lusters of canvas sharply",
  "haze rested on the low sh",
  "The air was dark above Gr",
  "condensed into a mournful",
  "and the greatest, town on"
];

//var seedStr = "The sea-reach of the Tham"
var seedStr = testStr[2];
var bits = convert.toIO(seedStr)

process.stdout.write(seedStr)

var ioChunks = chunks(trainingSet, 5)

//_(chunks(trainingSet, 5)).forEach((chunk, i, allChunks) => {
//  console.log(i + 1, "of", allChunks.length)
//
//  //_(chunk).each((_chunk) => {
//  //  console.log(
//  //    "INPUT", convert.toString(_chunk.input),
//  //    "OUTPUT", convert.toString(_chunk.output)
//  //  )
//  //})
//
//  var result = trainer.train(chunk, {
//    iterations: 100
//    //log: 3
//  })
//})

var newBits, newText
_(NUM_OUTPUT_CHARS).times(n => {
  trainer.train(ioChunks[n], { iterations: 100 })

  newBits = net.activate(_(bits).last(config.inputs))
  //console.log(newBits.length, bits.length, convert.toString(newBits))

  newText = convert.toString(newBits)

  bits = bits.concat(newBits)

  process.stdout.write(newText)
})
console.log()

process.exit()
