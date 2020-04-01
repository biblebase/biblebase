import React from 'react';
import BibleSelect from './BibleSelect.component';
import ReadingPane from './ReadingPane.component';
import StudyGuide from './StudyGuide.component';
import './App.css';

class BibleApp extends React.Component {

  bibleIndex = {
    1: { title: "創世記", chapters: 50 },
    2: { title: "出埃及記", chapters: 40 },
    3: { title: "利未記", chapters: 27 },
    4: { title: "民數記", chapters: 36 },
    5: { title: "申命記", chapters: 34 },
    6: { title: "約書亞記", chapters: 24 },
    7: { title: "士師記", chapters: 21 },
    8: { title: "路得記", chapters: 4 },
    9: { title: "撒母耳記上", chapters: 31 },
    10: { title: "撒母耳記下", chapters: 24 },
    11: { title: "列王紀上", chapters: 22 },
    12: { title: "列王記下", chapters: 25 },
    13: { title: "歷代志上", chapters: 29 },
    14: { title: "歷代志下", chapters: 36 },
    15: { title: "以斯拉記", chapters: 10 },
    16: { title: "尼希米記", chapters: 13 },
    17: { title: "以斯帖記", chapters: 10 },
    18: { title: "約伯記", chapters: 42 },
    19: { title: "詩篇", chapters: 150 },
    20: { title: "箴言", chapters: 31 },
    21: { title: "傳道書", chapters: 12 },
    22: { title: "雅歌書", chapters: 8 },
    23: { title: "以賽亞書", chapters: 66 },
    24: { title: "耶利米書", chapters: 52 },
    25: { title: "耶利米哀歌", chapters: 5 },
    26: { title: "以西結書", chapters: 48 },
    27: { title: "但以理書", chapters: 12 },
    28: { title: "何阿西書", chapters: 14 },
    29: { title: "約珥書", chapters: 3 },
    30: { title: "阿摩司書", chapters: 9 },
    31: { title: "俄巴底亞書", chapters: 1 },
    32: { title: "約拿書", chapters: 4 },
    33: { title: "彌迦書", chapters: 7 },
    34: { title: "那鴻書", chapters: 3 },
    35: { title: "哈巴谷書", chapters: 3 },
    36: { title: "西番雅書", chapters: 3 },
    37: { title: "哈該書", chapters: 2 },
    38: { title: "撒迦利亞書", chapters: 14 },
    39: { title: "瑪拉基書", chapters: 4 },
    40: { title: "馬太福音", chapters: 28 },
    41: { title: "馬可福音", chapters: 16 },
    42: { title: "路加福音", chapters: 24 },
    43: { title: "約翰福音", chapters: 21 },
    44: { title: "使徒行傳", chapters: 28 },
    45: { title: "羅馬書", chapters: 16 },
    46: { title: "哥林多前書", chapters: 16 },
    47: { title: "哥林多後書", chapters: 13 },
    48: { title: "加拉太書", chapters: 6 },
    49: { title: "以弗所書", chapters: 6 },
    50: { title: "腓力比書", chapters: 4 },
    51: { title: "歌羅西書", chapters: 4 },
    52: { title: "帖撒羅尼迦前書", chapters: 5 },
    53: { title: "帖撒羅尼迦後書", chapters: 3 },
    54: { title: "提摩太前書", chapters: 6 },
    55: { title: "提摩太後書", chapters: 4 },
    56: { title: "提多書", chapters: 3 },
    57: { title: "腓利門書", chapters: 1 },
    58: { title: "希伯來書", chapters: 13 },
    59: { title: "雅各書", chapters: 5 },
    60: { title: "彼得前書", chapters: 5 },
    61: { title: "彼得後書", chapters: 3 },
    62: { title: "約翰一書", chapters: 5 },
    63: { title: "約翰二書", chapters: 1 },
    64: { title: "約翰三書", chapters: 1 },
    65: { title: "猶大書", chapters: 1 },
    66: { title: "啟示錄", chapters: 22 },
  };

  versePhil_2_5 = {
    "id": "phil-2-5",
    "currentVersion": {
      "versionId": "CUNPSS神",
      "versionName": "新标点和合本神版",
      "lang": "chs",
      "description": "腓立比书2章5节",
      "short": "腓2:5",
      "text": "你们当以基督耶稣的心为心："
    },
    "otherVersions": [
      {
        "versionId": "CNVS",
        "versionName": "新译本",
        "lang": "chs",
        "description": "腓立比书2章5节",
        "short": "腓2:5",
        "text": "你们应当有这样的思想，这也是基督耶稣的思想。"
      }, {
        "versionId": "NLT",
        "versionName": "New Living Translation",
        "lang": "en",
        "description": "Philippines 2:5",
        "short": "php2:5",
        "text": "You must have the same attitude that Christ Jesus had."
      }
    ],
    "sermons": [
      {
        "id": "cbcwla-2017-07-02.1",
        "title": "認識神",
        "preacher": "陳星豪弟兄",
        "date": "2017-07-02",
        "verses": [
          "詩篇 139",
          "馬可福音 8:29-33",
          "腓立比書 2:5-11",
          "腓立比書 3:4-14"
        ],
        "linkedVerses": {
          "詩篇 139": "耶和华啊，你已经鉴察我，认识我。 我坐下，我起来，你都晓得； 你从远处知道我的意念。 我行路，我躺卧，你都细察； 你也深知我一切所行的。 耶和华啊，我舌头上的话， 你没有一句不知道的。 你在我前后环绕我， 按手在我身上。 这样的知识奇妙，是我不能测的， 至高，是我不能及的。 我往哪里去躲避你的灵？ 我往哪里逃、躲避你的面？ 我若升到天上，你在那里； 我若在阴间下榻，你也在那里。 我若展开清晨的翅膀， 飞到海极居住， 就是在那里，你的手必引导我； 你的右手也必扶持我。 我若说：黑暗必定遮蔽我， 我周围的亮光必成为黑夜； 黑暗也不能遮蔽我，使你不见， 黑夜却如白昼发亮。 黑暗和光明，在你看都是一样。 我的肺腑是你所造的； 我在母腹中，你已覆庇我。 我要称谢你，因我受造，奇妙可畏； 你的作为奇妙，这是我心深知道的。 我在暗中受造，在地的深处被联络； 那时，我的形体并不向你隐藏。 我未成形的体质，你的眼早已看见了； 你所定的日子，我尚未度一日， 你都写在你的册上了。 　神啊，你的意念向我何等宝贵！ 其数何等众多！ 我若数点，比海沙更多； 我睡醒的时候，仍和你同在。 　神啊，你必要杀戮恶人； 所以，你们好流人血的，离开我去吧！ 因为他们说恶言顶撞你； 你的仇敌也妄称你的名。 耶和华啊，恨恶你的，我岂不恨恶他们吗？ 攻击你的，我岂不憎嫌他们吗？ 我切切地恨恶他们， 以他们为仇敌。 　神啊，求你鉴察我，知道我的心思， 试炼我，知道我的意念， 看在我里面有什么恶行没有， 引导我走永生的道路。",
          "馬可福音 8:29-33": "又问他们说：「你们说我是谁？」 彼得 回答说：「你是基督。」 耶稣就禁戒他们，不要告诉人。 从此，他教训他们说：「人子必须受许多的苦，被长老、祭司长，和文士弃绝，并且被杀，过三天复活。」 耶稣明明地说这话， 彼得 就拉着他，劝他。 耶稣转过来，看着门徒，就责备 彼得 说：「撒但，退我后边去吧！因为你不体贴　神的意思，只体贴人的意思。」",
          "腓立比書 2:5-11": "你们当以基督耶稣的心为心： 他本有　神的形象， 不以自己与　神同等为强夺的； 反倒虚己， 取了奴仆的形象， 成为人的样式； 既有人的样子，就自己卑微， 存心顺服，以至于死， 且死在十字架上。 所以，　神将他升为至高， 又赐给他那超乎万名之上的名， 叫一切在天上的、地上的，和地底下的， 因耶稣的名无不屈膝， 无不口称「耶稣基督为主」， 使荣耀归与父　神。",
          "腓立比書 3:4-14": "其实，我也可以靠肉体；若是别人想他可以靠肉体，我更可以靠着了。 我第八天受割礼；我是 以色列 族、 便雅悯 支派的人，是 希伯来 人所生的 希伯来 人。就律法说，我是法利赛人； 就热心说，我是逼迫教会的；就律法上的义说，我是无可指摘的。 只是我先前以为与我有益的，我现在因基督都当作有损的。 不但如此，我也将万事当作有损的，因我以认识我主基督耶稣为至宝。我为他已经丢弃万事，看作粪土，为要得着基督； 并且得以在他里面，不是有自己因律法而得的义，乃是有信基督的义，就是因信　神而来的义， 使我认识基督，晓得他复活的大能，并且晓得和他一同受苦，效法他的死， 或者我也得以从死里复活。"
  
        },
        "audio": "http://www.cbcwla.org/media/ch/SundaySermons/2017/Sermon-2017-07-02.mp3",
        "slides": "http://www.cbcwla.org/media/ch/SundaySermons/2017/Sermon-2017-07-02.pdf"
      }, {
        "id": "cbcwla-2018-11-18.1",
        "title": "看主的心",
        "preacher": "鄭昌國牧師",
        "date": "2018-11-18",
        "verses": [
          "腓立比書 2:5-8"
        ],
        "linkedVerses": {
          "腓立比書 2:5-8": "你们当以基督耶稣的心为心：他本有　神的形象，不以自己与　神同等为强夺的；反倒虚己，取了奴仆的形象，成为人的样式；既有人的样子，就自己卑微，存心顺服，以至于死，"
        },
        "audio": "http://www.cbcwla.org/media/ch/SundaySermons/2018/Sermon-2018-11-18.mp3"
      }
    ],
    "sundaySchoolClasses": [
      {
        "id": "bible-reading-2016-02-12.1",
        "title": "腓立比書 2",
        "preacher": "王文堂牧師",
        "date": "2018-11-18",
        "slides": "http://cbcwla.org/media/ch/Special/GraceFellowship2016/Grace-Philippians-ch2.pdf",
        "page": 15
      }
    ],
    "interpretations": [
      {
        "id": "chenzhongdao",
        "title": "新约书信读经讲义",
        "author": "陈终道",
        "url": "http://www.godcom.net/chajing/New%20Testament/50Phil/50JT02.htm",
        "text": "１．基督的心（2:5）\n\n5 在此我们先要注意的是第5节，“你们当以基督耶稣的心为心”。这“心”是心思的意思，英文译作mind。使徒提醒信徒，应当以基督耶稣的心思为心思，让那在基督里面的心思也在信徒里面，这是合一生活的要诀。信徒若各人坚持自己的意见和主张，结果必定不能同心，但若各人都以基督的心为心，便很自然地“有一样的心思，有一样的意念”了。上文提到信徒在基督里的各种劝勉、安慰、交通、同情、不结党、不贪虚荣、不骄傲、不自私、彼此相顾等，这种完美的肢体生活怎能实现呢？乃是“要以基督耶稣的心为心”。从新约的记载中，可见基督耶稣的心是：\nＡ．柔和的心（太11:28-30）\n祂不因人的弃绝而动怒。当祂行了许多神迹，而那几城中的人仍不归信祂时，祂并不颓丧或恼怒，反而流露出祂那种满有安息、柔和、谦卑的心情，并呼召罪人说：“凡劳苦担重担的人，可以到我这里来，我就使你们得安息。”\nＢ．赦免的心（路7:36-50）\n祂喜欢赦免人，不是喜欢定人的罪。当祂在法利赛人西门家坐席时，对那在祂脚前流泪的有罪女子说：“你的罪赦免了……平平安安的去罢”（路7:48-50）。当人们将一个正在行淫时被捉拿的妇人带到祂跟前，想用石头打死她时，祂却使那些人惭愧退去，然后对那女人说：“没有人定你的罪么？……我也不定你的罪；去罢！从此不要再犯罪了”（约8:10-11）。当那十字架旁的强盗呼求祂说“耶稣阿，你得国降临的时候，求你记念我”时，祂便立刻应允他说：“我实在告诉你，今日你要同我在乐园里了”（路23:42-43）。\nＣ．救人的心（路9:51-56）\n当撒玛利亚人不肯接待他们时，约翰、雅各求耶稣让他们从天上降火烧灭他们，像以利亚所行的。祂却责备他们说：“你们的心如何，你们并不知道。人子来不是要灭人的性命，是要救人的性命。”\nＤ．以父的事为念的心（路2:49）\n祂一心求父的喜悦，不求自己的荣耀（约17:1-4），祂定意面向耶路撒冷，不逃避神所要给祂的苦杯（路9:51;太26:42,46）。信徒也该效法主的榜样，凡事要讨那察验我们心的神喜欢（帖前2:4）。\nＥ．憎恶伪善的心（太20:3）\n祂责法利赛人的假冒为善时，用了祂生平所说的话中最严厉的话，可见假冒为善的行事，是祂所最憎恶的。祂教训门徒要用心灵诚实敬拜神（约4:23），而祂自己的名称为“诚信真实”，在祂口中没有诡诈（启3:14;赛53:9），祂喜爱公义，恨恶罪恶（来1:9）。\nＦ．体恤软弱的心（来4:15）\n祂豫先警告门徒将因祂跌倒，需要儆醒（太26:31）；又在彼得未曾三次否认祂之前，便为他祷告，使他不致失去信心（参路22:31-32）；祂复活之后屡次向门徒显现，坚固他们的心（徒1:3）。祂是顾念我们各种软弱的主。\nＧ．求父的旨意成就的心（太26:39）\n祂在客西马尼园的几次祷告中，都是愿父的旨意成就；在传道时，以神的旨意为食物（约4:34）；祂对犹太人说：“我不求自己的意思，只求那差我来者的意思”（约5:30;参约7:16-18）。\n以上不过是从圣经的记载中选出几个例子，略为说明基督的心是作样的。总之，神一切的美好、圣洁、慈爱、温柔、良善的性情，都包括在基督耶稣的心中。信徒要是以基督的心为心，以基督的思想为思想，就必在生命上像祂，且在肢体生活上能与弟兄姊妹同心合意。",
        "linkedVerses": {
          "太11:28-30": "凡劳苦担重担的人可以到我这里来，我就使你们得安息。 我心里柔和谦卑，你们当负我的轭，学我的样式；这样，你们心里就必得享安息。 因为我的轭是容易的，我的担子是轻省的。」",
          "路7:36-50": "有一个法利赛人请耶稣和他吃饭；耶稣就到法利赛人家里去坐席。 那城里有一个女人，是个罪人，知道耶稣在法利赛人家里坐席，就拿着盛香膏的玉瓶， 站在耶稣背后，挨着他的脚哭，眼泪湿了耶稣的脚，就用自己的头发擦干，又用嘴连连亲他的脚，把香膏抹上。 请耶稣的法利赛人看见这事，心里说：「这人若是先知，必知道摸他的是谁，是个怎样的女人；乃是个罪人。」 耶稣对他说：「 西门 ！我有句话要对你说。」 西门 说：「夫子，请说。」 耶稣说：「一个债主有两个人欠他的债；一个欠五十两银子，一个欠五两银子； 因为他们无力偿还，债主就开恩免了他们两个人的债。这两个人哪一个更爱他呢？」 西门 回答说：「我想是那多得恩免的人。」耶稣说：「你断的不错。」 于是转过来向着那女人，便对 西门 说：「你看见这女人吗？我进了你的家，你没有给我水洗脚；但这女人用眼泪湿了我的脚，用头发擦干。 你没有与我亲嘴；但这女人从我进来的时候就不住地用嘴亲我的脚。 你没有用油抹我的头；但这女人用香膏抹我的脚。 所以我告诉你，她许多的罪都赦免了，因为她的爱多；但那赦免少的，他的爱就少。」 于是对那女人说：「你的罪赦免了。」 同席的人心里说：「这是什么人，竟赦免人的罪呢？」 耶稣对那女人说：「你的信救了你；平平安安回去吧！」"
        }
      }, {
        "id": "fengsheng",
        "title": "丰盛生命研读本",
        "url": "http://www.godcom.net/chajing/New%20Testament/50Phil/50%E4%B8%B0%E7%9B%9B%E7%94%9F%E5%91%BD%E7%A0%94%E8%AF%BB%E6%9C%AC/50JT02.htm",
        "text":"你们当以基督耶稣的心为心：保罗指出耶稣离开天上无比的荣耀，反而取了奴仆羞辱的形象，为他人而顺服至死(5~8节)。基督的门徒也必须有基督谦卑的心肠。他们蒙召原是为了过一个舍己奉献、忘我无私并且关心和帮助他人的生活。"
      }
    ],
    "hymns": [
      {
        "id": "uaMRBhZ1A8s",
        "title": "基督的心",
        "publisher": "sbf2148",
        "description":"你們當以基督耶穌的心為心。腓2:5",
        "url": "https://www.youtube.com/watch?v=uaMRBhZ1A8s",
        "youtube_id": "uaMRBhZ1A8s"
      }, {
        "id": "Q047iJYVST4",
        "title": "把冷漠變成愛 - 讚美之泉",
        "publisher": "翁偉秦",
        "description": "本音樂版權為讚美之泉音樂事工所有，影片僅供教會主日及小組敬拜使用，切勿使用於商業行為中。\n\n樂團\n：讚美之泉專輯\n：全新的你\n歌詞\n：你的眼　是否\n被太多美麗的事物迷惑你的心　是否被太多紛雜的世俗綁鎖\n分些\n關懷給角落中受傷的靈魂分些\n愛給那些不起眼的面孔\n以基\n督的心為心　以祂的眼看世界你身\n邊的人需要你我　把冷漠變成愛\n以基\n督的心為心　以祂的眼看世界這世界需要你我　把冷漠變成愛",
        "url": "https://www.youtube.com/watch?v=Q047iJYVST4",
        "youtube_id": "Q047iJYVST4"
      }
    ],
    "notes": [
      {
        "id": "forrest-2019-09-02-1",
        "time": "2019-09-02T16:00:03T",
        "author": "Forrest Cao",
        "text": "第5节以基督耶稣的心为心，后面一直到11节都是讲什么是基督的心，但我发现这节跟前面4节的联系也很紧密，不是断开讲另一件事。前面一二节讲Koinonia，三四节讲教会里不要怎样怎样，其实就是告诉我们，教会合一、教会之所以成为神的教会、而不是什么社会组织，秘诀就是以基督的心为心。",
        "likes": [
          {
            "id": "like-forrest-2019-09-02-1.lisal",
            "by": "lisal",
            "time": "2019-09-03T15:10:23T"
          }
        ],
        "comments": [
          {
            "id": "comment-forrest-2019-09-02-1.lisal.1",
            "by": "lisal",
            "time": "2019-09-03T15:10:23T",
            "text": "对哦"
          }
        ]
      }
    ]
  }

  state = {
    selectedBook: "50",
    selectedChapter: 2,
    selectedVerse: null,
    verseReference: {}
  }

  selectBookChapter = (bookId, chapter) => {
    // TODO update the bible text
  }
  
  // select a verse
  selectVerse = (verse) => {
    // TODO fetch and update verse object here
    let verseReference = (verse !== "PHP.2.5")? {
      id: verse
    } : this.versePhil_2_5;
    
    this.setState({
      selectedVerse: verse,
      verseReference: verseReference
    })
  }

  render(){
    return (
      <div className="bible-app">
        <div className="left">
          <div id="book-select">
            <BibleSelect 
                bookId={this.state.selectedBook} 
                chapter={this.state.selectedChapter} 
                bibleIndex={this.bibleIndex}
                selectBookChapter={this.selectBookChapter}/>
          </div>
          <div id="reading-pane">
            <ReadingPane selectVerse={this.selectVerse}/>
          </div>
          
        </div>
        <div className="right">
          <StudyGuide verseReference={this.state.verseReference} />
        </div>
        
      </div>
    );
  }
}

export default BibleApp;
