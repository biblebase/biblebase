require_relative 'base'
# Sample
# {
#   "gen.1.1": {
#     "words": [
#       {
#         "id": "hebrew-7225",
#         "translit": "bə·rê·šîṯ",
#         "lang": "hebrew",
#         "hebrew": "בְּרֵאשִׁ֖ית",
#         "pos": "Prep‑b | N‑fs",
#         "eng": "In the beginning"
#       },
#       {
#         "id": "hebrew-776",
#         "translit": "hā·’ā·reṣ.",
#         "lang": "hebrew",
#         "hebrew": "הָאָֽרֶץ׃",
#         "pos": "Art | N‑fs",
#         "punct": ".",
#         "eng": "the earth"
#       }
#     ]
#   }
# }
class Word < Base
  def section_name
    "逐詞翻譯"
  end

  def format(item)
    ""
  end
end
