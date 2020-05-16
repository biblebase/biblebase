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
  def section_name
    "逐詞翻譯"
  end

  # TODO button to toggle extended table
  def format(item)
    pos = get_main_pos(item["pos"])
    @h.table do
      @h.tr do
        @h.td do
          @h.span(class: :translit) do
            if item["id"]
              if pos
                @h.span(class: 'wordLink', href: "/words/#{item["id"]}.htm") do
                  @h.text! item["translit"]
                end
              else
                @h.text! item["translit"]
              end
            else
              @h.text! item["translit"]
            end
          end
          @h.br
          @h.span(class: ['original', item["lang"]].join(' ')) do
            @h.text! item[item["lang"]]
            @h.text! "#{$NBSP}#{item["punct"]}" if item["punct"]
          end
          @h.br
          @h.span(class: :eng) do
            @h.text! item["eng"]
          end

          # NOTE extended
          word_info = $DICT[item["id"]]
          @h.br(class: :extended)
          @h.span(class: 'pos extended') do
            @h.text! $PARTS_OF_SPEECH[pos.to_s.to_sym] || ''
          end
          @h.br(class: :extended)
          @h.span(class: 'occurences extended') do
            if word_info[:occurences]
              @h.text! "#{word_info[:occurences]}次"
            else
              @h.text! $NBSP
            end
          end
          @h.br(class: :extended)
          @h.span(class: 'meanings extended') do
            if word_info[:meaningsCount]
              @h.text! "#{word_info[:meaningsCount]}種"
            else
              @h.text! $NBSP
            end
          end
        end
      end
    end
  end

  private

  def items_wrapper
    @h.div(id: klass_name) do
      @h.table(class: 'header extended') do
        @h.tr do
          @h.td do
            @h.span(class: :translit) do
              @h.text! "發音"
            end
            @h.br
            @h.span(class: :original) do
              @h.text! "原文"
            end
            @h.br
            @h.span(class: :eng) do
              @h.text! "英文"
            end
            @h.br
            @h.span(class: :pos) do
              @h.text! "詞性"
            end
            @h.br
            @h.span(class: :occurences) do
              @h.text! "聖經中出現"
            end
            @h.br
            @h.span(class: :meanings) do
              @h.text! "上下文意思"
            end
          end
        end
      end
      yield
    end
  end
end
