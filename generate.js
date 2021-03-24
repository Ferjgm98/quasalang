const fs = require('fs')
const rimraf = require('rimraf')
const csv = require('csv-parser')

const { prompt } = require('inquirer')

module.exports = function() { 
  this.generate = function(csvPath, outputPath) {
    const results = [];
    const watermark = 'This file was auto-generated by quasalang'
    let filesWrittenMessage = []
  
    // sanitize csvPath & outputPath
    if (csvPath.startsWith('/')) csvPath = csvPath.substring(1)
    if (outputPath.startsWith('/')) outputPath = outputPath.substring(1)
    
    // read the csv file
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => {
    
        // get languages and codes
        let languagesAndCodes = Object.assign({}, results[0])
        delete languagesAndCodes['Key']
        languagesAndCodes = Object.keys(languagesAndCodes)
        
        // generate array of lang, code & codeAsVariable as objects
        let languagesAndCodesAsObjects = []
        
        languagesAndCodes.forEach(languageAndCode => {
          let langAndCode = languageAndCode
          let lang = languageAndCode.split(',')[0]
          let code = languageAndCode.split(',')[1].trim()
          let codeAsVariable = code.split('-').join('')
          let languagesAndCodesObject = {
            langAndCode,
            lang,
            code,
            codeAsVariable
          }
          languagesAndCodesAsObjects.push(languagesAndCodesObject)
          
        });
        
        // initialize main index file
        let mainIndexFile = ``
    
        // add watermark
        mainIndexFile += `// ${watermark}\n\n`
    
        // generate main index file import statements
        languagesAndCodesAsObjects.forEach(langObj => {
          mainIndexFile += `import ${langObj.codeAsVariable} from './${langObj.code}' // ${langObj.lang}\n`
        });
    
        // generate main index file export statement
        mainIndexFile += `\n`
        mainIndexFile += `export default { \n`
        languagesAndCodesAsObjects.forEach(langObj => {
          mainIndexFile += `\t'${langObj.code}': ${langObj.codeAsVariable}, // ${langObj.lang}\n`
        });
        mainIndexFile += `}`
    
        // check if output folder exists & prompt to confirm
        if (fs.existsSync(outputPath)) {
          prompt([
            {
              type: 'confirm',
              name: 'confirmDeleteOutputFolder',
              message: `Folder ${outputPath} exists. Overwrite it?`
            }
          ]).then(answers => {
            if (answers.confirmDeleteOutputFolder) {
              deleteOutputFolder()
            }
          })
        }
        else {
          writeFiles()
        }

        // delete the output folder if it exists
        function deleteOutputFolder() {
          if (fs.existsSync(outputPath)) {
            // try {
              // fs.rmdirSync(outputPath, { recursive: true });
              //   writeFiles()
              // } catch (err) {
              //     console.error(`Error while deleting ${outputPath}.`);
              //     console.error(err)
              // }
              rimraf(outputPath, function (err) { 
                if (err) {
                  console.error(`Error while deleting ${outputPath}.`);
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
          if (!fs.existsSync(outputPath)){
            fs.mkdirSync(outputPath, { recursive: true });
          }
      
          // write the main index file
          fs.writeFile(`${outputPath}/index.js`, mainIndexFile, function(err) {
            if(err) {
              return console.log(err);
            }
            filesWrittenMessage.push({ 
              'File': 'Main index file',
              'Code': '',
              'Path': `${outputPath}/index.js`,
            })
      
            // generate individual language folders and index.js files
            let languageFilesWritten = 0
            languagesAndCodesAsObjects.forEach(langObj => {
        
              // create language folder
              if (!fs.existsSync(`${outputPath}/${langObj.code}`)){
                fs.mkdirSync(`${outputPath}/${langObj.code}`);
              }
        
              // generate language index file
              let languageIndexFile = ``
        
              // add language comment to the top
              languageIndexFile += `// ${langObj.lang}, ${langObj.code}\n`
        
              // add watermark
              languageIndexFile += `// ${watermark}\n\n`
        
              // add opening export statement
              languageIndexFile += `export default {\n`
        
              // add translations
              results.forEach(result => {
                languageIndexFile += `\t${result.Key}: "${result[langObj.langAndCode]}",\n`
              });
        
              // add closing brace
              languageIndexFile += `}`
        
              // write the language index file
              let languageIndexFilePath = `${outputPath}/${langObj.code}/index.js`
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
          console.log(`Wrote ${filesWrittenMessage.length} files:`)
          console.table(filesWrittenMessage)
        }
    
      })
  }
}