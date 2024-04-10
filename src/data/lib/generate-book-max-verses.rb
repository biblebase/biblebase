# USAGE: from $ROOT/src/data
# $ ruby ./lib/generate-book-max-verses.rb > lib/book-max-verses.yml

x = (1..66).each_with_object({}) do |book, h|
  # NOTE take only folders, because some chapter level data is missing, e.g. 31/1.json
  h[book] = `ls -l json/#{book}/ | grep "^d"`.split("\n").each_with_object({}) do |line_chapter, hb|

    # NOTE "drwxwrw-rw- ... json/1/13 => 13
    chapter = line_chapter.split.last.split("/").last.to_i
    max_verse = `ls -l json/#{book}/#{chapter}/*.json`.split("\n").map do |line_verse|
      verse = line_verse.split.last.split("/").last.to_i

    # NOTE some verse.json is wrong, e.g. json/44/29/2222.json
    end.sort.select.with_index{|i, idx| i==idx+1}.last

    hb[chapter] = max_verse
  end
end

require 'yaml'
puts x.to_yaml
