module.exports = function() {
    this.generateLinesRecursive = function(groupedData, langCode) {
        let lines = '';
        Object.keys(groupedData).forEach((key) => {
            if (groupedData[key].hasOwnProperty('Key')) {
                if (groupedData[key].Key.startsWith('#')) {
                    lines += `/* ${groupedData[key].Key.substring(1).trim()} */`;
                }

                else {
                    let phraseKeyPair = `${key}: \`${groupedData[key][langCode]}\`,`;
                    if (!groupedData[key][langCode]) {
                        phraseKeyPair = `/* ${phraseKeyPair} // no phrase provided - fallback to default */\n`;
                    }

                    lines += phraseKeyPair;
                }
                return lines;
            }
            else {
                lines += `${key}: {`;
                lines += this.generateLinesRecursive(groupedData[key], langCode);
                lines += `},`
            }
          });
          return lines;
    }
  }