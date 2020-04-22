require 'nokogiri'
require 'open-uri'
require 'pry'

version_id = (ARGV.shift || :HHB).to_sym
`mkdir #{version_id.to_s.downcase}`
VERSION_NUMS = {
  NLT: 116,
  NIV: 111,
  MSG: 97,
  CNVT: 40,
  CNV: 41,
  HHBT: 46,
  HHB: 48
}

BASE_URL = 'https://www.bible.com' 

book_id = 'GEN'
book_num = 1
puts book_id, book_num
url = BASE_URL + "/bible/#{VERSION_NUMS[version_id]}/#{book_id}.1"

while url
  html = open(url)
  doc = Nokogiri::HTML(html)
  node = doc.css('.chapter')

#  node.css('.verse .content').each do |node|
#    node['phx-click'] = 'toggle-verse'
#    node['phx-value'] = node.parent['class'].sub('verse v', '').to_i
#  end

  content = node.to_html.split("\n").map(&:strip).join()
  this_book_id, chapter_num = url.split("/").last.split(".")
  if this_book_id != book_id
    book_num += 1
    book_id = this_book_id
    puts book_id, book_num
  end
  filename = "#{version_id.to_s.downcase}/#{book_num}.#{chapter_num}.html"
  File.open(filename, 'w'){ |f| f.puts content }

  nextnode = doc.css('.nav-right')[0]
  if nextnode
    url = BASE_URL + nextnode["href"]
  else
    url = nil
  end
end
