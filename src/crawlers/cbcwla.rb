require 'nokogiri'
require 'open-uri'
require 'yaml'
require 'pry'
require 'date'
require 'json'
require_relative 'consts'
require_relative 'crawler'

class CbcwlaCrawler < Crawler
  ALL_VERSES = "*"

  def initialize(max_verse)
    @max_verse = max_verse
    super()
  end

  def fetch(verse_key)
    book_abbr, chapter, _ = verse_key.split('.')
    book = $BOOKS[book_abbr.to_sym]

    url = "http://cbcwla.org/home/sermons/book/#{book.dig(:full_name, :en).downcase}/"
    html = open(url)
    doc = Nokogiri::HTML(html)
    sermon_sections = doc.search('.cbcwla_sermon_main article')
    ret = sermon_sections.each_with_object({}) do |sermon, ret|
      next unless sermon.search('.service_type a').text == '主日證道'

      verse_bundles = parse_verse_desc(sermon.search('.bible_passage').text)
      date = Date.parse(sermon.search('.sermon_date').text).to_s
      obj = {
        id: "cbcwla-sermon-#{date}",
        title: sermon.search('.entry-title').text,
        date: date,
        preacher: sermon.search('.preacher_name').text,
        verses: verse_bundles.map{ |v| gen_verse_desc(v) }
      }
      audio_elem = sermon.search('a.sermon-audio')
      obj.merge!(audio: audio_elem.attr('href').value) unless audio_elem.empty?
      slides_elem = sermon.search('a.sermon-notes')
      obj.merge!(slides: slides_elem.attr('href').value) unless slides_elem.empty?

      verse_bundles.each do |bundle|
        b,c,_ = bundle.split('.')
        next unless b == book_abbr and c == chapter

        bundle_to_verses(bundle).each do |each_verse_key|
          ret[each_verse_key] ||= []
          ret[each_verse_key].push(obj)
        end
      end
    end

    (1..@max_verse).each_with_object(ret) do |v, ret|
      each_verse_key = "#{book_abbr}.#{chapter}.#{v}"
      ret[each_verse_key] ||= []
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

  private

  # NOTE to parse any verses descriptions, currently support e.g.
  # Phil1:1
  # 腓 3
  # 腓 1:1
  # 腓立比書 1:1
  # 腓立比書 1:1-2,2:1-4
  #
  # Return array of verse_keys, e.g. ["php.1.1-2", "php.2.1-4"]
  def parse_verse_desc(desc)
    verse_descs = desc.split(/[；;]/).map(&:strip) 
    verse_descs.each_with_object([]) do |verse_desc, ret|
      book_str = verse_desc.split(/\d+/).first.strip
      chapter_verses = verse_desc.sub(book_str, '').strip
      book_key = $BOOK_LOOKUP[book_str]
      next unless book_key
      if chapter_verses.empty?
        ret.push(book_key.to_s)
        next
      end

      # TODO
      # 1. consider the part after comma shares the same chapter, e.g. Phil 2:2-4,6
      # 2. consider across chapters, e.g. Phil 1-2
      chapter_verses.split(/,\s*/).map do |chapter_verse|
        chapter_str, verse_range = chapter_verse.split(':')
        ret.push("#{book_key}.#{chapter_str}.#{verse_range || ALL_VERSES}")
      end
    end
  end

  def gen_verse_desc(verse_key, lang: :chs)
    b,c,v = verse_key.split('.')
    book = $BOOKS[b.to_sym]
    $LANGS[lang][:short_fn].call(book, c, v)
  end

  def bundle_to_verses(bundle)
    book, chapter, verse_bundle, _ = bundle.split('.')
    verse_range = if verse_bundle == ALL_VERSES
                    1..@max_verse
                  else
                    lbound, ubound = verse_bundle.split('-')
                    ubound ||= lbound
                    (lbound.to_i)..(ubound.to_i)
                  end
    verse_range.map{|verse| "#{book}.#{chapter}.#{verse}" }
  end

  def verse_included(verse_key, book_str, chapter, verse)
    b,c,v = verse_key.split('.')
    return false unless book_str == b
    return false unless chapter == c.to_i
    return false unless v

    lbound, ubound = v.split('-').map(&:to_i)
    ubound ||= lbound
    (lbound..ubound).include?(verse)
  end
end
