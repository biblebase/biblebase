require 'nokogiri'
require 'open-uri'
require 'uri'
require 'yaml'
require 'json'
require 'parallel'
require_relative '../lib/consts'

class Base
  HTML_CACHE_ROOT = 'source_htmls'
  TOTAL_VERSES = 30985
  TOTAL_CHAPTERS = 1217

  def initialize
    @cache = {}
  end

  def get(verse_key)
    @cache.merge!(fetch(verse_key)) unless @cache[verse_key]

    @cache[verse_key] || []
  end

  def fetch_all
    raise 'to be implemented'
  end

  def fetch(url)
    raise 'to be implemented'
  end

  def parse_all
    raise 'to be implemented'
  end

  def parse
    raise 'to be implemented'
  end

  def item_hash(obj)
    obj
  end

  def item_html(obj)
    raise 'to be implemented'
  end

  def get_doc(resource, encoding=nil)
    html = if resource.is_a? Tempfile
             html
           elsif resource[0,4] == 'http'
             open(resource)
           else
             File.open(resource)
           end
    doc = Nokogiri::HTML(html, nil, encoding)
  end

  def klass_name
    self.class.name.sub(/Crawler$/, '').snake_case
  end
  
  def path_to_key(path)
    root, bn, c, v, _ = path.split('/')
    get_verse_key(bn, c, v)
  end

  def section_name
    raise 'implement it!'
  end

  def save_json(obj, book_index, chapter, verse = nil)
    verse_key = get_verse_key(book_index, chapter, verse)
    content = Hash[*[verse_key, 
                  Hash[*[ section_name, obj]]
            ]].to_json
    file = "./verses_data/#{book_index}/#{chapter}/"
    file += "#{verse}/" if verse
    file += "#{section_name}.json"
    save_file(content, file)
  end

  def load_json(book_index, chapter, verse = nil)
    file = "./verses_data/#{book_index}/#{chapter}/"
    file += "#{verse}/" if verse
    file += "#{section_name}.json"
    JSON.parse File.open(file, 'r').read
  end

  def get_verse_key(book_index, chapter, verse = nil)
    book_key = $BOOK_LOOKUP["index_#{book_index}"]
    [book_key, chapter, verse].compact.join('.')
  end

  def save_file(content, file)
    path = file.split('/')[0..-2].join('/')
    `mkdir -p #{path}` unless File.exists?(path)
    File.open(file, 'w'){|f| f << content}
  end

  def mv(source_file, target_file)
    path = target_file.split('/')[0..-2].join('/')
    `mkdir -p #{path}`
    File.rename source_file, target_file
  end
end
