const merge = require('deepmerge');

module.exports = function() {
    this.groupByAndMergeDeep = function(
        inputArray,
        key,
        removeKey = false,
        outputType = [],
      ) {
        return inputArray.reduce((previous, current) => {
            // Get the current value that matches the input key and remove the key value for it.
            const { [key]: keyValue } = current;
            const formattedKeyObject = assignObjectFromDotPath(keyValue, current);
            // remove the key if option is set
            removeKey && keyValue && delete current[key];

            // Create a new object and return that merges the previous with the current object
            return merge(previous, formattedKeyObject);
          },
          // Replace the object here to an array to change output object to an array
          outputType,
        );
      };
  }