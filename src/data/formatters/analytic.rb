require_relative 'base'
# Sample
# {
#   "gen.1.1": {
#     "analytics": {
#       "polysemies": {
#         "the heavens": {
#           "heaven": [
#             "jon.1.9",
#             "job.41.11"
#           ],
#           "air": [
#             "hos.7.12"
#           ],
#           "sky": [
#             "gen.26.4"
#           ],
#           "astrolog": [
#             "isa.47.13"
#           ]
#         }
#       },
#       "uniqueWords": ["the tendon"],
#       "rareWords": {
#         "and some distance": [
#           "est.4.14",
#           "gen.32.16"
#         ]
#       },
#       "connections": {
#         "jud.1.25": [
#           "Savior",
#           "glory",
#           "of eternity",
#           "Amen"
#         ]
#       }
#     }
#   }
# }
class Analytic < Base
  def section_name
    "詞頻分析"
  end

  def format(item)
    key, obj = item
    send("format_#{key.snake_case}", obj) unless obj.empty?
  end

  def format_polysemies(obj)
    _ = new_html
    _.div do
      _.h3 "多義詞"

      obj.each do |word, occurances|
        _.div do
          _.h4 word
          _.ul do
            occurances.each do |eng, verses|
              _.li do
                _.b eng
                _.span " - "
                verses.each.with_index do |verse, idx|
                  _.a(href: verse_url(verse)) { _.text! verse_desc(verse) }
                  _.text! ' | ' unless idx == verses.size - 1
                end
              end
            end
          end
        end
      end
    end
  end

  def format_unique_words(obj)
  end

  def format_rare_words(obj)
  end

  def format_connections(obj)
  end
end

if __FILE__ == $0
  section_key = 'analytics'
  obj = JSON.parse File.open("verses_data/1/1/1/#{section_key}.json").read

  puts Analytic.new.format_all(obj.values.first[section_key])
end
