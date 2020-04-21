require 'nokogiri'
require 'open-uri'
require 'yaml'
require 'json'

class Crawler
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
end
