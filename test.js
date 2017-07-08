var _ = require("underscore");

var a = ["aaa", "zzzzzzzzz", "aaaa", "aaaaa"];

var longest = _.reduce(a, (mem, v) => {
  //mem = "" + mem
  return mem.length > v.length ? mem : v
})

console.log(longest)
