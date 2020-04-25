require 'date'
require_relative 'base'
require_relative '../lib/verse_bundle'

class CbcwlaCrawler < Base
  START_PAGE = "http://cbcwla.org/home/teaching/"
  UNKNOWN_BOOK_INDEX = 100

  def fetch(choice)
    url = START_PAGE + '?wpfc_bible_book=' + choice
    book_key = $BOOK_LOOKUP[choice] || 'unknown'
    book_index = $BOOKS.dig(book_key, :index) || choice

    i = 0
    while url do
      processed = `find #{HTML_CACHE_ROOT} -name #{klass_name}* | wc -l`.to_i
      sleep 60 if processed % 10 == 0

      begin
        html = open(url)
      rescue OpenURI::HTTPError => e
        warn url
        url = nil
        break
      end

      doc = Nokogiri::HTML(html)
      next_link = doc.search('a.next')
      url = next_link.empty? ? nil : next_link.attr('href').value

      ext = i == 0 ? ".htm" : ".#{i}.htm"
      file = "./#{HTML_CACHE_ROOT}/#{book_index}/#{klass_name}#{ext}"
      save_file(doc.search('.cbcwla_sermon_main').to_s, file)

      i += 1
    end
  end

  # We don't want to crawl in parallel to try to be a good citizen
  def fetch_all(from_url = nil)
    doc = get_doc(START_PAGE)
    choices = doc.search('#wpfc_bible_book option').map{|el| el.attr('value')}

    bar = ProgressBar.create(total: choices.count)
    choices.each do |choice|
      next if choice.empty?
      fetch(choice)

      bar.increment
    end
  end

  def section_name
    "sermons"
  end

  def parse_all()
    files = `find #{HTML_CACHE_ROOT} -name #{klass_name}*.htm`.split
    bar = ProgressBar.create(total: files.count)
    sermons = files.each_with_object({}) do |f, h|
      h.merge! parse(f)
      bar.increment
    end

    bar = ProgressBar.create(total: sermons.count)
    sermons.each do |verse_key, ss|
      book_key, c, v = verse_key.split('.')
      book_index = $BOOKS.dig(book_key.to_sym, :index)
      json = ss.sort_by{|s| - s[:date]}.to_json
      save_json(json, book_index, c, v)
      bar.increment
    end
  end

  def parse(file)
    doc = get_doc(file, 'UTF-8')
    sermon_sections = doc.search('article')
    sermons = sermon_sections.each_with_object({}) do |sermon, h|
      verse_bundle = VerseBundle.new(sermon.search('.bible_passage').text)
      date = Date.parse(sermon.search('.sermon_date').text).to_s
      url = sermon.search('.entry-title a').attr('href').value
      id = url.split('/')[3..-1].join('_')
      obj = {
        id: id,
        title: sermon.search('.entry-title').text,
        date: date,
        preacher: sermon.search('.preacher_name').text,
        verses: verse_bundle.to_s,
        verse_keys: verse_bundle.to_a
      }
      audio_elem = sermon.search('a.sermon-audio')
      obj.merge!(audio: audio_elem.attr('href').value) unless audio_elem.empty?
      slides_elem = sermon.search('a.sermon-notes')
      obj.merge!(slides: slides_elem.attr('href').value) unless slides_elem.empty?

      h[id] = obj
    end

    sermons.each_with_object({}) do |kv, h|
      id, obj = kv
      verse_keys = obj.delete(:verse_keys)
      verse_keys.each do |verse_key|
        h[verse_key] ||= []
        h[verse_key].push obj
      end
    end
  end

  def item_html(obj)
    """
    <h3>#{obj[:title]}</h3>
    <p class=\"author\">#{obj[:preacher]}</p>
    <p class=\"date\">#{obj[:date]}</p>
    <p class=\"verses\">#{obj[:verses].join('; ')}</p>
    #{
      obj[:audio] ?
        "<audio controls><source src=\"#{obj[:audio]}\" /></audio>" :
        ""
    }
    #{
      obj[:slides] ?
        "<p><a href=\"#{obj[:slides]}\">slides</a></p>" :
        ""
    }
    """
  end
end

if $0 == __FILE__
  c = CbcwlaCrawler.new
  # c.fetch_all
  c.parse_all
end
