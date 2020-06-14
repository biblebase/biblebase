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
    pos = Pos.new(item["pos"], item["lang"])
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
          @h.br(class: :extended)

          # NOTE extended
          word_info = $DICT[item["id"]]
          pos_display = pos.to_display
          pos, pos_ext, pos_conj = pos_display

          @h.span(class: 'pos extended') do
            @h.text! pos.to_s.empty? ? '-' : pos
          end
          @h.br(class: :extended)
          @h.span(class: 'pos ext extended') do
            @h.text! pos_ext.to_s.empty? ? '-' : pos_ext
          end
          @h.br(class: :extended)
          if item['lang'] == 'hebrew' then
            @h.span(class: 'pos conj extended') do
              @h.text! pos_conj.to_s.empty? ? '-' : pos_conj
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
