# BibleBase Development

## Interface

The json for each verse is in format defined in `docs/bible-references-sample.json`, it is the contract between different layers:
* Crawlers generates the file of this format,
* Backend (in the future) returns json in this format, and
* Frontend handles json in this format.

## Run Crawler

```bash
$ cd src/crawlers
$ bundle install
$ ./start
```

And run chapter by chapter according to the help text from `./start`

## Deployment

### Prerequisite

1. Access to s3 bucket `biblebase`
1. Files generated by the crawlers

### Steps

1. aws cp
   ```bash
   $ cd HOME/src/crawlers
   $ aws cp --recursive json/ s3://biblebase/verse_data/
   ```
1. publish them all
   1. go to s3 console on AWS
   1. select folder `s3://biblebase/verse_data`
   1. Actions Menu -> make public