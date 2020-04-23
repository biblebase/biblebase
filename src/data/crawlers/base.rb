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

  def initialize
    @cache = {}
  end

  def get(verse_key)
    @cache.merge!(fetch(verse_key)) unless @cache[verse_key]

    @cache[verse_key] || []
  end

  def fetch(verse_key)
    raise 'to be implemented, has to return {<verse_key>: [<object>]}'
  end

  def item_hash(obj)
    obj
  end

  def item_html(obj)
    raise 'to be implemented'
  end

  def request(url, encoding=nil)
    html = open(url)
    doc = Nokogiri::HTML(html, nil, encoding)
  end

  def klass_name
    self.class.name.sub(/Crawler$/, '').snake_case
  end
  
  def path_to_key(path)
    root, bn, c, v, _ = path.split('/')
    b = $BOOK_LOOKUP["index_#{bn}"]
    [b, c, v].compact.join('.')
  end

  def save(file, content)
    path = file.split('/')[0..-2].join('/')
    `mkdir -p #{path}`
    File.open(file, 'w'){|f| f << content}
  end

  def mv(source_file, target_file)
    path = target_file.split('/')[0..-2].join('/')
    `mkdir -p #{path}`
    File.rename source_file, target_file
  end
end
