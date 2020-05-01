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
