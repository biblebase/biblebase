require_relative 'crawlers/biblehub'
require_relative 'lib/consts'
require 'json'


def fetch_chapter(book, chapter)
  c = BiblehubCrawler.new
  verse = 0
  loop do
    begin
      words = c.fetch "#{book[:key]}.#{chapter}.#{verse+=1}"
      path = "./verses_data/#{book[:index]}/#{chapter}/#{verse}"
      `mkdir -p #{path}`
      filename = "#{path}/words.json"
      File.open(filename, 'w'){ |f| f << words.to_json }
    rescue OpenURI::HTTPError => e
      break
    end
  end
  return (verse - 1)
end

def fetch_book(book)
  chapter = 0
  loop do
    max_verse = fetch_chapter(book, chapter+=1)
    break if max_verse == 0
  end
  return (chapter - 1)
end

$BOOKS.each do |book_key, book|
  warn "fetching book #{book_key}..."
  fetch_book(book.merge(key: book_key))
end

warn 'DONE!'
