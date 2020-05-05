require_relative 'base'
# Sample
# {
#   "gen.1.1": {
#     "sermons": [
#       {
#         "id": "home_sermons_sermon-2015-05-17",
#         "title": "起初神",
#         "date": "2015-05-17",
#         "preacher": "鄭昌國牧師",
#         "verses": "創世記 1:1",
#         "audio": "http://www.cbcwla.org/media/ch/SundaySermons/2015/Sermon-2015-05-17.mp3"
#       }
#     ]
#   }
# }
class Sermon < Base
  def section_name
    "證道與讀經班"
  end

  def format(item)
    @h.h3 item["title"]
    @h.div(class: :block) do
      @h.author item["preacher"]
      @h.date item["date"] 
      @h.p(class: :verses) do
        @h.text! item["verses"] 
      end
      @h.p do
        if item["audio"]
          @h.a(href: item["audio"], target: '_blank') do
            @h.text! "audio"
          end
        end
        if item["slides"]
          @h.text! " | " if item["audio"]
          @h.a(href: item["slides"], target: '_blank') do
            @h.text! "slides"
          end
        end
      end
    end
  end
end
