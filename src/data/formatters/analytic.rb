require_relative 'base'
# Sample
# php.1.1:
#   analytics:
#     thisVerse:
#       dict:
#         eng:
#           greek-3778: This
#           greek-5426: let mind be
#         cht:
#           greek-3778: 這
#           greek-5426: 意志
#     translations:
#       hebrew-123: greek-5426
#     crossRefs: # 相關經文
#       # maxCount: 10, totalScoreThreshold: 5
#       - verseKey: php.2.12
#         totalScore: 8.2
#         anchors:
#           greek-3972: <score>
#         nasb: Testify I to everyone
#         words:
#           id: greek-3778
#           cht: 不是
#           punct_cht: ，
#       - verseKey:  mat.2.14
#         totalScore: 6.1
#         anchors:
#           greek-3972: <score>
#           greek-322: <score>
#         nasb: strike the earth with every plague
#         words:
#           id: greek-3778
#           cht: 不是
#           punct_cht: ，
class Analytic < Base
  NO_TRANSLATION = '<no translation>'

  def section_name
    "相關經文"
  end

  def description
    "根據相同的原文詞根串珠，並根據原詞的詞頻排序。"
  end

  def format_all(items)
    return "" if items.empty?
    @this_verse_dict = items.dig("thisVerse", "dict", "cht")
    @translations = items.dig("translations")

    cross_refs = items["crossRefs"] || []
    super(cross_refs)
  end

  def format(cross_ref, idx)
    verse_key = cross_ref["verseKey"]
    anchors = cross_ref["anchors"]

    @h.tr do
      @h.td do
        verse_link(@h, verse_key, :short)
      end
      @h.td do
        @h.span(class: :mainVersion) do
          cross_ref["words"].map do |w|
            if score = anchors[w["id"]]
              @h.b w["cht"]
            else
              @h.span w["cht"]
            end

            if w["punct_cht"]
              @h.span w["punct_cht"]
            end
          end.join
        end
        @h.br
        @h.span(class: :interLinear) do
          @h.text! cross_ref["nasb"]
        end
      end

      words_hash = cross_ref["words"].each_with_object({}) do |w, h|
        id = w["id"]
        h[id] = w["cht"] if anchors[id]
        h[@translations[id]] = w["cht"] if anchors[@translations[id]]
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

  def items_wrapper(items)
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
