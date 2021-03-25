# Quasalang CLI

> Generate all your Quasar i18n language files from a CSV file


Quasalang is a global CLI tool that allows you to generate all your i18n language files (including the main index.js file) instantly from a single, easy to update CSV file.

It will also generate a sample CSV file for you, so you can easily get started.

You can also organise your phrases with empty lines & comments.

## Contents

- [Quasalang CLI](#quasalang-cli)
  - [Contents](#contents)
  - [Getting Started](#getting-started)
    - [Step 1: Install globally](#step-1-install-globally)
    - [Step 2: Generate a Sample CSV file](#step-2-generate-a-sample-csv-file)
    - [Step 3: Add your own languages & translations](#step-3-add-your-own-languages--translations)
    - [Step 4: Generate your language files](#step-4-generate-your-language-files)
  - [Options](#options)
    - [Input Path](#input-path)
    - [Output Path](#output-path)
    - [Force Write](#force-write)
    - [No Watermark](#no-watermark)
  - [Use Empty Rows to Split Up Your Phrases](#use-empty-rows-to-split-up-your-phrases)
  - [Use Comments to Organise your Phrases](#use-comments-to-organise-your-phrases)
  - [Use Strings as Your Keys](#use-strings-as-your-keys)

## Getting Started

### Step 1: Install globally
```bash
$ npm install -g quasalang
```

Once installed, get yourself to the root of a Quasar project

```bash
$ cd my-quasar-project
```

### Step 2: Generate a Sample CSV file
```bash
$ quasalang create-csv
```

This will generate a CSV file at `/translations.csv` that looks like this:

| Key     | English, en-US | French, fr | German, de      |
|---------|----------------|------------|-----------------|
| hello   | Hello          | Bonjour    | Hallo           |
| goodbye | Goodbye        | Au revoir  | Auf Wiedersehen |
| thanks  | Thanks         | Merci      | Danke           |

<details>
  <summary>View Source</summary>

  ```csv
  Key,"English, en-US","French, fr","German, de"
  hello,"Hello","Bonjour","Hallo"
  goodbye,"Goodbye","Au revoir","Auf Wiedersehen"
  thanks,"Thanks","Merci","Danke"
  ```
</details>

### Step 3: Add your own languages & translations

Use a CSV editor (such as the [VSCode Extension "Edit csv"](https://marketplace.visualstudio.com/items?itemName=janisdd.vscode-edit-csv)) to add your own languages & phrases.

**Be sure to use the format** `Language, code` in the header row e.g. `Russian, ru`:

| Key      | English, en-US | French, fr          | German, de      | Russian, ru     |
|----------|----------------|---------------------|-----------------|-----------------|
| hello    | Hello          | Bonjour             | Hallo           | Привет          |
| goodbye  | Goodbye        | Au revoir           | Auf Wiedersehen | До свидания     |
| thanks   | Thanks         | Merci               | Danke           | Спасибо         |
| buttHair | Butt hair      | Cheveux bout à bout | Hintern Haare   | стыковые волосы |

<details>
  <summary>View Source</summary>

  ```csv
  Key,"English, en-US","French, fr","German, de","Russian, ru"
  hello,"Hello","Bonjour","Hallo",Привет
  goodbye,"Goodbye","Au revoir","Auf Wiedersehen",До свидания
  thanks,"Thanks","Merci","Danke",Спасибо
  buttHair,"Butt hair","Cheveux bout à bout","Hintern Haare",стыковые волосы
  ```
</details>

### Step 4: Generate your language files

Generate all the language files you need based on your CSV:

```bash
$ quasalang generate
```

By default, this will generate (or overwrite) your `/src/i18n` folder, generating all the files and folders you need:

```
src/
├─ i18n/
│  ├─ de/
│  │  ├─ index.js
│  ├─ en-US/
│  │  ├─ index.js
│  ├─ fr/
│  │  ├─ index.js
│  ├─ ru/
│  │  ├─ index.js
│  ├─ index.js
```

Your main index file `/src/i18n/index.js` will look like this:

```javascript
// This file was auto-generated by quasalang

import enUS from './en-US'
import fr from './fr'
import de from './de'
import ru from './ru'

export default { 
  'en-US': enUS, // English
  'fr': fr, // French
  'de': de, // German
  'ru': ru, // Russian
}
```

And your language files, e.g. `/src/i18n/ru/index.js` will look like this:

```javascript
// Russian, ru
// This file was auto-generated by quasalang

export default {
  hello: "Привет",
  goodbye: "До свидания",
  thanks: "Спасибо",
  buttHair: "стыковые волосы",
}
```

## Options

### Input Path

The default input path is `/translations.csv` but you can change it if you like:

```bash
$ quasalang generate -input /files/my-translations.csv
```

Or use the shorthand:

```bash
$ quasalang g -i /files/my-translations.csv
```

### Output Path

The default output path is `/src/i18n` but you can change it if you like:

```bash
$ quasalang generate -output /src/my-translations
```

Or use the shorthand:

```bash
$ quasalang g -o /src/my-translations
```

### Force Write

By default, if the output folder exists, you'll be prompted to overwrite it:

```bash
? Folder src/i18n exists. Overwrite it? (Y/n) 
```

You can skip this prompt if you like:

```bash
$ quasalang generate --force
```

Or use the shorthand:

```bash
$ quasalang g -f
```

### No Watermark

By default, Quasalang will add a watermark to your files:

```javascript
// This file was auto-generated by quasalang
```

You can disable this if you like:

```bash
$ quasalang generate --nowatermark
```

Or use the shorthand:

```bash
$ quasalang g -nw
```

## Use Empty Rows to Split Up Your Phrases

You can leave empty rows in your CSV file, like this:

| Key      | English, en-US | French, fr          | German, de      | Russian, ru     |
|----------|----------------|---------------------|-----------------|-----------------|
| &nbsp;   |                |                     |                 |                 |
| hello    | Hello          | Bonjour             | Hallo           | Привет          |
| goodbye  | Goodbye        | Au revoir           | Auf Wiedersehen | До свидания     |
| thanks   | Thanks         | Merci               | Danke           | Спасибо         |
| &nbsp;   |                |                     |                 |                 |
| buttHair | Butt hair      | Cheveux bout à bout | Hintern Haare   | стыковые волосы |
| &nbsp;   |                |                     |                 |                 |

<details>
  <summary>View Source</summary>

  ```csv
  Key,"English, en-US","French, fr","German, de","Russian, ru"
  ,,,,
  hello,"Hello","Bonjour","Hallo",Привет
  goodbye,"Goodbye","Au revoir","Auf Wiedersehen",До свидания
  thanks,"Thanks","Merci","Danke",Спасибо
  ,,,,
  buttHair,"Butt hair","Cheveux bout à bout","Hintern Haare",стыковые волосы
  ,,,,
  ```
</details>

And this will generate equivalent empty lines in your generated language files:

```javascript
// Russian, ru
// This file was auto-generated by quasalang

export default {

  hello: "Привет",
  goodbye: "До свидания",
  thanks: "Спасибо",
  
  buttHair: "стыковые волосы",

}
```

## Use Comments to Organise your Phrases

You can add comments to your CSV file to create sections like this:

| Key            | English, en-US | French, fr          | German, de      | Russian, ru     |
|----------------|----------------|---------------------|-----------------|-----------------|
| &nbsp;         |                |                     |                 |                 |
| `# Greetings`    |                |                     |                 |                 |
| hello          | Hello          | Bonjour             | Hallo           | Привет          |
| goodbye        | Goodbye        | Au revoir           | Auf Wiedersehen | До свидания     |
| thanks         | Thanks         | Merci               | Danke           | Спасибо         |
| &nbsp;         |                |                     |                 |                 |
| `# Hair Related` |                |                     |                 |                 |
| buttHair       | Butt hair      | Cheveux bout à bout | Hintern Haare   | стыковые волосы |
| &nbsp;         |                |                     |                 |                 |

<details>
  <summary>View Source</summary>

  ```csv
  Key,"English, en-US","French, fr","German, de","Russian, ru"
  ,,,,
  # Greetings
  hello,"Hello","Bonjour","Hallo",Привет
  goodbye,"Goodbye","Au revoir","Auf Wiedersehen",До свидания
  thanks,"Thanks","Merci","Danke",Спасибо
  ,,,,
  # Hair Related
  buttHair,"Butt hair","Cheveux bout à bout","Hintern Haare",стыковые волосы
  ,,,,
  ```
</details>

And this will add equivalent comments to your generated files:

```javascript
// Russian, ru
// This file was auto-generated by quasalang

export default {

  // Greetings
  hello: "Привет",
  goodbye: "До свидания",
  thanks: "Спасибо",
  
  // Hair Related
  buttHair: "стыковые волосы",

}
```

## Use Strings as Your Keys

If you want to use strings as your keys, just surround your keys in double quotes:

| Key           | English, en-US | French, fr | German, de      |
|---------------|----------------|------------|-----------------|
| **"Hello"**   | Hello          | Bonjour    | Hallo           |
| **"Goodbye"** | Goodbye        | Au revoir  | Auf Wiedersehen |
| **"Thanks"**  | Thanks         | Merci      | Danke           |

<details>
  <summary>View Source</summary>

  ```csv
  Key,"English, en-US","French, fr","German, de"
  """Hello""","Hello","Bonjour","Hallo"
  """Goodbye""","Goodbye","Au revoir","Auf Wiedersehen"
  """Thanks""","Thanks","Merci","Danke"
  ```
</details>

This will generate language files like this:

```javascript
// French, fr
// This file was auto-generated by quasalang

export default {
  "Hello": "Bonjour",
  "Goodbye": "Au revoir",
  "Thanks": "Merci",
}
```

