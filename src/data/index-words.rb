require 'json'
require 'yaml'
require_relative 'lib/consts'

RARE_WORD_BY_POS = %w[n v adj adv i heb aram]
RARE_WORD_BY_OCCURANCE = 2..3
POLYSEMY_BY_POS = %w[n v adj]
POLYSEMY_BY_ENGS = 3..10

words_files = `find ./verses_data -name words.json`.split

bar = ProgressBar.create(total: words_files.count)
words_hash = words_files.each_with_object({}) do |words_file, h|
  verse_key, obj = JSON.parse(File.read(words_file)).to_a.first
  words = obj["words"]
  words.each do |w|
    pos = get_main_pos(w["pos"])
    eng = stem(w["eng"], pos)
    next if eng.empty?
    id = w["id"]
    translit = w["translit"]

    h[id] ||= {
      pos: pos,
      translits: {}
    }
    h[id][:translits][translit] ||= {}
    h[id][:translits][translit][eng] ||= []
    h[id][:translits][translit][eng].push verse_key
  end
  bar.increment
end

words_hash.each do |id, v|
  translits = v[:translits]
  engs = translits.map{|_, tr| tr.keys}.flatten.uniq
  occurances = translits.map{|_, tr| tr.values}.flatten.uniq

  if occurances.size == 1
    words_hash[id][:unique] = true
  end

  if RARE_WORD_BY_POS.include?(v[:pos]) and RARE_WORD_BY_OCCURANCE.include?(occurances.size)
    words_hash[id][:rare] = true
  end

  if POLYSEMY_BY_POS.include?(v[:pos]) and POLYSEMY_BY_ENGS.include?(engs.size)
    words_hash[id][:polysemies] = engs
  end
end

File.open("./verses_data/dict.yml", 'w') do |f|
  f << words_hash.to_yaml
end
