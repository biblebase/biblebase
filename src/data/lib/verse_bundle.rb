require_relative 'consts'
$BOOK_MAX_VERSES = YAML.load_file(File.dirname(__FILE__) + '/book-max-verses.yml')

class VerseBundle
  # NOTE @bundles format
  # {
  #   php: 1, # or
  #   php: 2..3, # or
  #   php: {
  #     "1": 1, # or
  #     "1": 2..3, # or
  #     "1": [
  #       1,
  #       2,
  #       4..6
  #     ]
  #   }
  # }
  def initialize(verse_key_or_random_string)
    # remove useless letters
    s = verse_key_or_random_string.gsub(/[A-Za-z]+/, '').gsub(/第/, '')

    if s.match $VERSE_KEY_FORMAT
      @bundles = parse_verse_key(s)
    else
      @bundles = parse(s)
    end
  end

  def to_s(desc_mode = :full)
    @bundles.map do |key, ch_ds|
      next if ch_ds.nil? or ch_ds.size == 0
      book_name_mode = desc_mode == :full ? :full_name : :short_name
      book_key = key.to_s.split('-').first
      b = $BOOKS.dig(book_key.to_sym, book_name_mode, :cht)
      ch_s = if ch_ds.is_a? Range
              "#{ch_ds.begin}-#{ch_ds.end}章"
            elsif ch_ds.is_a? Integer
              desc_mode == :full ? "#{ch_ds}章" : ch_ds.to_s
            elsif ch_ds.is_a? Hash
              ch_ds.map do |ch, v_ds|
                v_s = if v_ds.is_a? Integer
                        v_ds.to_s
                      elsif v_ds.is_a? Range
                        "#{v_ds.begin}-#{v_ds.end}"
                      elsif v_ds.is_a? Array
                        v_ds.map do |v|
                          if v.is_a? Integer
                            v.to_s
                          elsif v.is_a? Range
                            "#{v.begin}-#{v.end}"
                          else
                            raise "wrong verse"
                          end
                        end.join(',')
                      else
                        raise 'wrong verse ds'
                      end
                [ch, v_s].join(':')
              end.join(', ')
            else
              raise 'wrong chapter ds'
            end
      [b, ch_s].join(desc_mode == :full ? ' ' : '')
    end.compact.join('; ')
  end

  def to_a
    @bundles.each_with_object([]) do |kv, arr|
      b, ch_ds = kv
      next if ch_ds.nil? or ch_ds.size == 0

      # NOTE continue
      book_key = b.to_s.split('-').first
      if ch_ds.is_a? Range
        ch_ds.each{|ch| arr.push verse_key(book_key, ch)}
      elsif ch_ds.is_a? Integer
        arr.push verse_key(book_key, ch_ds)
      elsif ch_ds.is_a? Hash
        ch_ds.each do |ch, v_ds|
          if v_ds.is_a? Integer
            arr.push verse_key(book_key, ch, v_ds)
          elsif v_ds.is_a? Range
            v_ds.each{|v| arr.push verse_key(book_key, ch, v)}
          elsif v_ds.is_a? Array
            v_ds.each do |v|
              if v.is_a? Integer
                arr.push verse_key(book_key, ch, v)
              elsif v.is_a? Range
                v.each{|vi| arr.push verse_key(book_key, ch, vi)}
              else
                binding.pry
                raise "wrong verse"
              end
            end
          else
            binding.pry
            raise 'wrong verse ds'
          end
        end
      else
        binding.pry
        raise 'wrong chapter ds'
      end
    end
  end

  private

  # NOTE currently only used in GodcomCrawler
  # and only support: php.1.1, php.1.1-2
  def parse_verse_key(verse_key)
    bk, c, v, _ = verse_key.split('.')
    cv = if v
           Hash[*[c, get_collection(v)]]
         else
           c.to_i
         end
    Hash[*[bk.to_sym, cv]]
  end

  def verse_key(b, c, v=nil)
    [b, c, v].compact.map(&:to_s).join('.')
  end

  def parse(str)
    book_name_re = /^[^a-zA-Z0-9:-]+/
    book_key = nil
    chap_str = nil

    str.gsub(/\s*[:：]\s*/, ':').split(/[\s,;，；]+/).each_with_object({}) do |part, h|
      if matched = part.match(book_name_re)
        book_name = matched[0]
        chap_str = nil
        chapter_verse = part.sub(book_name, '')

        book_key = get_book_key(book_name)
      else
        chapter_verse = part
      end
      next unless book_key

      h[book_key] ||= {}
      if chapter_verse.size > 0
        chapters, verses, rest = chapter_verse.split(':')

        # NOTE e.g. 14:1-15:13
        if rest
          start_chapter = chapters
          start_verse, end_chapter = verses.split('-')
          end_verse = rest

          book_index = $BOOKS[book_key][:index]
          end_of_start_chapter = $BOOK_MAX_VERSES[book_index][start_chapter.to_i]
          h[book_key][start_chapter] = get_collection("#{start_verse}-#{end_of_start_chapter}")
          if end_chapter.to_i - 1 > start_chapter.to_i
            h["#{book_key}-1"] = get_collection("#{start_chapter.to_i + 1}-#{end_chapter.to_i - 1}")
          end
          h["#{book_key}-2"] = [[end_chapter, get_collection("1-#{end_verse}")]].to_h


        # NOTE e.g. 12:1 or 12:1-3
        elsif verses
          # NOTE e.g. 14-15:2
          if chapters.include?('-')
            start_chapter, end_chapter = chapters.split('-')
            end_verse = verses
            h[book_key] = get_collection("#{start_chapter}-#{end_chapter.to_i - 1}")
            h["#{book_key}-1"] = [[end_chapter, get_collection("1-#{end_verse}")]].to_h
          else
            chap_str = chapters 
            begin
              h[book_key][chap_str] = get_collection(verses)
            rescue
            end
          end

        # NOTE e.g. ,2,3,5-8
        elsif chap_str
          verses = chapters
          h[book_key][chap_str] = [h[book_key][chap_str], get_collection(verses)].flatten 

        # NOTE e.g. 1-2
        else
          h[book_key] = get_collection(chapters)
          chap_str = nil
        end
      end
    end
  end

  def get_collection(str)
    lbound, ubound = (str+'-0').split('-')[0..1].map(&:to_i)
    if ubound > lbound and lbound > 0
      lbound..ubound
    elsif lbound > 0 and str.to_i > 0
      str.to_i
    else
      []
    end
  end

  def get_book_key(str)
    $BOOK_LOOKUP[str]&.to_sym
  end
end

if $_
  puts
  s = $_.split("\t").last
  p VerseBundle.new(s).to_a
elsif __FILE__ == $0
  samples = [
    "民數記 34-36 申命記 1-7",
    "申命記4:32-39, 6:4-5",
    "申命記28；雅各書1:19-25；馬可福音4:1-25",
    "申 11:8-12, 申命記6:1-9",
    "羅馬書 13:11-15:13",
    "羅馬書 13-15:13",
    "路加福音 Luke 1:5",
    "使徒行傳第15章",
    "希伯來書 10-11章",
    "創9:3,4",
    "以弗所書4:11-16 彼得前書1:23-25 羅馬書10:17 使徒行傳20:32b, 12:24, 4:4, 5:17-20, 6:7, 19:20",
    "來9:12,14,22-23, 10:19, 11:1-2; 彼前1:2,18-19, 2:9; 約一1:5-2:2; 啟1:5-6, 5:9-10, 12:11",
    "詩篇 19 12-14",
    "羅馬書 課程介紹"
  ]

  samples.each do |s|
    b = VerseBundle.new(s)
    puts [s, b.to_s, b.to_a.to_s].join("\n  => ")
  end
end
