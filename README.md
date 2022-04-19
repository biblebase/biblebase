
# BibleBase v2

## Intro

* V1: https://biblebase.github.io/
* V2: https://biblebase.github.io/biblebase
* More modern UI with Book Navigator, Menu, and Responsive Layout.
* Removed interpretation section.

## Modules TOC

| Modules<br>(output) | Website crawler<br>(html) | Data extractor<br>(json) | Data analyzer<br>(json) | Formatter<br>(html) |
| --- | --- | --- | --- | --- |
| [Bible Read](#bible-read) | youversion ||| left pane |
| [Sermons](#sermons) | cbcwla.org | sermon/classes data || sermons section |
| [Other versions](#other-versions) | youversion | 3 eng 3 chn versions in verses || versions section |
| [Interlinear in English](#interlinear-in-english) | biblehub | words and eng-mapping in verses || interlinear section |
| [Interlinear in Chinese](#interlinear-in-chinese) | stepbible | chn-mapping in verses || interlinear section |
| [Dictionary](#dictionary) ||| word statistics | dict |
| [Cross References](#cross-references) ||| verses xref by word occurance | xref section |

    
## Moduels

### Bible Read

This module crawls youversion for [CUNP version](https://www.bible.com/bible/46/GEN.1.cunp), and put the result HTMLs on the left pane of the biblebase UI.

### Sermons

This module crawls cbcwla.org for sermons, and parses each sermon into a JSON-formatted data structure, with attributes of `title`, `preacher`, `date`, `verses`, `audio_link`, and `slides_link`. The verses are parsed into links to the exact books, chapters and/or verses.

### Other versions
### Interlinear in English
### Interlinear in Chinese
### Dictionary
### Cross References
