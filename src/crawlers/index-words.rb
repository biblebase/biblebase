require 'json'
require 'yaml'
require_relative 'lib/consts'

RARE_WORD_THRESHOLD = 2..3
POLYSEMY_RANGE = 3..10

words_files = `find ./verses_data -name words.json`.split
bar = ProgressBar.new(words_files.count)

words_hash = words_files.each_with_object({}) do |words_file, h|
  verse_key, words = JSON.parse(File.read(words_file)).to_a.first
  words.each do |w|
    eng = stem(w["eng"])
    next if eng.empty?
    id = w["id"]
    translit = w["translit"]

    h[id] ||= {translits: {}}
    h[id][:translits][translit] ||= {}
    h[id][:translits][translit][eng] ||= []
    h[id][:translits][translit][eng].push verse_key
  end
  bar.increment!
end

words_hash.each do |id, v|
  translits = v[:translits]
  engs = translits.map{|_, tr| tr.keys}.flatten.uniq
  occurances = translits.map{|_, tr| tr.values}.flatten.uniq

  if occurances.size == 1
    words_hash[id][:unique] = true
  end

  if RARE_WORD_THRESHOLD.include? occurances.size
    words_hash[id][:rare] = true
  end

  if POLYSEMY_RANGE.include? engs.size
    words_hash[id][:polysemy] = true
  end
end

File.open("./words_data.yml", 'w') do |f|
  f << words_hash.to_yaml
end
