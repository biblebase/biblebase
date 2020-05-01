require_relative 'base'
# Sample
# {
#   "gen.1.1": {
#     "versions": {
#       "ccb": {
#         "text": "太初，上帝创造了天地。",
#         "version_id": "CCB",
#         "version_name": "圣经当代译本",
#         "lang": "chs"
#       },
#       "nlt": {
#         "text": "In the beginning God created the heavens and the earth.",
#         "version_id": "NLT",
#         "version_name": "New Living Translation",
#         "lang": "en"
#       }
#     }
#   }
# }
class Version < Base
  def section_name
    "聖經版本"
  end

  def format(item)
    ""
  end
end
