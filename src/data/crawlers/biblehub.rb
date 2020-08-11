require_relative 'base'

class BiblehubCrawler < Base
  BATCH_SIZE = 10
  START_PAGE = "https://biblehub.com/interlinear/genesis/1-1.htm"

  def fetch(url=nil)
    url ||= START_PAGE
    html = open(url)

    b, c, v = url.split(/[\/\-\.]/)[5,3]
    book_index = $BOOKS.dig($BOOK_LOOKUP[b], :index)
    file = "./#{HTML_CACHE_ROOT}/#{book_index}/#{c}/#{v}/#{klass_name}.htm"
    mv(html.path, file)

    doc = get_doc(html)
  end

  # We don't want to crawl in parallel to try to be a good citizen
  def fetch_all(from_url = nil)
    url = from_url || START_PAGE
    bar = ProgressBar.create(total: TOTAL_VERSES)
    loop do
      doc = fetch(url)
      href = doc.search('#right a').attr('href').value
      url = URI.join(START_PAGE, href).to_s
      bar.increment

      break if url == START_PAGE
    end
  end

  def parse_all()
    files = `find #{HTML_CACHE_ROOT} -name #{klass_name}.htm`.split
    Parallel.each(files, progress: 'Parsing') do |f|
      verse_key = path_to_key(f)
      output = Hash[*[verse_key, words: parse(f)]]

      # save
      _, bn, c, v, _ = f.split('/')
      save_json(output, bn, c, v)
    end
  end

  def section_name
    "words"
  end

  def parse(file)
    doc = get_doc(file)
    # e.g. [{
    #   id: 2596,
    #   translit: 'kata',
    #   lang: 'greek',
    #   greek|hebrew: 'kata',
    #   pos: 'Prep',
    #   eng: 'toward',
    #   punct: ';'
    # }]
    doc.search('.padleft table').map do |elem|
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
        pos: get_text(elem,'strongsnt2', 'strongsnt').gsub(/\[.+\]/, '').strip,
        punct: punct,
        eng: get_text(elem, 'eng')
      }.compact
    end.compact
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

if $0 == __FILE__
  c = BiblehubCrawler.new
  # c.fetch_all
  c.parse_all
end
