require 'json'
require 'yaml'
require_relative 'lib/consts'

COMMON_WORDS_TO_CONNECT = 4
MAX_POLYSEMY_SAMPLES = 3

words_index = YAML.load(File.read('./words_data.yml'))

words_files = `find ./verses_data -name words.json`.split
bar = ProgressBar.new(words_files.count)

words_files.each do |words_file|
  verse_key, words = JSON.parse(File.read(words_file)).to_a.first
  # chapter_key = verse_key.split('.')[0..1].join('.')
  analytics = words.each_with_object({}) do |w, analytics|
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
    if word_info[:polysemy]
      analytics[:polysemies] ||= {}
      analytics[:polysemies][w["eng"]] = word_info[:translits].each_with_object({}) do |kv, h|
        _,tr = kv
        tr.each do |k, verse_keys|
          h[k] = ((h[k] || []) + verse_keys)[0..MAX_POLYSEMY_SAMPLES]
        end
      end
    end

    # all other occurances
    analytics[:commonWords] ||= {}
    (occurances - [verse_key]).uniq.each do |vk|
      analytics[:commonWords][vk] ||= []
      analytics[:commonWords][vk].push w["eng"]
    end
#    occurances.map do |vk|
#      ck = vk.split('.')[0..1].join('.')
#      ck == chapter_key ? nil : ck
#    end.compact.uniq.each do |ck|
#      analytics[:commonWords][ck] ||= 0
#      analytics[:commonWords][ck] += 1
#    end
  end

  # connections
  common_words = analytics.delete(:commonWords)
  if common_words.nil?
    warn [verse_key, analytics]
  else
    connections = common_words.select{|k,v| v.uniq.size >= COMMON_WORDS_TO_CONNECT}
    analytics[:connections] = connections unless connections.empty?
  end

  # save
  filename = words_file.sub(/words.json$/, 'analytics.json')
  output = Hash[*[verse_key, analytics]]
  File.open(filename, 'w'){|f| f << output.to_json}

  bar.increment!
end
