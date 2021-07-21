module.exports = function() {
  this.doPathToObjectString = function(pathStr, value) {
    const formattedData = pathStr
    .split('.')
    .reverse()
    .reduce((acc, cv, index) => {
      if (index === 0) return `${cv}: \`${value}\`,`;
      return `${cv}: { ${acc} },`;
    }, '');

      return formattedData;
  }

  this.doPathToObject = function(pathStr, value) {
    const pathObject = pathStr
    .split('.')
    .reduceRight((acc, currentValue) => {
      return { [currentValue]: acc }
    }, value)

      return pathObject;
  }
}