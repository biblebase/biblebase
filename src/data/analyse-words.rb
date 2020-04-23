require 'json'
require 'yaml'
require 'parallel'
require_relative 'lib/consts'

# filter words by its PoS
# N-*: all the nouns, except(god 2316, lord 2962, jesus 2424, christ 5547,...)
# V-*: all the verbs except(be 1510, have 2192...)
# Heb/Aram
# !adv|conj|relpro|art|prep|ppro
# ?dpro|ipro|pronoun|ppro|recpro|refpro|i|prtcl|
# Adj-*: except(one 1520, same 846, many 4183, all 3956) 
# - OR -
# Any V,N,Adj that has less than 150 occurances, according to
# - N:water (5204) has 80
# - V:live (2198) has 141
# - A:truely (227) has 26
# comparing to
# - N:woman (1135) has 217
# - V:give (1325) has 416
# - A:great (3173) has 243
# And we can use the same rule for hebrew
CONNECT_BY_POS = %w[n v adj heb aram]
CONNECT_BY_OCCURANCE = 2..150
CONNECT_BY_COMMON_WORDS = 4..10

MAX_POLYSEMY_SAMPLES = 3

words_index = YAML.load(File.read('./verses_data/dict.yml'))

words_files = `find ./verses_data -name words.json`.split

Parallel.each(words_files, progress: 'Analysing') do |words_file|
# @NON_PARALLEL: words_files.each do |words_file|
  verse_key, words = JSON.parse(File.read(words_file)).to_a.first
  # chapter_key = verse_key.split('.')[0..1].join('.')
  analytics = words.uniq{|w| w["id"]}.each_with_object({}) do |w, analytics|
    eng = stem(w["eng"])
    next if eng.empty?

    id = w["id"]
    word_info = words_index[id]
    next unless word_info

    occurances = word_info[:translits].map{|_, tr| tr.values}.flatten.uniq

    # uniqueWords
    if word_info[:unique]
      analytics[:uniqueWords] ||= []
      analytics[:uniqueWords].push(w["eng"])
    end

    # rareWords
    if word_info[:rare]
      analytics[:rareWords] ||= {}
      analytics[:rareWords][w["eng"]] = occurances
    end

    # polysemies
    if word_info[:polysemies]
      analytics[:polysemies] ||= {}
      analytics[:polysemies][w["eng"]] = word_info[:translits].each_with_object({}) do |kv, h|
        _,tr = kv
        tr.each do |k, verse_keys|
          h[k] = ((h[k] || []) + verse_keys).uniq[0..MAX_POLYSEMY_SAMPLES]
        end
      end
    end

    # all other occurances
    next unless CONNECT_BY_POS.include? word_info[:pos]
    otherVerses = (occurances - [verse_key]).uniq
    next unless CONNECT_BY_OCCURANCE.include? otherVerses.size

    analytics[:commonWords] ||= {}
    analytics[:commonWords] = otherVerses.each_with_object(analytics[:commonWords]) do |vk, h|
      h[vk] ||= []
      h[vk].push w["eng"]
    end
  end

  # connections
  common_words = analytics.delete(:commonWords) || {}
  connections = common_words
    .select{|k,v| CONNECT_BY_COMMON_WORDS.include? v.uniq.size }
    .map{|k,v| [k, v.uniq]}.to_h
  analytics[:connections] = connections unless connections.empty?

  # save
  filename = words_file.sub(/words.json$/, 'analytics.json')
  output = Hash[*[verse_key, analytics]]
  File.open(filename, 'w'){|f| f << output.to_json}
end
