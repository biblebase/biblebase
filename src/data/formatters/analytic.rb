require_relative 'base'
# Sample
# php.1.1:
#   analytics:
#     thisVerse:
#       dict:
#         greek-3778: This
#         greek-5426: let mind be
#     crossRefs: # 相關經文
#       # maxCount: 10, totalScoreThreshold: 5
#       - verseKey: php.2.12
#         totalScore: 8.2
#         anchors:
#           greek-3972: <score>
#         cunp: 這樣看來，我親愛的弟兄，你們既是常順服的
#         words:
#           id: greek-3778
#           eng: Not
#           punct: .
#       - verseKey:  mat.2.14
#         totalScore: 6.1
#         anchors:
#           greek-3972: <score>
#           greek-322: <score>
#         cunp: 約瑟就起來，夜間帶着小孩子和他母親往埃及去
#         words:
#           id: greek-3778
#           eng: Not
#           punct: .
class Analytic < Base
  NO_TRANSLATION = '<no translation>'
  def section_name
    "相關經文"
  end

  def format_all(items)
    return "" if items.empty?

    @h.h2 section_name
    @this_verse_dict = items.dig("thisVerse", "dict")

    items_wrapper do
      (items["crossRefs"] || []).each do |item|
        format(item)
      end
    end
  end

  def format(cross_ref)
    verse_key = cross_ref["verseKey"]
    anchors = cross_ref["anchors"]

    @h.tr do
      @h.td do
        verse_link(@h, verse_key, :short)
      end
      @h.td do
        @h.span(class: :mainVersion) do
          @h.text! cross_ref["cunp"]
        end
        @h.br
        @h.span(class: :interLinear) do
          cross_ref["words"].map do |w|
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

      words_hash = cross_ref["words"].each_with_object({}) do |w, h|
        h[w["id"]] = w["eng"] if anchors[w["id"]]
      end

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
                @h.text! @this_verse_dict[wordId] || NO_TRANSLATION
              end
            end
          end
        end
      end
    end
  end
  
  private

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
