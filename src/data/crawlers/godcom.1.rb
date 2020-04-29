require_relative 'base'

class GodcomCrawler < Base
  URL_PREFIX = "http://www.godcom.net/chajing"

  FETCH_RULES = {
    fengsheng: -> (book_str, chapter) {
      "/#{book_str}%E4%B8%B0%E7%9B%9B%E7%94%9F%E5%91%BD%E7%A0%94%E8%AF%BB%E6%9C%AC/#{book_str}JT#{ chapter}.htm"
    },
    chenzhongdao: -> (book_str, chapter) { "/#{book_str}JT#{chapter}.htm" },
    matangna: -> (book_str, chapter) { "/%E9%A9%AC%E5%94%90%E7%BA%B3%E6%B3%A8%E9%87%8A/#{book_str}KT#{chapter}.htm" },
    dde: -> (book_str, chapter) { "/#{book_str}DT#{chapter}.htm" },
    leili: -> (book_str, chapter) { "/#{book_str}%E9%9B%B7%E5%8E%86%E6%B3%A8%E9%87%8A/#{book_str}NT#{chapter}.htm" }
  }

  def fetch(url, key, book_index, ch)
    html = open(url)
    path = "./#{HTML_CACHE_ROOT}/#{book_index}/#{ch}"
    `mkdir -p #{path}`
    file = "#{path}/#{klass_name}-#{key}.htm"
    begin
      File.open(file, 'w'){|f| f << html.read}
    rescue StandardError => e
      warn "no such chapter: #{url}"
    end
  end

  def fetch_all
    bar = ProgressBar.create(total: TOTAL_CHAPTERS * FETCH_RULES.size)
    $BOOKS.each do |book_key, book_info|
      book_index = book_info[:index]

      book_index_str = '%02d' % book_index
      testament = "#{book_info[:testament]}%20Testament"
      abbr = book_info.dig(:short_name, :en);
      abbr = "%20" + abbr if abbr.to_i > 0
      url_prefix = "#{URL_PREFIX}/#{testament}/#{book_index_str}#{abbr}"
      FETCH_RULES.each do |key, fn|
        chapter = 1

        loop do 
          fmt = (book_key == :psa) ? '%03d' : '%02d'
          url = url_prefix + fn.call(book_index_str, fmt % chapter)
          begin
            fetch(url, key, book_index, chapter)
            bar.increment
            chapter += 1
          rescue OpenURI::HTTPError => e
            warn url unless key == :chenzhongdao
            break
          end
        end
      end
    end
  end

  def parse
  end

  def parse_all
  end
end

if $0 == __FILE__
  c = GodcomCrawler.new
  c.fetch_all
  # c.parse_all
end
