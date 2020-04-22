require_relative '../lib/consts'
require_relative 'base'

class BiblehubCrawler < Base
  def fetch(verse_key)
    book_abbr, chapter, verse = verse_key.split('.')
    book = $BOOKS[book_abbr.to_sym]
    book_part = book.dig(:full_name, :en).downcase.gsub(' ', '_')
    url = "https://biblehub.com/interlinear/#{book_part}/#{chapter}-#{verse}.htm"
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
      lang = elem.search('.hebrew').size > 0 ? 'hebrew' : 'greek'
      punct = get_text(elem, 'punct', 'punct2', 'punct3')
      next if id == 0
      {
        id: "#{lang}-#{id}",
        translit: get_text(elem, 'translit'),
        lang: lang,
        hebrew: get_text(elem, 'hebrew'),
        greek: get_text(elem,'greek'),
        punct: punct,
        eng: get_text(elem, 'eng')
      }.compact
    end.compact

    Hash[*[verse_key, words]]
  end

  private

  def get_text(elem, *class_names)
    text = class_names.map do |k|
      el = elem.search('.' + k)
      el.shift if el.count > 1 and k == 'hebrew'
      el.text
    end.compact_join
    return text.gsub(/[\s\u00A0\u3000]+/, ' ').strip if text
  end
end
