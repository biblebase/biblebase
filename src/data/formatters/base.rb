require_relative '../lib/consts'
require_relative '../lib/verse_bundle'
require 'builder'
require 'parallel'
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

  def verse_desc(verse_key)
    VerseBundle.new(verse_key).to_s
  end
end

# NOTE will only work when /html has been filled
def prev_link(bn, c)
  root = "verses_data"
  if c == 1
    prev_bn = (bn == 1) ? 66 : bn - 1
    prev_c = `find html/#{prev_bn} -type d | cut -d/ -f3 | sort -n | tail -n1`.to_i
    "##{prev_bn}/#{prev_c}"
  else
    "##{bn}/#{c - 1}"
  end
end

def next_link(bn, c)
  if File.exists?("html/#{bn}/#{c + 1}.htm")
    "##{bn}/#{c + 1}"
  else
    "##{(bn == 66) ? 1 : bn + 1}/1"
  end
end

if __FILE__ == $0
  ordered_sections = %w[versions words sermons interpretations analytics]

  folders = `find verses_data -mindepth 2 -type d`.split
  Parallel.each(folders, progress: 'Formatting') do |folder|
    parts = folder.match(/^verses_data\/(\d+)\/(\d+)(\/\d+)?$/)
    next unless parts
    book_index, chapter = parts.to_a[1,2].map(&:to_i)

    # verseData
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

    # nav
    book_name = $BOOKS.dig($BOOK_LOOKUP["index_#{book_index}"].to_sym, :full_name, :cht)
    nav = Builder::XmlMarkup.new
    nav.div(class: 'nav') do
      nav.a(class: :prev, href: prev_link(book_index, chapter)){nav.text! '<'}
      nav.span "#{book_name}#{chapter}章"
      nav.a(class: :next, href: next_link(book_index, chapter)){nav.text! '>'}
    end

    target = folder.sub('verses_data', 'html') + ".htm"
    `mkdir -p #{target.split('/')[0..-2].join('/')}`
    File.open(target, 'w'){ |f| f << html + nav }
  end
end
