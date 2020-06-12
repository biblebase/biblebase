require 'json'
require 'yaml'
require 'parallel'
require 'builder'
require_relative 'lib/consts'
require_relative 'lib/pos'
require_relative 'lib/verse_bundle'

# NOTE utils functions
def text(word_info)
  return unless word_info
  [word_info["eng"], word_info["punct"]].compact.join
end

WORDS_FILES = `find ./verses_data -name words.json`.split

# NOTE index words, output as (in YAML):
# hebrew-123:
#   pos: n
#   candidates:
#     that:
#       - php.2.1|3
#       - gen.1.1|2
#     is:
#       - php.2.1|3
#   translits:
#     hoti:
#       php.2.1|3:
#         - thing,
#         - that
#         - is
def get_words_hash
  bar = ProgressBar.create(title: 'Indexing', total: WORDS_FILES.count)
  WORDS_FILES.each_with_object({}) do |words_file, h|
    verse_key, obj = JSON.parse(File.read(words_file)).to_a.first
    words = obj["words"]
    words.each.with_index do |w, idx|
      ext_verse_key = [verse_key, idx].join('|')
      id = w["id"]
      translit = w["translit"].sub($TRAILING_PUNC, '')

      parts = stemmed_parts(w["eng"])
      pos = Pos.new(w["pos"], w["lang"])
      h[id] ||= {
        pos: pos.main,
        candidates: {},
        translits: {}
      }

      next unless $STATS_BY_POS.include?(pos.main)

      parts.each do |candidate|
        h[id][:candidates][candidate] ||= []
        h[id][:candidates][candidate].push(ext_verse_key)
      end

      h[id][:translits][translit] ||= {}
      h[id][:translits][translit][ext_verse_key] = [
        idx == 0 ? nil : text(words[idx-1]),
        text(w),
        text(words[idx+1])
      ]
    end
    bar.increment
  end
end

MAX_SAMPLES = 10

# NOTE detect english roots, output as (in YAML):
# hebrew-123:
#   pos: n
#   meaningsCount: 3
#   occurences: 2
#   meanings:
#     that: # max 10
#       - php.2.1|3
#       - gen.1.1|2
#   translits:
#     hoti: # max 10
#       php.2.1|3:
#         - thing,
#         - that
#         - is
def stats_meanings(words_hash)
  bar = ProgressBar.create(title: 'Meaning', total: words_hash.count)
  words_hash.each do |id, v|
    candidates = v.delete(:candidates)
    if candidates.size > 0
      all_verse_keys = candidates.values.flatten.uniq
      sorted_candidates = candidates.sort_by{ |_,v| -v.size }
      v[:meanings] = sorted_candidates.each_with_object({}) do |kv,h|
        candidate, verse_keys = kv
        vks = verse_keys & all_verse_keys
        h[candidate] = vks.size if vks.size > 0
        all_verse_keys = all_verse_keys - vks
      end
      v[:meaningsCount] = v[:meanings].size
    end

    if v[:translits].size > 0
      v[:occurences] = v[:translits].values.map(&:keys).flatten.size
    end
    bar.increment
  end

  return words_hash
end

# TODO connect words in 2 languages by top meaning and top occurences
def meanings_mapping(words_hash)
  # god:
  #   hebrew-430: 1234
  #   greek-123: 123
  #   hebrew-123: 2
  words_hash.each_with_object({}) do |(id, v), h|
    next unless v[:meanings]

    top_meaning, occurences = v[:meanings].first
    h[top_meaning] ||= {}
    h[top_meaning][id] = occurences

  # filter out items can't be matched
  end.select do |k, v|
    v.size > 1 and v.keys.map{|k| k.to_s.split('-').first}.uniq.size > 1

  # {
  #   hebrew-430: :greek-123,
  #   greek-123:  :hebrew-430
  # }
  end.each_with_object({}) do |(eng, words), h|
    lang1_word, lang2_word = words
      .group_by{|k,v| k.to_s.split('-').first}
      .values.map{|p| p.sort_by{|word, occ| occ}.last[0]}

    h[lang1_word] = lang2_word
    h[lang2_word] = lang1_word
  end
end

# NOTE save in json and htmls
def save_json_and_html(words_hash)
  # add translation
  translations = meanings_mapping(words_hash)
  words_hash.each do |id, v|
    if t = translations[id]
      v[:translation] = t
    end
  end

  # one dict yaml file
  File.open("./verses_data/dict.yml", 'w') do |f|
    f << words_hash.to_yaml
  end

  # break into files
  `mkdir -p ./json/words`
  `mkdir -p words`
  Parallel.each(words_hash, progress: 'Saving Words') do |id, v|
    # saving json
    File.open("./json/words/#{id}.json", 'w') do |f|
      f << v.to_json
    end

    # saving html
    html = Builder::XmlMarkup.new

    if v[:pos]
      html.h3 "詞性"
      html.p Pos.display_pos(v[:pos])
    else
      warn v.inspect
    end

    if tid = v[:translation]
      html.h3 id.split('-').first == 'hebrew' ? '希臘文對應詞彙' : '希伯來文對應詞彙'
      html.span(class: :wordLink, href: "/words/#{tid}.htm") do
        html.text! words_hash.dig(tid, :translits).keys.first
      end
    end

    if v[:occurences]
      html.h3 "聖經中出現次數"
      html.p "共#{v[:occurences]}次"
    else
      html.i "對於聖經中的名詞、動詞、形容詞、副詞，BibleBase會有詳細信息。"
    end

    if v[:meanings]
      html.h3 "上下文意思"
      html.p "共#{v[:meaningsCount]}種"
      html.table do
        v[:meanings].first(MAX_SAMPLES).each do |meaning, c|
          html.tr do
            html.td do
              html.b meaning
            end
            html.td "#{c}次"
          end
        end
        if v[:meanings].size > MAX_SAMPLES
          html.tr do
            html.td(colspan: 2, align: 'center') do
              html.i "<and more>"
            end
          end
        end
      end
    end

    if v[:translits].size > 0
      html.h3 "原文上下文舉例"
      v[:translits].each do |word, occurences|
        html.h4 word
        html.table do
          sampled_occurences = occurences.to_a
            .shuffle
            .first(MAX_SAMPLES)
            .sort_by do |ext_verse_key, _|
              verse_path(ext_verse_key.split('|').first)
            end
          sampled_occurences.each do |ext_verse_key, words|
            verse_key, idx = ext_verse_key.split('|')
            html.tr do
              html.td do
                verse_link(html, verse_key, :short)
              end
              html.td do
                html.i do
                  if idx.to_i > 1
                    html.span '...'
                  end
                  html.span words[0]
                  html.span " "
                  html.b words[1]
                  html.span " "
                  html.span words[2]
                  if words[2] and !words[2].match(/[\.\?\!]$/)
                    html.span '...'
                  end
                end
              end
            end
          end
          if occurences.size > MAX_SAMPLES
            html.tr do
              html.td(colspan: 2, align: 'center') do
                html.i "<and more>"
              end
            end
          end
        end
      end
    end
    File.open("words/#{id}.htm", 'w'){ |f| f << html}
  end
end

words_hash = get_words_hash()
words_hash = stats_meanings(words_hash)
save_json_and_html(words_hash)
