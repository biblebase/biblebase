require_relative 'base'
# Sample
# {
#   "gen.1.1": {
#     "interpretations": {
#       "dde": {
#         "content": [
#           {
#             "verse": "gen.1.1-23",
#             "paragraphs": [
#               "Ａ创造的故事（一1～23）",
#               "序言（一1、2）"
#             ]
#           },
#           {
#             "verse": "gen.1.1",
#             "paragraphs": [
#               "1.神是圣经第一句话的主词"
#             ]
#           }
#         ],
#         "title": "丁道尔圣经注释",
#         "author": "丁道尔"
#       },
#       "leili": {
#         "content": [
#           {
#             "verse": "gen.1.1",
#             "paragraphs": [
#               "一1\"起初\"。本章所描述的起初并不是永恒的起初，而是世界创造的开始。"
#             ]
#           }
#         ],
#         "title": "雷历研读本圣经",
#         "author": "雷历"
#       }
#     }
#   }
class Interpretation < Base
  def section_name
    "解經"
  end

  def format(item)
    ""
  end
end
