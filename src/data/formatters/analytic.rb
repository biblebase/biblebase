require_relative 'base'
# Sample
# php.1.1:
#   analytics:
#     crossRefs: # 相關經文
#       # maxCount: 10, totalScoreThreshold: 5
#       - verseKey: php.2.12
#         totalScore: 8.2
#         anchors:
#           greek-3972: <score>
#       - verseKey:  mat.2.14
#         totalScore: 6.1
#         anchors:
#           greek-3972: <score>
#           greek-322: <score>
class Analytic < Base
  NO_TRANSLATION = '<no translation>'
  def section_name
    "相關經文"
  end

  def format(item)
    _, cross_refs = item
    return if cross_refs.empty?

    cross_refs.each do |cross_ref|
      verse_key = cross_ref["verseKey"]
      anchors = cross_ref["anchors"]

      words = get_verse_data(verse_key, :words) || []
      versions = get_verse_data(verse_key, :versions) || {}
      @h.tr do
        @h.td do
          verse_link(@h, verse_key, :short)
        end
        @h.td do
          @h.span(class: :mainVersion) do
            @h.text! versions.dig("cunp", "text") || ''
          end
          @h.br
          @h.span(class: :interLinear) do
            words.map do |w|
              if score = anchors[w["id"]]
                @h.b w["eng"]
              else
                @h.span w["eng"]
              end

              if w["punct"]
                @h.span w["punct"] + $NBSP
              else
                @h.span $NBSP
              end
            end.join
          end
        end

        # TODO words mapping
        source_verse_words = get_verse_data(@verse_key, :words) || []
        words_hash = words_in_eng(words, anchors)
        source_words_hash = words_in_eng(source_verse_words, anchors)
        @h.td(class: :wordsMapping) do
          @h.ol do
            anchors.keys.each do |wordId|
              @h.li do
                @h.span(class: :word) do
                  @h.text! words_hash[wordId] || NO_TRANSLATION
                end
                @h.span(class: :link) do
                  @h.text! "↔"
                end
                @h.span(class: :word) do
                  @h.text! source_words_hash[wordId] || NO_TRANSLATION
                end
              end
            end
          end
        end
      end
    end
  end
  
  private

  def words_in_eng(words, anchors)
    words.each_with_object({}) do |w, h|
      h[w["id"]] = w["eng"] if anchors[w["id"]]
    end
  end

  def get_verse_data(verse_key, section)
    begin
      file = "verses_data/#{verse_path(verse_key)}/#{section}.json"
      json = JSON.parse(File.read(file))
      json.dig(verse_key, section.to_s)
    rescue StandardError => e
      nil
    end
  end

  def items_wrapper
    @h.table(id: klass_name) do
      yield
    end
  end

end

if __FILE__ == $0
  section_key = 'analytics'
  obj = JSON.parse File.read("verses_data/1/1/1/#{section_key}.json")

  puts Analytic.new('gen.1.1').format_all(obj.values.first[section_key])
end
