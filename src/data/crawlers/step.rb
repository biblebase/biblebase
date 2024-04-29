require_relative 'base'

class StepCrawler < Base
  URL_PREFIX = {
    old: "https://www.stepbible.org/?display=INTERLINEAR&q=version=CUn|version=OHB|reference=",
    new: "https://www.stepbible.org/?display=INTERLINEAR&q=version=CUn|version=BYZ|reference="
    #https://www.stepbible.org/?display=INTERLEAVED&q=version=CUn|version=WHNU|reference=2Tim.2
  }

  def fetch(url, book_index, ch)
    html = URI.open(url)

    path = "./#{HTML_CACHE_ROOT}/#{book_index}/#{ch}"
    `mkdir -p #{path}`
    file = "#{path}/#{klass_name}.htm"

    File.open(file, 'w'){ |f| f << html.read }

    # NOTE stepbible renders nonexistent chapter as esv gen1
    doc = get_doc(file)
    title = doc.css('title').text
    if title.split(' | ')[1] == 'ESV'
      `rm #{file}`
      `rmdir #{path}`
      return false
    else
      return true
    end
  end

  def fetch_all
    bar = ProgressBar.create(total: TOTAL_CHAPTERS)
    # $BOOKS.each do |k,v|
    Parallel.each($BOOKS) do |k,v|
      testament = v[:testament].downcase
      url_prefix = URL_PREFIX[testament.to_sym]
      book_index = v[:index]
      book_short = v.dig(:short_name, :en)

      chapter= 1
      loop do
        url = "#{url_prefix}#{book_short}.#{chapter}"
        if fetch(url, book_index, chapter)
          bar.increment
          chapter += 1
        else
          break
        end
      end

      # TODO fix single chapter books: 57, 31, 63, 65, 64
    end
  end

  def parse(f)
    doc = get_doc(f)
    _, bn, c, _ = f.split('/')
    doc.search('.ltr').each do |elem|
      v = elem.search('.verseStart .verseNumber').text.split(/[\s:]/)[-1]
      verse_key = get_verse_key(bn, c, v)
      # warn verse_key
      loaded = load_json(bn, c, v)
      words_hash = loaded.values[0][section_name].reject{|w| w['lang'].nil?}
      #next if words_hash.any?{|w| w.key?('index_cht')}

      words_hash = words_hash.map do |w|
        w.transform_keys(&:to_sym)
          .merge(origin_simp: w[w['lang']].downcase.tr(*$GREEK_TRANSLITERATES))
      end

      words_in_cht = elem.search('span.w')[1..-1].map.with_index do |w, idx|
        text = w.search('.text').text.gsub($SP_RE, '')
        cht = text.gsub($CHINESE_PUNCT, '')
        puncts = text.scan($CHINESE_PUNCT)
        punct_cht = puncts.empty? ? nil : puncts.join

        origins = w.search('.interlinear').text.gsub($SP_RE, '').split
        ids = if w['strong']
                w['strong'].split.map do |step_id|
                  lang = step_id[0] == 'G' ? 'greek' : 'hebrew'
                  "#{lang}-#{step_id[1..-1].to_i}"
                end
              else
                ['']
              end

        ids.map.with_index do |id, id_idx|
          word_info = {
            id: id,
            origin_simp: origins[id_idx] || '',
            index_cht: idx,
            cht: cht
          }
          punct_cht ? word_info.merge!(punct_cht: punct_cht) : word_info
        end
      end.flatten

      words_in_cht.each do |wc|
        candidates = words_hash.select do |w|
          w[:index_cht].nil? and
            (wc[:id] == w[:id] or
             wc[:origin_simp] == w[:origin_simp]
            )
        end

        word_info = wc
        if candidates[0]
          candidates[0].merge!(wc)
          word_info = candidates[0]
        else
          words_hash.push wc
        end

        if word_info[:cht] =~ /生命/
          puts verse_key
          puts [word_info[:eng], word_info[:cht]].inspect
        end

      end
      
      save_json(words_hash, bn, c, v)
    end
  end

  def parse_all()
    files = `find #{HTML_CACHE_ROOT} -name #{klass_name}.htm`.split
    Parallel.each(files, progress: 'Parsing') do |f|
    # files.each do |f|
      parse(f)
    end
  end

  def section_name
    "words"
  end
end

# NOTE crawlers/biblehub#parse_all should be executed first.
if $0 == __FILE__
  c = StepCrawler.new
  # c.fetch_all
  c.parse_all
end
