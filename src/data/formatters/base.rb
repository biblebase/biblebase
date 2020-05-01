require_relative '../lib/consts'
require_relative '../lib/verse_bundle'
require 'builder'
require 'json'

class Base
  def new_html
    Builder::XmlMarkup.new(indent: 2)
  end

  def section_name
    raise "implement it"
  end

  def format(item)
    raise "implement it"
  end

  def format_all(items)
    return "" if items.empty?

    """
    <h2>#{section_name}</h2>#{
      items.map do |item|
        format(item)
      end.join("\n")
    }
    """
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
  source = "verses_data/1/1/"
  folder = "#{source}/1" # for loop
  html = `ls #{folder}/*.json`.split.map do |f|
    section_key = f.split(/[\/\.]/)[-2]
    obj = JSON.parse File.open(f).read
    items = obj.values.first[section_key]

    klass_name = section_key[0..-2]
    require_relative klass_name
    klass = Object.const_get(klass_name.capitalize)
    formatter = klass.new
    binding.pry
    formatter.format_all(items)
  end.join("\n")

  target = source.sub('verses_data', 'html')
  `mkdir -p #{target}`
  File.open("#{target}/1.htm", 'w'){|f| f << html}
  `open #{target}/1.htm`
end
