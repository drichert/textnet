var config = require("./config")
var _ = require("underscore")
var sprintf = require("sprintf")

module.exports =  {
  // Convert string to array of net I/O values
  toIO: (str) => {
    if(_.isString(str)) str = str.split("")

    return str
      .map(chr => {
        let bin = chr.charCodeAt(0).toString(2)
        return sprintf('%0' + config.charLength + 's', bin)
      })
      .join("")
      .split("")
      .map(parseFloat)
  },

  // Convert array of net I/O values to string
  toString: (vals) => {
    vals = vals.slice()

    let str = "", bin

    while(vals.length) {
      bin = _(vals)
        .first(config.charLength)
        .map(n => {
          if(n > 1) n = 1
          else if(n < 0) n = 0

          return "" + Math.round(n)
        })
        .join("")

      str += String.fromCharCode(parseInt(bin, 2))
      vals = _(vals).rest(config.charLength)
    }

    return str
  }
}
