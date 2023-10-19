require_relative 'base'
require 'ruby-pinyin'

# Sample
# {
#   "gen.1.1": {
#     "versions": {
#       "ccb": {
#         "text": "太初，上帝创造了天地。",
#         "version_id": "CCB",
#         "version_name": "圣经当代译本",
#         "lang": "chs"
#       },
#       "nlt": {
#         "text": "In the beginning God created the heavens and the earth.",
#         "version_id": "NLT",
#         "version_name": "New Living Translation",
#         "lang": "en"
#       }
#     }
#   }
# }
class Version < Base
  def section_name
    "聖經版本"
  end

  def description
    "包括中英文常用版本，以及和合本的拼音注音。"
  end

  def format(item, idx)
    key, obj = item
    @h.tr do
      @h.td do
        @h.b obj["version_id"]
      end
      @h.td do
        if obj["version_id"] == 'CUNP'
          pinyin(obj['text'])
        else
          @h.text! obj["text"]
        end
      end
    end
  end

  private

  def pinyin_line(text)
    @h.div do
      @h.p PinYin.sentence(text, :unicode)
      @h.p text
    end
  end

  # This is an imperfect version, that
  # the pinyin and the chinese char isn't aligned
  def pinyin(text)
    w_o_punct = text.gsub(/[[:punct:]]/, " ")
    sentences = w_o_punct.split
    translated_parts = sentences.map{|s| PinYin.sentence(s, :unicode).split}
    punct_parts = w_o_punct.split(/\S+/).map{|x| x.split('')}
    words = punct_parts.zip(translated_parts).reject(&:nil?).reject(&:empty?).flatten

    @h.div do
      text.split('').each.with_index do |c, idx|
        @h.ruby do
          @h.text! c
          @h.rt do
            @h.text! words[idx].to_s
          end
        end
      end
    end
  end

  def items_wrapper(items)
    @h.table do
      yield(items)
    end
  end
end
