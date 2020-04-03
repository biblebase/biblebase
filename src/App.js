import React from 'react';
import BibleSelect from './BibleSelect.component';
import ReadingPane from './ReadingPane.component';
import StudyGuide from './StudyGuide.component';
import './App.css';

class BibleApp extends React.Component {

  bibleIndex = {
    gen: { title: "創世記", chapters: 50 },
    ex: { title: "出埃及記", chapters: 40 },
    lev: { title: "利未記", chapters: 27 },
    num: { title: "民數記", chapters: 36 },
    deut: { title: "申命記", chapters: 34 },
    josh: { title: "約書亞記", chapters: 24 },
    judg: { title: "士師記", chapters: 21 },
    ruth: { title: "路得記", chapters: 4 },
    sam1: { title: "撒母耳記上", chapters: 31 },
    sam2: { title: "撒母耳記下", chapters: 24 },
    king1: { title: "列王紀上", chapters: 22 },
    king2: { title: "列王記下", chapters: 25 },
    chron1: { title: "歷代志上", chapters: 29 },
    chron2: { title: "歷代志下", chapters: 36 },
    ezra: { title: "以斯拉記", chapters: 10 },
    neh: { title: "尼希米記", chapters: 13 },
    est: { title: "以斯帖記", chapters: 10 },
    job: { title: "約伯記", chapters: 42 },
    ps: { title: "詩篇", chapters: 150 },
    prov: { title: "箴言", chapters: 31 },
    eccles: { title: "傳道書", chapters: 12 },
    song: { title: "雅歌書", chapters: 8 },
    isa: { title: "以賽亞書", chapters: 66 },
    jer: { title: "耶利米書", chapters: 52 },
    lam: { title: "耶利米哀歌", chapters: 5 },
    ezek: { title: "以西結書", chapters: 48 },
    dan: { title: "但以理書", chapters: 12 },
    hos: { title: "何阿西書", chapters: 14 },
    joel: { title: "約珥書", chapters: 3 },
    amos: { title: "阿摩司書", chapters: 9 },
    obad: { title: "俄巴底亞書", chapters: 1 },
    jonah: { title: "約拿書", chapters: 4 },
    mic: { title: "彌迦書", chapters: 7 },
    nah: { title: "那鴻書", chapters: 3 },
    hb: { title: "哈巴谷書", chapters: 3 },
    zeph: { title: "西番雅書", chapters: 3 },
    hag: { title: "哈該書", chapters: 2 },
    zech: { title: "撒迦利亞書", chapters: 14 },
    mal: { title: "瑪拉基書", chapters: 4 },
    matt: { title: "馬太福音", chapters: 28 },
    mark: { title: "馬可福音", chapters: 16 },
    luke: { title: "路加福音", chapters: 24 },
    john: { title: "約翰福音", chapters: 21 },
    acts: { title: "使徒行傳", chapters: 28 },
    rom: { title: "羅馬書", chapters: 16 },
    cor1: { title: "哥林多前書", chapters: 16 },
    cor2: { title: "哥林多後書", chapters: 13 },
    gal: { title: "加拉太書", chapters: 6 },
    eph: { title: "以弗所書", chapters: 6 },
    php: { title: "腓力比書", chapters: 4 },
    col: { title: "歌羅西書", chapters: 4 },
    thess1: { title: "帖撒羅尼迦前書", chapters: 5 },
    thess2: { title: "帖撒羅尼迦後書", chapters: 3 },
    tim1: { title: "提摩太前書", chapters: 6 },
    tim2: { title: "提摩太後書", chapters: 4 },
    titus: { title: "提多書", chapters: 3 },
    philem: { title: "腓利門書", chapters: 1 },
    heb: { title: "希伯來書", chapters: 13 },
    james: { title: "雅各書", chapters: 5 },
    pet1: { title: "彼得前書", chapters: 5 },
    pet2: { title: "彼得後書", chapters: 3 },
    john1: { title: "約翰一書", chapters: 5 },
    john2: { title: "約翰二書", chapters: 1 },
    jonn3: { title: "約翰三書", chapters: 1 },
    jude: { title: "猶大書", chapters: 1 },
    rev: { title: "啟示錄", chapters: 22 },
  };

  state = {
    selectedBook: "php",
    selectedChapter: 2,
    selectedVerse: 1,
    verseReference: {}
  }

  selectBookChapter = (bookId, chapter) => {
    // TODO update the bible text
  }

  async fetchData(path) {
    const res = await fetch(path);
    const text = await res.text();    
    return JSON.parse(text);
  }
  
  // select a verse
  selectVerse = (verse) => {
    // TODO fetch and update verse object here
    this.fetchData(`./json/${verse.toLowerCase()}.json`).then( res => {
      this.setState({
        selectedVerse: verse,
        verseReference: res
      });
    });
    
    
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
