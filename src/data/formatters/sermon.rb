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
    "證道"
  end

  def format(item)
    ""
  end
end
