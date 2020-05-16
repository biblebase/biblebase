require_relative '../lib/consts'
require_relative 'base'

class BiblecomCrawler < Base
  BASE_URL = 'https://www.bible.com'
  VERSION_NUMS = {
    NLT: 116, NIV: 111, NASB: 100,
    CNV: 40, CUNP: 46, CCB: 36
  }
  VERSION_METADATA = $VERSIONS.each_with_object({}) do |kv, h|
    version, info = kv
    h[version] = info.reject{|k,_| k==:bible_com_index}
  end

  def parse(file)
    doc = get_doc(file, "UTF-8")
    bn,c,_,version = file.split(/[\.\-\/]/)[-5,4]

    doc.search('.verse').group_by do |el|
      el.attr('data-usfm').downcase
    end.each_with_object({}) do |kv, h|
      verse_key, elements = kv
      text = elements.map do |el|
        content = el.search('.content').text.strip
        content.empty? ? nil : content
      end.compact.join(' ')

      h[verse_key] ||= {}
      h[verse_key][version] = VERSION_METADATA[version.to_sym].merge(text: text)
    end
  end

  def parse_all
    folders = `find #{HTML_CACHE_ROOT} -type d -mindepth 2`.split
    Parallel.each(folders, progress: 'Parsing') do |d|
    # folders.each do |d|
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

  def section_name
    "versions"
  end

  def fetch(url)
    doc = get_doc(url)

    b, c, version = url.split(/[\/\-\.]/)[7,3]
    book_index = $BOOKS.dig(b.downcase.to_sym, :index)
    version = version.split('-').first.downcase
    file = "./#{HTML_CACHE_ROOT}/#{book_index}/#{c}/#{klass_name}-#{version}.htm"

    node = doc.css('.chapter')
    content = node.to_html.split("\n").map(&:strip).join()
    save_file(content, file)

    doc
  end

  def fetch_all
    bar = ProgressBar.create(total: TOTAL_CHAPTERS * VERSION_NUMS.count)
    VERSION_NUMS.each do |v, num|
      url = BASE_URL + "/bible/#{num}/GEN.1.#{v}"

      loop do
        doc = fetch(url)
        next_link = doc.search('a.nav-right')
        break if next_link.nil? or next_link.empty?

        href = next_link.attr('href').value
        url = URI.join(url, href).to_s
        bar.increment
      end
    end
  end


  def item_html(obj)
    """
    <h3>#{obj[:version_name]}</h3>
    <pre>#{obj[:short]} #{obj[:text]}</pre>
    """
  end
end

if $0 == __FILE__
  c = BiblecomCrawler.new
  # c.fetch_all
  c.parse_all
end
