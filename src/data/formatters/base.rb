require_relative '../lib/consts'
require_relative '../lib/verse_bundle'
require 'builder'
require 'json'

class Base
  def initialize(verse_key)
    @verse_key = verse_key
    @h = Builder::XmlMarkup.new
  end

  def section_name
    raise "implement it"
  end

  def klass_name
    self.class.name.snake_case
  end

  def format(item)
    raise "implement it"
  end

  def format_all(items)
    return "" if items.empty?

    @h.h2 section_name
    items_wrapper do
      items.each do |item|
        format(item)
      end
    end
  end

  private

  def items_wrapper
    @h.div(id: klass_name) do
      yield
    end
  end

  def verse_url(verse_key)
    bk,c,v = verse_key.split('.')
    b = $BOOKS.dig(bk.downcase.to_sym, :index)
    "/##{[b,c,v].join('/')}"
  end

  def verse_desc(verse_key)
    VerseBundle.new(verse_key).to_s
  end
end

if __FILE__ == $0
  ordered_sections = %w[versions words analytics sermons interpretations]

  bn = ARGV.shift || 61
  ch = ARGV.shift || 1
  root = "verses_data/#{bn}/#{ch}"
  folders = `find #{root} -type d`.split
  folders.each do |folder|
    html = ordered_sections.map do |sec|
      f = "#{folder}/#{sec}.json"
      next unless File.exists?(f)

      obj = JSON.parse File.open(f).read
      items = obj.values.first[sec]

      klass_name = sec[0..-2]
      require_relative klass_name
      klass = Object.const_get(klass_name.capitalize)
      formatter = klass.new(obj.keys.first)
      formatter.format_all(items)
    end.compact.join

    target = folder.sub('verses_data', 'html') + ".htm"
    `mkdir -p #{target.split('/')[0..-2].join('/')}`
    File.open(target, 'w'){ |f| f << html }
  end
end
