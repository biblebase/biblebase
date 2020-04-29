require_relative 'base'
require_relative 'godcom_parsers'
require_relative '../lib/verse_bundle'

class GodcomCrawler < Base
  URL_PREFIX = "http://www.godcom.net/chajing"

  def fetch(url, key, book_index, ch)
    html = open(url)
    path = "./#{HTML_CACHE_ROOT}/#{book_index}/#{ch}"
    `mkdir -p #{path}`
    file = "#{path}/#{klass_name}-#{key}.htm"
    begin
      File.open(file, 'w'){|f| f << html.read}
    rescue StandardError => e
      warn "no such chapter: #{url}"
    end
  end

  def fetch_all
    bar = ProgressBar.create(total: TOTAL_CHAPTERS * FETCH_RULES.size)
    $BOOKS.each do |book_key, book_info|
      book_index = book_info[:index]

      book_index_str = '%02d' % book_index
      testament = "#{book_info[:testament]}%20Testament"
      abbr = book_info.dig(:short_name, :en);
      abbr = "%20" + abbr if abbr.to_i > 0
      url_prefix = "#{URL_PREFIX}/#{testament}/#{book_index_str}#{abbr}"
      FETCH_RULES.each do |key, fn|
        chapter = 1

        loop do 
          fmt = (book_key == :psa) ? '%03d' : '%02d'
          url = url_prefix + fn.call(book_index_str, fmt % chapter)
          begin
            fetch(url, key, book_index, chapter)
            bar.increment
            chapter += 1
          rescue OpenURI::HTTPError => e
            warn url unless key == :chenzhongdao
            break
          end
        end
      end
    end
  end

  def section_name
    'interpretations'
  end

  def parse(file)
    doc = get_doc(file, 'GB18030')
    ps = cleaned_paragraphs(doc)

    bn,c,_,parser = file.split(/[\.\-\/]/)[-5,4]
    book_key = $BOOK_LOOKUP["index_#{bn}"]

    parser = parser.to_sym
    parse_rules = PARSERS[parser]

    current_key = nil
    verse_bundles = ps.each_with_object({}) do |p, ret|
      matched_key = parse_rules.map do |rule|
        if matched = p.match(rule[:pattern])
          rule[:key_fn].call(book_key, c, matched)
        end
      end.compact.first

      if matched_key
        current_key = matched_key
        ret[current_key] = [p]
      elsif current_key
        ret[current_key].push p
      end
    end

    init_verse_object = Hash[*[parser, {
      content: []
    }.merge(METADATA[parser])]]
    verse_bundles.each_with_object({}) do |kv, ret|
      verse_bundle, ps = kv
      next if verse_bundle == CLEAR_KEY
      VerseBundle.new(verse_bundle).to_a.each do |verse_key|
        ret[verse_key] ||= init_verse_object.deep_dup

        ret[verse_key][parser][:content].push({
          # to chop the addendum part of e.g. 2pe.1.1.19978
          verse: verse_bundle.split('.')[0,3].join('.'),
          paragraphs: ps
        })
      end
    end
  end

  def parse_all
    folders = `find #{HTML_CACHE_ROOT} -type d -mindepth 2`.split
    Parallel.each(folders, progress: 'Parsing') do |d|
      _,bn,c = d.split('/')
      files = `ls #{d}/#{klass_name}-*.htm 2>/dev/null`.split
      chapter_object = files.each_with_object({}) do |f, ret|
        parsed = parse(f)
        ret.deep_merge!(parsed)
      end

      chapter_object.each do |verse_key, obj|
        _,_,v = verse_key.split('.')
        save_json(obj, bn, c, v)
      end
    end
  end

  private

  def cleaned_paragraphs(doc)
    return doc.search('p').map do |p| 
      pt = p.text.gsub(/[\s\u00A0\u3000\uE013]/, '')
      pt.empty? ? nil : pt
    end.compact
  end
end

if $0 == __FILE__
  c = GodcomCrawler.new
  # c.fetch_all
  c.parse_all
end
