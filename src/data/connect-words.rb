# NOTE
# # magic function to connect:
# score = 14 / (occurence ^ 0.45)
# isRelated: occurences.map{|id, o| score(o)}.sum > THRESHOLD(5)
#
# # how the formula is figured out
# https://bit.ly/2WJPVKQ
#
# Output In analytics.json
# php.1.1:
#   analytics:
#     crossRefs: # 相關經文
#       # maxCount: 10, totalScoreThreshold: 5, or
#       # maxCount: 3, totalScoreThreshold: 3
#       - verseKey: php.2.12
#         totalScore: 8.2
#         anchors:
#           greek-3972: <score>
#       - verseKey:  mat.2.14
#         totalScore: 6.1
#         anchors:
#           greek-3972: <score>
#           greek-322: <score>
require 'json'
require 'yaml'
require 'parallel'
require_relative 'lib/consts'

THRESHOLDS = {
  high: {
    top: 5,
    max: 10
  },
  low: {
    top: 3,
    max: 3
  }
}

def thresholding(related_verses)
  top_score = (related_verses.first || {})[:totalScore] || 0
  if top_score >= THRESHOLDS.dig(:high, :top)
    related_verses.first(THRESHOLDS.dig(:high, :max)).select{|v| v[:totalScore] >= THRESHOLDS.dig(:high, :top)}
  elsif top_score >= THRESHOLDS.dig(:low, :top)
    related_verses.first(THRESHOLDS.dig(:low, :max)).select{|v| v[:totalScore] >= THRESHOLDS.dig(:low, :top)}
  else
    []
  end
end

def cross_refs(words_hash, this_verse_key)
  related_verses = words_hash.select { |id, w|
    w[:occurences]
  }.each_with_object({}) { |(id, w), h|
    next unless $STATS_BY_POS.include?(w[:pos])

    score = 14 / (w[:occurences] ** 0.45)
    vks = w[:translits].values.map(&:keys).flatten.map{|k| k.split('|').first}
    vks.each do |vk|
      next if vk == this_verse_key
      h[vk] ||= {
        totalScore: 0,
        anchors: {}
      }

      # NOTE duplications count
      # unless h[vk][:anchors][id]
        h[vk][:totalScore] += score
        h[vk][:anchors][id] = score
      # end
    end
  }.sort_by{|vk, obj| -obj[:totalScore]}
    .map{|vk, obj| obj.merge(verseKey: vk)}

  thresholding(related_verses)
end

# NOTE cross_refs
dict = YAML.load(File.read('./verses_data/dict.yml'))

# be, do, not
IGNORE_WORDS = %w[
  greek-1510
  greek-3756
  greek-3361
  hebrew-3808
]
WORDS_FILES = `find ./verses_data -name words.json`.split

Parallel.each(WORDS_FILES, progress: 'Cross Referencing') do |words_file|
# WORDS_FILES.each do |words_file|
  verse_key, obj = JSON.parse(File.read(words_file)).to_a.first
  word_ids = obj["words"].map{|w| w["id"]} - IGNORE_WORDS
  words_hash = dict.slice(*word_ids)
  analytics = { crossRefs: cross_refs(words_hash, verse_key) }

  filename = words_file.sub(/words.json$/, 'analytics.json')
  output = Hash[*[verse_key, analytics: analytics]]
  File.open(filename, 'w'){|f| f << output.to_json}
end
