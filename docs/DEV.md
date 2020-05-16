# BibleBase Development

## Interface

The json for each verse is in format defined in `docs/bible-references-sample.json`, it is the contract between different layers:
* Crawlers generates the file of this format,
* Backend (in the future) returns json in this format, and
* Frontend handles json in this format.

## Run Crawler

```bash
$ cd src/data
$ bundle install
$ ruby ./crawlers/base.rb
```

After running crawlers, the source html files are cached at `source_htmls` folder.

## Run Parsers, Formatters, and Deployment

And then run parsers and formatters by one consolidated script

```
$ ./start
```

After running this script, there are many folders of files being generated:

1. `verses_data` for all the pieces of verses data that saved in various json files
1. `json` for merged json files, one per verse or chapter (for chapter-level data)
1. `html` for formatted html files

The `start` script also deploy the results to s3,
