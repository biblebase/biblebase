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
    @h.div do
      @h.h3 "多義詞（有四種以上翻譯）"

      obj.each do |word, occurances|
        @h.div do
          @h.h5 word
          @h.ul do
            occurances.each do |eng, verses|
              @h.li do
                @h.b eng
                @h.span " - "
                verses.each.with_index do |verse, idx|
                  @h.a(href: verse_url(verse)) { @h.text! verse_desc(verse) }
                  @h.text! ' | ' unless idx == verses.size - 1
                end
              end
            end
          end
        end
      end
    end
  end

  def format_unique_words(obj)
    @h.div do
      @h.h3 "只出現過一次的詞"
      obj.each do |word|
        @h.text! word
      end
    end
  end

  def format_rare_words(obj)
    @h.div do
      @h.h3 "生僻詞（另外出現過兩三次）"
      @h.ul do
        obj.each do |word, verses|
          @h.li do
            @h.b word
            @h.span " - "
            verses.each.with_index do |verse, idx|
              @h.a(href: verse_url(verse)) { @h.text! verse_desc(verse) }
              @h.text! ' | ' unless idx == verses.size - 1
            end
          end
        end
      end
    end
  end

  def format_connections(obj)
    @h.div do
      @h.h3 "串珠（相同的詞根在另一經節出現過四次以上）"
      @h.ul do
        obj.each do |verse, words|
          @h.li do
            @h.b do
              @h.a(href: verse_url(verse)) { @h.text! verse_desc(verse) }
            end
            @h.span " - "
            words.each.with_index do |word, idx|
              @h.span word
              @h.text! ' | ' unless idx == words.size - 1
            end
          end
        end
      end
    end
  end
end

if __FILE__ == $0
  section_key = 'analytics'
  obj = JSON.parse File.open("verses_data/1/1/1/#{section_key}.json").read

  puts Analytic.new.format_all(obj.values.first[section_key])
end
