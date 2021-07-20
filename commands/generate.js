const fs = require('fs')
const rimraf = require('rimraf')
const csv = require('csv-parser')

const { prompt } = require('inquirer');

require('./lang-switcher.js')();
require('../utils/getLanguagesAndCodesAsObjects.js')();
require('../utils/dothPathToOBject.js')();

module.exports = function() {

  this.generate = function(options) {

    const watermark = 'This file was auto-generated by Quasalang'
    let watching = false

    // sanitize options.input & options.output
    if (options.input.startsWith('/')) options.input = options.input.substring(1)
    if (options.output.startsWith('/')) options.output = options.output.substring(1)

    // create csv and write all files
    readCSVAndWrite()

    function readCSVAndWrite() {

      // somewhere to store message to list files written
      let filesWrittenMessage = []

      // array for results
      let results = [];

      // read the csv file
      fs.createReadStream(options.input)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
      
          let languagesAndCodesAsObjects = getLanguagesAndCodesAsObjects(results)
          
          // initialize main index file
          let mainIndexFile = ``
      
          // add watermark
          if (!options.nowatermark) {
            mainIndexFile += `// ${watermark}\n\n`
          }
      
          // generate main index file import statements
          languagesAndCodesAsObjects.forEach(langObj => {
            mainIndexFile += `import ${langObj.codeAsVariable} from './${langObj.code}'\n`
          });
      
          // generate main index file export statement
          mainIndexFile += `\n`
          mainIndexFile += `export default { \n`
          languagesAndCodesAsObjects.forEach(langObj => {
            mainIndexFile += `\t'${langObj.code}': ${langObj.codeAsVariable}, // ${langObj.lang}\n`
          });
          mainIndexFile += `}`
      
          // check if output folder exists & prompt to confirm
          if (fs.existsSync(options.output)) {
            if (!options.force) {
              prompt([
                {
                  type: 'confirm',
                  name: 'confirmDeleteOutputFolder',
                  message: `Folder ${options.output} exists. Overwrite it?`
                }
              ]).then(answers => {
                if (answers.confirmDeleteOutputFolder) {
                  console.log('INFO: Skip this prompt in future with the --force (or -f) option.')
                  deleteOutputFolder()
                }
              })
            }
            else {
              deleteOutputFolder()
            }
          }
          else {
            writeFiles()
          }
  
          // delete the output folder if it exists
          function deleteOutputFolder() {
            if (fs.existsSync(options.output)) {
              // try {
                // fs.rmdirSync(options.output, { recursive: true });
                //   writeFiles()
                // } catch (err) {
                //     console.error(`Error while deleting ${options.output}.`);
                //     console.error(err)
                // }
                rimraf(options.output, function (err) { 
                  if (err) {
                    console.error(`Error while deleting ${options.output}.`);
                    console.error(err)
                  }
                  else {
                    writeFiles()
                  }
                })
            }
            else {
              writeFiles()
            }
          }
      
          // write files
          function writeFiles() {
            // write the output folder if it doesn't exist
            if (!fs.existsSync(options.output)){
              fs.mkdirSync(options.output, { recursive: true });
            }
        
            // write the main index file
            fs.writeFile(`${options.output}/index.js`, mainIndexFile, function(err) {
              if(err) {
                return console.log(err);
              }
              filesWrittenMessage.push({ 
                'File': 'Main index file',
                'Code': '',
                'Path': `${options.output}/index.js`,
              })
        
              // generate individual language folders and index.js files
              let languageFilesWritten = 0
              languagesAndCodesAsObjects.forEach(langObj => {
          
                // create language folder
                if (!fs.existsSync(`${options.output}/${langObj.code}`)){
                  fs.mkdirSync(`${options.output}/${langObj.code}`);
                }
          
                // generate language index file
                let languageIndexFile = ``
          
                // add language comment to the top
                languageIndexFile += `// ${langObj.lang}, ${langObj.code}`
          
                // add watermark
                if (!options.nowatermark) {
                  languageIndexFile += `\n// ${watermark}`
                }
               
                // add blank lines
                languageIndexFile += `\n\n`
          
                // add opening export statement
                languageIndexFile += `export default {\n`
          
                // add translations
                results.forEach(result => {
                  // row is not empty
                  if (result.Key) {
                    // add a comment if csv row is a comment
                    if (result.Key.startsWith('#')) {
                      languageIndexFile += `\t// ${result.Key.substring(1).trim()}\n`
                    }
                    // or just add the phrase key pair
                    else {
                      languageIndexFile += `\t`
                      const blockKeyPair = dotPathToObject(result.Key, result[langObj.langAndCode]);
                      let phraseKeyPair = blockKeyPair;
                      // if no phrase provided, comment it out
                      if (!result[langObj.langAndCode]) {
                        phraseKeyPair = `// ${phraseKeyPair} // no phrase provided - fallback to default`
                      }
                      languageIndexFile += phraseKeyPair
                      languageIndexFile += `\n`
                    }
                  }
                  // row is empty, add a blank line
                  else {
                    languageIndexFile += `\n`
                  }
                });
          
                // add closing brace
                languageIndexFile += `}`
          
                // write the language index file
                let languageIndexFilePath = `${options.output}/${langObj.code}/index.js`
                fs.writeFile(`${languageIndexFilePath}`, languageIndexFile, function(err) {
                  if(err) {
                    return console.log(err);
                  }
                  filesWrittenMessage.push({ 
                    'File': `${langObj.lang}`,
                    'Code': `${langObj.code}`,
                    'Path': `${languageIndexFilePath}`,
                  })
                  languageFilesWritten++
                  if (languageFilesWritten === languagesAndCodesAsObjects.length) {
                    logWriteMessages()
                  }
                })
          
              });
            })
          }
  
          // log write messages
          function logWriteMessages() {
            console.log(`\nWrote ${filesWrittenMessage.length} files:`)
            console.table(filesWrittenMessage)
  
            if (options.langSwitcher) {
              console.log('')
              langSwitcher({ input: options.input })
            }

            setupWatcher()
          }
      
        })
    }

    function setupWatcher() {
      if (options.watch) {
        setTimeout(() => {
          timestampLog(`Watching ${options.input} for changes...`)

          if (!watching) {
            watching = true
            fs.watchFile(options.input, { interval: 1000 },(curr, prev) => {
              timestampLog(`File ${options.input} changed.`)
              timestampLog(`Regenerating language files...`)
              options.force = true
              readCSVAndWrite(options)
            })
          }
          
        }, 500)
      }
    }

    function timestampLog(message) {
      console.log(`[${new Date().toLocaleString()}] ${message}`)
    }

  }
}