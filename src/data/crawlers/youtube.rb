require 'cgi'; require 'uri'
require 'date'
require 'pry'

require_relative '../lib/consts'
require_relative 'base'
require_relative 'biblecom'

class YoutubeCrawler < Base
  def initialize(biblecom_crawler)
    @biblecom_crawler = biblecom_crawler
    super()
  end

  def fetch(verse_key)
    versions = @biblecom_crawler.get(verse_key)
    hhb = versions.find{|o|o[:version_id] == 'CUNPSS'}
    raise 'must define CUNPSS (he-he-ben) in $VERSIONS' unless hhb

    base_url = "https://www.youtube.com"
    url = "#{base_url}/results?search_query=#{URI.escape hhb[:text]}"
    doc = request(url)

    hymns = doc.search('.yt-lockup button.addto-button').map do |elem|
      id = elem.attr('data-video-ids')
      url = "#{base_url}/get_video_info?video_id=#{id}"
      video_info = CGI::parse(open(url).read)
      json = video_info['player_response'].first
      binding.pry unless json
      metadata = JSON.parse(json)
      video_data = metadata.dig('microformat', 'playerMicroformatRenderer').select do |k, _| 
        %w[category title description ownerChannelName publishDate lengthSeconds].include?(k)
      end

      duration = video_data['lengthSeconds'].to_i
      category = video_data['category']
      valid_duration_range = minutes(3)..minutes(10)
      if category == 'Music' and valid_duration_range.include?(duration)
        {
          id: "youtube-#{id}",
          youtube_id: id,
          url: "#{base_url}/watch?v=#{id}",
          publisher: video_data['ownerChannelName'],
          date: Date.parse(video_data['publishDate']).to_s,
          title: video_data.dig('title', 'simpleText'),
          description: video_data.dig('description', 'simpleText').to_s.gsub(' ', ''),
          duration: duration
        }
      end
    end.compact
    
    Hash[*[verse_key, hymns]]
  end

  def item_html(obj)
    """
    <h3>#{obj[:title]}</h3>
    <p class=\"author\">#{obj[:author]}</p>
    <iframe width=420 height=315
      src=\"https://www.youtube.com/embed/#{obj[:youtube_id]}\">
    </iframe>
    <pre>#{obj[:description]}</pre>
    """
  end

  private

  def minutes(i)
    i * 60
  end

end
