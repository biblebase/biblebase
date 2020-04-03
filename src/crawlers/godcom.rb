require 'nokogiri'
require 'open-uri'
require 'pry'
require_relative 'consts'
require_relative 'crawler'


class GodcomCrawler < Crawler
  URL_PREFIX = "http://www.godcom.net/chajing/New%20Testament"
  CLEAR_KEY = '<clear>'
  RULES = {
    fengsheng: {
      title: "丰盛生命研读本",
      url_fn: -> (book, chapter) {
        book_index = $BOOKS[book.to_sym][:index];
        en_book_short_name = $BOOKS.dig(book.to_sym, :short_name, :en).capitalize;
        "#{URL_PREFIX}/#{book_index}#{en_book_short_name}/#{book_index}%E4%B8%B0%E7%9B%9B%E7%94%9F%E5%91%BD%E7%A0%94%E8%AF%BB%E6%9C%AC/#{book_index}JT#{ '%02d' % chapter}.htm"
      },
      parse_rules: [{ 
        pattern: /^(\d+):(\d+)$/,
        key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[2]}" }
      }, {
        pattern: /^返回/,
        key_fn: -> (book, chapter, m) { CLEAR_KEY }
      }]
    },
    chenzhongdao: {
      title: "新约书信读经讲义",
      author: "陈终道",
      url_fn: -> (book, chapter) {
        book_index = $BOOKS[book.to_sym][:index];
        en_book_short_name = $BOOKS.dig(book.to_sym, :short_name, :en).capitalize;
        "#{URL_PREFIX}/#{book_index}#{en_book_short_name}/#{book_index}JT#{ '%02d' % chapter}.htm"
      },
      parse_rules: [{
        pattern: /（(\d+):(\d+)(-\d+)?(.)?）$/,
        key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[2]}#{m[3]}#{m[4] ? '.' + m[4].ord.to_s : ''}" }
      }, {
        pattern: /^问题讨论$/,
        key_fn: -> (book, chapter, m) { CLEAR_KEY }
      }, {
        pattern: /^返回/,
        key_fn: -> (book, chapter, m) { CLEAR_KEY }
      }, {
        pattern: /^(\d+)本节/,
        key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[1]}" }
      }]
    },
    matangna: {
      title: "马唐纳注释",
      author: "马唐纳",
      url_fn: -> (book, chapter) {
        book_index = $BOOKS[book.to_sym][:index];
        en_book_short_name = $BOOKS.dig(book.to_sym, :short_name, :en).capitalize;
        "#{URL_PREFIX}/#{book_index}#{en_book_short_name}/#{book_index}FT#{ '%02d' % chapter}.htm"
      },
      parse_rules: [{
        pattern: /（([#{$CHINESE_NUMBERS}]+)(\d+)(～(\d+))?）$/,
        key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[2]}#{ m[3] ? '-' + m[4].to_s : '' }" }
      }, {
        pattern: /^([#{$CHINESE_NUMBERS}]+)(\d+)([,，](\d+))?\D+/,
        key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[2]}#{ m[3] ? '-' + m[4].to_s : '' }" }
      }]
    },
    dde: {
      title: "丁道尔圣经注释",
      author: "丁道尔",
      url_fn: -> (book, chapter) {
        book_index = $BOOKS[book.to_sym][:index];
        en_book_short_name = $BOOKS.dig(book.to_sym, :short_name, :en).capitalize;
        "#{URL_PREFIX}/#{book_index}#{en_book_short_name}/#{book_index}DT#{ '%02d' % chapter}.htm"
      },
      parse_rules: [{
        pattern: /^(\d+)(～(\d+))?\./,
        key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[1]}#{ m[2] ? '-' + m[3].to_s : '' }" }
      }, {
        pattern: /^增注：([#{$CHINESE_NUMBERS}]+)章(\d+)(～(\d+))?节$/,
        key_fn: -> (book, chapter, m) { CLEAR_KEY }
      }, {
        pattern: /^\d+\D+.+\d+页/,
        key_fn: -> (book, chapter, m) { CLEAR_KEY }
      }, {
        pattern: /（([#{$CHINESE_NUMBERS}]+)(\d+)(～(\d+))?）$/,
        key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[2]}#{ m[3] ? '-' + m[4].to_s : '' }" }
    }]
    }
  }

  def initialize(max_verse)
    @max_verse = max_verse
    super()
  end

  def fetch(verse_key)
    book, chapter, _ = verse_key.split('.')

    ret = RULES.each_with_object({}) do |kv, ret|
      key, rule = kv
      url = rule.delete(:url_fn).call(book, chapter)
      doc = get_doc(url)
      ps = cleaned_paragraphs(doc)

      parse_rules = rule.delete(:parse_rules)
      parsed = parse_as_verse_titled(book, chapter, ps, parse_rules)
      by_verse(parsed).each do |each_verse_key, content|
        ret[each_verse_key] ||= []
        obj = {}.merge(rule)
          .merge(id: key)
          .merge(text: content.values.join("\n* * *\n"))
          .merge(content: content)
        ret[each_verse_key].push(obj)
      end
    end

    (1..@max_verse).each_with_object(ret) do |v, ret|
      each_verse_key = "#{book}.#{chapter}.#{v}"
      ret[each_verse_key] ||= []
    end
  end

  def item_hash(obj)
    obj.reject do |k, _|
      k == :content
    end
  end

  def item_html(obj)
    """
    <h3>#{obj[:title]}</h3>
    <p class=\"author\">#{obj[:author]}</p>
    <div>#{
      obj[:content].map do |_, text|
        "<pre>#{text}</pre>"
      end.join
    }</div>
    """
  end

  private

  def get_doc(url)
    html = open(url)
    return Nokogiri::HTML(html, nil, "GB18030")
  end

  def cleaned_paragraphs(doc)
    return doc.search('p').map do |p| 
      pt = p.text.gsub(/[\s\u00A0\u3000]/, '')
    end
  end

  def parse_as_verse_titled(book, chapter, paragraphs, rules = nil)
    default_opts = { 
      pattern: /^(\d+):(\d+)$/,
      key_fn: -> (book, chapter, m) { "#{book}.#{chapter}.#{m[2]}" }
    }
    rules ||= [ default_opts ]

    current_key = nil
    verses = paragraphs.each_with_object({}) do |p, ret|
      matched_key = rules.map do |rule|
        if matched = p.match(rule[:pattern])
          rule[:key_fn].call(book, chapter, matched)
        end
      end.compact.first

      if matched_key
        current_key = matched_key
        ret[current_key] = [p]
      elsif current_key
        ret[current_key].push p
      end
    end

    verses.each_with_object({}) do |kv, ret|
      verse_bundle, ps = kv
      ret[verse_bundle] = ps.join("\n") unless verse_bundle == CLEAR_KEY
    end
  end

  def by_verse(bundle_texts)
    bundle_texts.each_with_object({}) do |kv, ret|
      verse_bundle, text = kv
      bundle_to_verses(verse_bundle).each do |verse|
        ret[verse] ||= {}
        ret[verse][verse_bundle] = text
      end
    end
  end

  def bundle_to_verses(bundle)
    book, chapter, verse_bundle, suf = bundle.split('.')
    lbound, ubound = verse_bundle.split('-')
    ubound ||= lbound
    verse_range = (lbound.to_i)..(ubound.to_i)
    verse_range.map{|verse| "#{book}.#{chapter}.#{verse}" }
  end
end
