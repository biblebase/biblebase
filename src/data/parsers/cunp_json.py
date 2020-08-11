# Convert CUMP html files to json files
import urllib3
import json
import requests
from bs4 import BeautifulSoup
import pprint
import os

urllib3.disable_warnings()

bible_index = [
    { "abbr": "gen", "id": 1, "name": "Genesis", "title": "創世記", "chapters": 50 },
    { "abbr": "ex", "id": 2, "name": "Exodus", "title": "出埃及記", "chapters": 40 },
    { "abbr": "lev", "id": 3, "name": "Leviticus", "title": "利未記", "chapters": 27 },
    { "abbr": "num", "id": 4, "name": "Numbers", "title": "民數記", "chapters": 36 },
    { "abbr": "deut", "id": 5, "name": "Deuteronomy", "title": "申命記", "chapters": 34 },
    { "abbr": "josh", "id": 6, "name": "Joshua", "title": "約書亞記", "chapters": 24 },
    { "abbr": "judg", "id": 7, "name": "Judges", "title": "士師記", "chapters": 21 },
    { "abbr": "ruth", "id": 8, "name": "Ruth", "title": "路得記", "chapters": 4 },
    { "abbr": "1sam", "id": 9, "name": "1 Samuel", "title": "撒母耳記上", "chapters": 31 },
    { "abbr": "2sam", "id": 10, "name": "2 Samuel", "title": "撒母耳記下", "chapters": 24 },
    { "abbr": "1kings", "id": 11, "name": "1 Kings", "title": "列王紀上", "chapters": 22 },
    { "abbr": "2kings", "id": 12, "name": "2 Kings", "title": "列王記下", "chapters": 25 },
    { "abbr": "1chron", "id": 13, "name": "1 Chronicles", "title": "歷代志上", "chapters": 29 },
    { "abbr": "2chron", "id": 14, "name": "2 Chronicles", "title": "歷代志下", "chapters": 36 },
    { "abbr": "ezra", "id": 15, "name": "Ezra", "title": "以斯拉記", "chapters": 10 },
    { "abbr": "neh", "id": 16, "name": "Nehemiah", "title": "尼希米記", "chapters": 13 },
    { "abbr": "est", "id": 17, "name": "Esther", "title": "以斯帖記", "chapters": 10 },
    { "abbr": "job", "id": 18, "name": "Job", "title": "約伯記", "chapters": 42 },
    { "abbr": "ps", "id": 19, "name": "Psalms", "title": "詩篇", "chapters": 150 },
    { "abbr": "prov", "id": 20, "name": "Proverbs", "title": "箴言", "chapters": 31 },
    { "abbr": "eccles", "id": 21, "name": "Ecclesiastes", "title": "傳道書", "chapters": 12 },
    { "abbr": "song", "id": 22, "name": "SongOfSongs", "title": "雅歌書", "chapters": 8 },
    { "abbr": "isa", "id": 23, "name": "Isaiah", "title": "以賽亞書", "chapters": 66 },
    { "abbr": "jer", "id": 24, "name": "Jeremiah", "title": "耶利米書", "chapters": 52 },
    { "abbr": "lam", "id": 25, "name": "Lamentations", "title": "耶利米哀歌", "chapters": 5 },
    { "abbr": "ezek", "id": 26, "name": "Ezekiel", "title": "以西結書", "chapters": 48 },
    { "abbr": "dan", "id": 27, "name": "Daniel", "title": "但以理書", "chapters": 12 },
    { "abbr": "hos", "id": 28, "name": "Hosea", "title": "何阿西書", "chapters": 14 },
    { "abbr": "joel", "id": 29, "name": "Joel", "title": "約珥書", "chapters": 3 },
    { "abbr": "amos", "id": 30, "name": "Amos", "title": "阿摩司書", "chapters": 9 },
    { "abbr": "obad", "id": 31, "name": "Obadiah", "title": "俄巴底亞書", "chapters": 1 },
    { "abbr": "jonah", "id": 32, "name": "Jonah", "title": "約拿書", "chapters": 4 },
    { "abbr": "mic", "id": 33, "name": "Micah", "title": "彌迦書", "chapters": 7 },
    { "abbr": "nah", "id": 34, "name": "Nahum", "title": "那鴻書", "chapters": 3 },
    { "abbr": "hb", "id": 35, "name": "Habakkuk", "title": "哈巴谷書", "chapters": 3 },
    { "abbr": "zeph", "id": 36, "name": "Zephaniah", "title": "西番雅書", "chapters": 3 },
    { "abbr": "hag", "id": 37, "name": "Haggai", "title": "哈該書", "chapters": 2 },
    { "abbr": "zech", "id": 38, "name": "Zechariah", "title": "撒迦利亞書", "chapters": 14 },
    { "abbr": "mal", "id": 39, "name": "Malachi", "title": "瑪拉基書", "chapters": 4 },
    { "abbr": "matt", "id": 40, "name": "Matthew", "title": "馬太福音", "chapters": 28 },
    { "abbr": "mark", "id": 41, "name": "Mark", "title": "馬可福音", "chapters": 16 },
    { "abbr": "luke", "id": 42, "name": "Luke", "title": "路加福音", "chapters": 24 },
    { "abbr": "john", "id": 43, "name": "John", "title": "約翰福音", "chapters": 21 },
    { "abbr": "acts", "id": 44, "name": "Acts", "title": "使徒行傳", "chapters": 28 },
    { "abbr": "rom", "id": 45, "name": "Romans", "title": "羅馬書", "chapters": 16 },
    { "abbr": "1cor", "id": 46, "name": "1 Corinthians", "title": "哥林多前書", "chapters": 16 },
    { "abbr": "2cor", "id": 47, "name": "2 Corinthians", "title": "哥林多後書", "chapters": 13 },
    { "abbr": "gal", "id": 48, "name": "Galatians", "title": "加拉太書", "chapters": 6 },
    { "abbr": "eph", "id": 49, "name": "Ephesians", "title": "以弗所書", "chapters": 6 },
    { "abbr": "php", "id": 50, "name": "Philippians", "title": "腓力比書", "chapters": 4 },
    { "abbr": "col", "id": 51, "name": "Colossians", "title": "歌羅西書", "chapters": 4 },
    { "abbr": "1thess", "id": 52, "name": "1 Thessalonians", "title": "帖撒羅尼迦前書", "chapters": 5 },
    { "abbr": "2thess", "id": 53, "name": "2 Thessalonians", "title": "帖撒羅尼迦後書", "chapters": 3 },
    { "abbr": "1tim", "id": 54, "name": "1 Timothy", "title": "提摩太前書", "chapters": 6 },
    { "abbr": "2tim", "id": 55, "name": "2 Timothy", "title": "提摩太後書", "chapters": 4 },
    { "abbr": "titus", "id": 56, "name": "Titus", "title": "提多書", "chapters": 3 },
    { "abbr": "philem", "id": 57, "name": "Philemon", "title": "腓利門書", "chapters": 1 },
    { "abbr": "heb", "id": 58, "name": "Hebrews", "title": "希伯來書", "chapters": 13 },
    { "abbr": "james", "id": 59, "name": "James", "title": "雅各書", "chapters": 5 },
    { "abbr": "1pet", "id": 60, "name": "1 Peter", "title": "彼得前書", "chapters": 5 },
    { "abbr": "2pet", "id": 61, "name": "2 Peter", "title": "彼得後書", "chapters": 3 },
    { "abbr": "1john", "id": 62, "name": "1 John", "title": "約翰一書", "chapters": 5 },
    { "abbr": "2john", "id": 63, "name": "2 John", "title": "約翰二書", "chapters": 1 },
    { "abbr": "3jonn", "id": 64, "name": "3 John", "title": "約翰三書", "chapters": 1 },
    { "abbr": "jude", "id": 65, "name": "Jude", "title": "猶大書", "chapters": 1 },
    { "abbr": "rev", "id": 66, "name": "Revelation", "title": "啟示錄", "chapters": 22 }
]

test = {}

def getSectionContents(div):
  contents = []
  verses = div.find_all("span", class_="verse")
  for verse in verses:
    verseNum = int(verse["class"][1][1:])
    hasVerseLabel = False if verse.find("span", class_="label") is None else True
    # most of time a verse contains a single content
    # sometimes a single verse is composed by many contents, we need to combine them into 1
    verseText = ""
    verseParts = verse.find_all("span", class_="content")
    for versePart in verseParts:
      if "content" in versePart["class"]: # simple text content
        verseText = verseText + versePart.string
      elif "pn" in versePart["class"]: # a name with underline
        # TODO: mark underline
        verseText = verseText + versePart.find("span", class_="content").string
      elif "qs" in versePart["class"]:
        # TODO: plasm (19) : 3, right aligned
        verseText = verseText + versePart.find("span", class_="content").string
      else:
        print("unknown class: " + versePart["class"])

    contents.append({
      "verseNum": verseNum,
      "hasVerseLabel": hasVerseLabel,
      "verseText": verseText
    })

  return contents
    

def getChapterJson(url, book_id):

  text = requests.get(url, verify=False).text
  text = "<html>" + text + "</html>"
  soup = BeautifulSoup(text, 'html.parser')

  obj = {
      "book": book_id,
      "chapter": 0,
      "sections": []
  }

  chapterDiv = soup.find("div", class_="chapter")
  divs = chapterDiv.find_all("div")
  
  for div in divs:

    # chapter label
    if "label" in div["class"]:
      chapter = div.string
      obj["chapter"] = int(chapter)

    # TODO: pre heading?
    elif "ms" in div["class"]:
      heading = div.find("span", class_="heading").string
      obj["sections"].append({ 
          "type": "pre-heading",
          "heading": heading
      })
      if "ms" not in test:
        test["ms"] = (obj["book"], obj["chapter"])

    # heading
    elif "s" in div["class"]:
      heading = div.find("span", class_="heading").string
      obj["sections"].append({ 
          "type": "heading",
          "heading": heading
      })

    # TODO: heading 2
    elif "s2" in div["class"]:
      heading = div.find("span", class_="heading").string
      obj["sections"].append({ 
          "type": "heading2",
          "heading": heading
      })
      if "s2" not in test:
        test["s2"] = (obj["book"], obj["chapter"])

    # TODO: heading in ()
    elif "sp" in div["class"]:
      section = {
        "type": "heading-ps",
        "contents": []
      }
      section["contents"] = getSectionContents(div)
      obj["sections"].append(section)
      if "sp" not in test:
        test["sp"] = (obj["book"], obj["chapter"])

    # TODO: reference heading in ()
    elif "r" in div["class"]:
      heading = div.find("span", class_="heading").string
      obj["sections"].append({
          "type": "ref-heading",
          "heading": heading
      })
      if "r" not in test:
        test["r"] = (obj["book"], obj["chapter"])

    # TODO: description (plasm)
    elif "d" in div["class"]:
      section = {
        "type": "desc",
        "contents": []
      }
      section["contents"] = getSectionContents(div)
      obj["sections"].append(section)
      if "d" not in test:
        test["d"] = (obj["book"], obj["chapter"])

    # paragraph
    elif "p" in div["class"]:
      section = {
          "type": "paragraph",
          "contents": []
      }
      section["contents"] = getSectionContents(div)
      obj["sections"].append(section)

    # line quote
    elif "q1" in div["class"]:
      section = {
        "type": "line-quote",
        "contents": []
      }
      section["contents"] = getSectionContents(div)
      obj["sections"].append(section)

    # TODO: line break, next paragraph
    elif "b" in div["class"]:
      section = {
        "type": "line-break",
        "contents": []
      }

      if "b" not in test:
        test["b"] = (obj["book"], obj["chapter"])

    # TODO: paragraph with no tab?
    elif "m" in div["class"]:
      section = {
        "type": "paragraph-no-indent",
        "contents": []
      }
      section["contents"] = getSectionContents(div)
      obj["sections"].append(section)
      if "m" not in test:
        test["m"] = (obj["book"], obj["chapter"])

    else:
      # TODO: pnxxxx, same process as "p
      # more unknown classes
      classes = div["class"]
      for claz in classes:
        if claz not in test:
          test[claz] =  (obj["book"], obj["chapter"])
      
      # parse it as a paragraph
      section = {
        "type": "paragraph",
        "contents": []
      }
      section["contents"] = getSectionContents(div)
      obj["sections"].append(section)

  return obj

BASE_URL = "https://biblebase.github.io/cunp/"
for book in bible_index:
  for chapter in range(1, book["chapters"] + 1):
    url = BASE_URL + "/" + str(book["id"]) + "/" + str(chapter) + ".htm"
    obj = getChapterJson(url, book["id"])

    # create dir
    dir = "public/json/cunp/" + str(book["id"])
    if not os.path.exists(dir):
      os.makedirs(dir)

    # write to file
    file =  dir + "/" + str(chapter) + ".json"
    with open(file, "w+", encoding='utf-8') as f:
      json.dump(obj, f, ensure_ascii=False)

# write unknown (unprocessed tags) to file
with open("public/json/cunp/log.txt", "w+") as f:
  json.dump(test, f)