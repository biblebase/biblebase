require_relative 'base'
# Sample
# {
#   "gen.1.1": {
#     "words": [
#       {
#         "id": "hebrew-7225",
#         "translit": "bə·rê·šîṯ",
#         "lang": "hebrew",
#         "hebrew": "בְּרֵאשִׁ֖ית",
#         "pos": "Prep‑b | N‑fs",
#         "eng": "In the beginning"
#       },
#       {
#         "id": "hebrew-776",
#         "translit": "hā·’ā·reṣ.",
#         "lang": "hebrew",
#         "hebrew": "הָאָֽרֶץ׃",
#         "pos": "Art | N‑fs",
#         "punct": ".",
#         "eng": "the earth"
#       }
#     ]
#   }
# }
class Word < Base
  NBSP = "\u00A0"
  def section_name
    "逐詞翻譯"
  end

  def format(item)
    @h.table do
      @h.tr do
        @h.td do
          @h.span(class: :translit) do
            if item["id"]
              @h.span(class: 'wordLink', href: "/words/#{item["id"]}.htm") do
                @h.text! item["translit"]
              end
            else
              @h.text! item["translit"]
            end
          end
          @h.br
          @h.span(class: ['original', item["lang"]].join(' ')) do
            @h.text! item[item["lang"]]
            @h.text! "#{NBSP}#{item["punct"]}" if item["punct"]
          end
          @h.br
          @h.span(class: :eng) do
            @h.text! item["eng"]
          end
        end
      end
    end
  end
end
