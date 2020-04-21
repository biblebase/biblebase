require_relative 'consts'
require_relative 'crawler'

class Hash
  def compact
    self.each_with_object({}) do |kv, h|
      k,v = kv
      h[k] = v if v
    end
  end
end

class Array
  def compact_join
    if self.any?{|item| not item.nil? and item.size > 0}
      self.join
    else
      nil
    end
  end
end

class BiblehubCrawler < Crawler
  def fetch(verse_key)
    book_abbr, chapter, verse = verse_key.split('.')
    book = $BOOKS[book_abbr.to_sym]
    url = "https://biblehub.com/interlinear/#{book.dig(:full_name, :en).downcase}/#{chapter}-#{verse}.htm"
    doc = request(url)

    # e.g. [{
    #   id: 2596,
    #   translit: 'kata',
    #   lang: 'greek',
    #   greek|hebrew: 'kata',
    #   eng: 'toward',
    #   punct: ';'
    # }]
    words = doc.search('.padleft table').map do |elem|
      id = get_text(elem, 'strongs', 'pos').to_i
      next if id == 0
      {
        id: id,
        translit: get_text(elem, 'translit'),
        lang: elem.search('.hebrew').size > 0 ? 'hebrew' : 'greek',
        hebrew: get_text(elem, 'hebrew'),
        greek: get_text(elem,'greek'),
        punct: get_text(elem, 'punct', 'punct2', 'punct3'),
        eng: get_text(elem, 'eng')
      }.compact
    end.compact

    Hash[*[verse_key, words]]
  end

  private

  def get_text(elem, *class_names)
    text = class_names.map{|k| elem.search('.' + k).text}.compact_join
    return text.gsub(/[\s\u00A0\u3000]/, '').strip if text
  end
end

c = BiblehubCrawler.new
require 'yaml'
puts c.fetch('php.2.1').to_yaml
