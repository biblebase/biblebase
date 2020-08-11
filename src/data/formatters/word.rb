require_relative 'base'
require_relative '../lib/pos'

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
#         "eng": "In the beginning",
#         "cht": "起初",
#         "index_cht": 0
#       },
#       {
#         "id": "hebrew-776",
#         "translit": "hā·’ā·reṣ.",
#         "lang": "hebrew",
#         "hebrew": "הָאָֽרֶץ׃",
#         "pos": "Art | N‑fs",
#         "punct": ".",
#         "eng": "the earth"
#         "cht": "地",
#         "punct_cht": "。",
#         "index_cht": 4
#       }
#     ]
#   }
# }

class Word < Base
  CHAR_PLACEHOLDER = '～'

  def section_name
    "逐詞翻譯"
  end

  def description
    "根據聖經原文（舊約希伯來文，新約希臘文）逐詞的翻譯，英文靠近NASB版本，中文靠近和合本。"
  end

  def format_all(items)
    @cht_indexes = {}
    super(items)
  end

  def format(item, idx)
    @h.table(class: :word) do
      @h.tr do
        @h.td do
          @h.span(class: :translit) do
            if item["id"].empty?
              text(@h, item["translit"])
            else
              @h.span(class: 'wordLink', href: "/words/#{item["id"]}.htm") do
                text(@h, item["translit"])
              end
            end
          end
          @h.br
          @h.span(class: ['original', item["lang"]].join(' '), index: idx) do
            text(@h, item[item["lang"]])
            @h.text! "#{$NBSP}#{item["punct"]}" if item["punct"]
          end
          @h.br
          @h.span(class: :eng) do
            text(@h, item["eng"])
          end
          @h.br
          @h.span(class: :cht, index: item["index_cht"]) do
            if item["index_cht"] and @cht_indexes[item["index_cht"].to_s]
              @h.text! CHAR_PLACEHOLDER
            else
              text(@h, item["cht"], CHAR_PLACEHOLDER)
              @cht_indexes[item["index_cht"].to_s] = true
              if item["punct_cht"]
                @h.span(class: :punctCht) do
                  @h.text! "#{$NBSP}#{item["punct_cht"]}"
                end
              end
            end
          end
          @h.br(class: :extended)

          # NOTE extended
          word_info = $DICT[item["id"]] || {}
          pos, pos_ext, pos_conj = Pos.new(item["pos"], item["lang"]).to_display

          @h.span(class: 'pos extended') do
            text(@h, pos)
          end
          @h.br(class: :extended)
          @h.span(class: 'pos ext extended') do
            text(@h, pos_ext)
          end
          @h.br(class: :extended)
          if item['lang'] == 'hebrew' then
            @h.span(class: 'pos conj extended') do
              text(@h, pos_conj)
            end
            @h.br(class: :extended)
          end

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

  def text(h, str, placeholder='-')
    h.text! str.to_s.empty? ? placeholder: str
  end

  def section_class(items)
    first_item = items.first
    first_item.is_a?(Hash) ? first_item["lang"] : ''
  end

  def items_wrapper(items)
    super(items) do
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
            @h.span(class: :cht) do
              @h.text! "中文"
            end
            @h.br
            @h.span(class: :pos) do
              @h.text! "主要詞性"
            end
            @h.br
            @h.span(class: 'pos ext') do
              @h.text! "單詞變化"
            end
            @h.br
            @h.span(class: 'pos conj') do
              @h.text! "附属詞"
            end
            @h.br(class: 'pos conj')
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

if __FILE__ == $0
  section_key = 'words'
  obj = JSON.parse File.read("verses_data/51/1/1/#{section_key}.json")

  puts Word.new('gen.1.1').format_all(obj.values.first[section_key])
end
