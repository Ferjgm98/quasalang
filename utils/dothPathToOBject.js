module.exports = function() {
  this.dotPathToObject = function(pathStr, value) {
    const formattedData = pathStr
    .split('.')
    .reverse()
    .reduce((acc, cv, index) => {
      if (index === 0) return `${cv}: \`${value}\`,`;
      return `${cv}: { ${acc} },`;
    }, '');

      return formattedData;
  }
}