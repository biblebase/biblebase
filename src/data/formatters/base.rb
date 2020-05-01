require_relative '../lib/consts'
require_relative '../lib/verse_bundle'
require 'builder'
require 'json'

class Base
  def initialize(verse_key)
    @verse_key = verse_key
    @h = Builder::XmlMarkup.new(indent: 2)
  end

  def section_name
    raise "implement it"
  end

  def klass_name
    self.class.name.snake_case
  end

  def format(item)
    raise "implement it"
  end

  def format_all(items)
    return "" if items.empty?

    @h.div(id: klass_name) do
      @h.h2 section_name
      items.each do |item|
        format(item)
      end
    end
  end

  private

  def verse_url(verse_key)
    bk,c,v = verse_key.split('.')
    b = $BOOKS.dig(bk.downcase.to_sym, :index)
    "/#{[b,c,v].join('/')}.htm"
  end

  def verse_desc(verse_key)
    VerseBundle.new(verse_key).to_s
  end
end

if __FILE__ == $0
  source = "verses_data/40/1/"
  v = "20"
  folder = "#{source}/#{v}" # for loop
  ordered_sections = %w[versions words analytics sermons interpretations]
  html = ordered_sections.map do |sec|
    f = "#{folder}/#{sec}.json"
    next unless File.exists?(f)

    obj = JSON.parse File.open(f).read
    items = obj.values.first[sec]

    klass_name = sec[0..-2]
    require_relative klass_name
    klass = Object.const_get(klass_name.capitalize)
    formatter = klass.new(obj.keys.first)
    formatter.format_all(items)
  end.compact.join

  target = source.sub('verses_data', 'html')
  `mkdir -p #{target}`
  filename = "#{target}/#{v}.htm"
  File.open(filename, 'w') do |f|
    f << """
      <style>
        h2 {
          clear: both;
          padding: 10px;
          border-radius: 2px;
          background-color: #444;
          color: #eee
        }
        .date {
          color: grey;
          font-size: 60%;
        }
        author {
          color: grey;
        }
        .block {
          word-break: keep-all;
          border-radius: 4px;
          background-color: #ddd;
          padding: 10px;
          margin-bottom: 6px;
        }
        .include {
          background-color: #ccc;
        }
        .exact {
          background-color: #eee;
        }
        #word table {
          float: left;
          margin: 0px 8px 16px;
        }
        #word span {
          margin: 4px 0px;
        }
        #word .translit {
          font-style: italic;
        }
        #word .original {
          font-weight: 200;
          font-size: 140%;
        }
      </style>
    """
    f << html
  end
  `open #{filename}`
end
