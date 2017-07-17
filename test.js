var fs = require("fs")
var _ = require("underscore");
//
//var a = ["aaa", "zzzzzzzzz", "aaaa", "aaaaa"];
//
//var longest = _.reduce(a, (mem, v) => {
//  //mem = "" + mem
//  return mem.length > v.length ? mem : v
//})
//
//console.log(longest)

// n-gram length
const N = 3

var binVal = chars => {
  let mask = [0, 0, 0, 0, 0, 0, 0]
  let out  = [];

  chars.split("").forEach(chr => {
    let buffer = [];
    let bits = chr.toString(2).split("")

    mask.forEach((v, ndx) => {
      buffer[ndx] = bits[ndx]
    })

    out.concat(buffer.map(b => {
      return typeof(b) === "undefined" ? "0" : b
    }))
  })

  return out
}

var text = fs
  .readFileSync("share/heart-of-darkness.txt")
  .toString()

var trainingSet = text
  .split("")
  .map((c, ndx) => {
    return {
      input: binVal(c),
      output: binVal(text.slice(ndx + 1, ndx  + 1 + N)
    }
  })

var len = text.length

var trainingSet = (input, output) => {
  if(typeof(this.set) === "undefined") this.set = []

  if(arguments.length > 0) {
    this.set.push({ input: input, output: output })
  }

  return this.set
}

_(len).times(n => {
  console.log(text[n % len])
})
