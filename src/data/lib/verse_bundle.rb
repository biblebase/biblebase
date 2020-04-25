require_relative 'consts'

class VerseBundle
  def initialize(str)
    @bundles = parse(str)
  end

  def to_s
    @bundles.map do |key, ch_ds|
      next if ch_ds.nil? or ch_ds.size == 0
      b = $BOOKS.dig(key, :full_name, :cht)
      ch_s = if ch_ds.is_a? Range
              "#{ch_ds.begin}-#{ch_ds.end}章"
            elsif ch_ds.is_a? Integer
              "#{ch_ds}章"
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
      [b, ch_s].join(' ')
    end.compact.join('; ')
  end

  def to_a
    @bundles.each_with_object([]) do |kv, arr|
      b, ch_ds = kv
      next if ch_ds.nil? or ch_ds.size == 0

      # NOTE continue
      if ch_ds.is_a? Range
        ch_ds.each{|ch| arr.push verse_key(b, ch)}
      elsif ch_ds.is_a? Integer
        arr.push verse_key(b, ch_ds)
      elsif ch_ds.is_a? Hash
        ch_ds.each do |ch, v_ds|
          if v_ds.is_a? Integer
            arr.push verse_key(b, ch, v_ds)
          elsif v_ds.is_a? Range
            v_ds.each{|v| arr.push verse_key(b, ch, v)}
          elsif v_ds.is_a? Array
            v_ds.each do |v|
              if v.is_a? Integer
                arr.push verse_key(b, ch, v)
              elsif v.is_a? Range
                v.each{|vi| arr.push verse_key(b, ch, vi)}
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

  def verse_key(b, c, v=nil)
    [b, c, v].compact.map(&:to_s).join('.')
  end

  def parse(str)
    book_name_re = /^[^a-zA-Z0-9:-]+/
    book_key = nil
    chap_str = nil

    str.gsub(/\s+:/, ':').split(/[\s,;，；]+/).each_with_object({}) do |part, h|
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
        chapters, verses, _ = chapter_verse.split(/[:：]/)

        # NOTE 14:1-15:13 won't be ignored
        next unless _.nil?

        # NOTE e.g. 12:1 or 12:1-3
        if verses
          # NOTE e.g. 14-15:2
          raise 'unknown format' if chapters.include?('-')

          chap_str = chapters 
          begin
            h[book_key][chap_str] = get_collection(verses)
          rescue
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

if __FILE__ == $0
  samples = [
    "民數記 34-36 申命記 1-7",
    "申命記4:32-39, 6:4-5",
    "申命記28；雅各書1:19-25；馬可福音4:1-25",
    "申 11:8-12, 申命記6:1-9",
    "羅馬書 14:1-15:13",
    "創9:3,4",
    "以弗所書4:11-16 彼得前書1:23-25 羅馬書10:17 使徒行傳20:32b, 12:24, 4:4, 5:17-20, 6:7, 19:20",
    "來9:12,14,22-23, 10:19, 11:1-2; 彼前1:2,18-19, 2:9; 約一1:5-2:2; 啟1:5-6, 5:9-10, 12:11",
    "羅馬書 課程介紹"
  ]

  samples.each do |s|
    b = VerseBundle.new(s)
    p b.to_s
    p b.to_a
  end
end
