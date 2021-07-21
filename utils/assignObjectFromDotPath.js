module.exports = function() {
  this.assignObjectFromDotPath = function(pathStr, value) {
    const pathObject = pathStr
    .split('.')
    .reduceRight((acc, currentValue) => {
      return { [currentValue]: acc }
    }, value)

      return pathObject;
  }
}