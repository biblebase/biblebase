require 'nokogiri'
require 'open-uri'
require 'pry'
require_relative 'consts'
require_relative 'crawler'

class BiblecomCrawler < Crawler
  def fetch(verse_key)
    book_abbr, chapter, verse = verse_key.split('.')
    book = $BOOKS[book_abbr.to_sym]

    versions = $VERSIONS.map do |_, v|
      url = "https://www.bible.com/bible/#{v[:bible_com_index]}/#{book_abbr}.#{chapter}.#{verse}"
      html = open(url)
      doc = Nokogiri::HTML(html)
      text = doc.search('a .lh-copy').text
      v.reject{|k,_| k == :bible_com_index}
        .merge(text: text)
        .merge(description: $LANGS[v[:lang].to_sym][:description_fn].call(book, chapter, verse))
        .merge(short: $LANGS[v[:lang].to_sym][:short_fn].call(book, chapter, verse))
    end
    Hash[*[verse_key, versions]]
  end

  def item_html(obj)
    """
    <h3>#{obj[:version_name]}</h3>
    <pre>#{obj[:short]} #{obj[:text]}</pre>
    """
  end
end
