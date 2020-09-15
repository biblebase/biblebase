import React from "react";
import Switch from "react-switch";
import PropTypes from "prop-types";
import classNames from "classnames";
import {  GET_VERSE_ENDPOINT, getWordJson } from "./DataFetchUtils";
import { isEmptyObject } from './Utils';
import books from './books';
import { Link } from 'react-router-dom';
import "./StudyGuide.css";


class StudyGuide extends React.Component {
  static propTypes = {
    bibleIndex: PropTypes.object.isRequired,
    menuOpen: PropTypes.bool.isRequired,
    closeMenu: PropTypes.func.isRequired
  };

  VERSION_NAMES = {
    CCB: '当代译本',
    CNV: '新譯本',
    CUNP: '和合本',
    CSBS: '标准译本'
  }

  state = {
    bookId: 0,
    chapter: 0,
    verse: 0,
    contentData: {},
    activeSection: "other-versions",
    showWordInfo: false,
    wordSequenceInOriginal: true,
    crossReferences: []
  };

  componentDidMount() {
    this.propsUpdated(this.props);
  }

  componentWillReceiveProps(props) {
    this.propsUpdated(props);
  }

  // update state
  propsUpdated = (props) => {
    const bookId = props.match.params.book? parseInt(props.match.params.book) : 1;
    const chapter = props.match.params.chapter? parseInt(props.match.params.chapter) : 1;
    const verse = props.match.params.verse? parseInt(props.match.params.verse) : 0;
    if (bookId !== this.state.bookId || chapter !== this.state.chapterData || verse !== this.state.verse) {
      this.getVerseData(bookId, chapter, verse);
    }
  }

  getVerseData = async (book, chapter, verse) => {
    let url;
    if (verse === 0)
      url = `${GET_VERSE_ENDPOINT}/${book}/${chapter}.json`;
    else
      url = `${GET_VERSE_ENDPOINT}/${book}/${chapter}/${verse}.json`;

    // 1. fetch verse reference
    let res = await fetch(url);
    const verseData = await res.json();
    
    if (verse === 0) {
      this.setState({
        contentData: verseData,
        bookId: book,
        chapter: chapter,
        verse: verse,
        crossReferences: [],
        wordObj: {},
        showWordInfo: false
      });
      return;
    }

    const verseObj = Object.entries(verseData)[0][1];

    const crDict = verseObj.analytics.thisVerse.dict.cht;
    const translations = verseObj.analytics.translations;

    // 2. for each cross referenced verse
    const crs = verseObj.analytics.crossRefs;
    let crossReferences = []; // all cross references
    for (let cr of crs) {
      const [crVerseBook, crVerseChapter, crVerseVerse] = cr.verseKey.split(".");
      let crossRef = {}; // this cross reference
      crossRef.verseKey = cr.verseKey;
      crossRef.verseAbbr = `${books[crVerseBook].short_name.cht}${crVerseChapter}:${crVerseVerse}`;
      crossRef.book = books[crVerseBook].index;
      crossRef.chapter = crVerseChapter;
      crossRef.verse = crVerseVerse;
      crossRef.verseTextEn = cr.nasb;
      crossRef.verseTextCh = cr.words.map((word) => 
        Object.assign({}, word, 
          cr.anchors[word.id] ? {anchorWordId: word.id} : {},
          cr.anchors[translations[word.id]] ? {anchorWordId: translations[word.id]} : {}
      ));

      // word map of cross referenced words
      crossRef.wordMap = {};
      for (let wordId of Object.keys(cr.anchors)) {
        if (wordId in crDict) {
          const word = crDict[wordId];
          const meaning = crossRef.verseTextCh.filter((wordObj) => {
            return wordObj.anchorWordId === wordId;
          })[0];
          if (meaning !== undefined)
            crossRef.wordMap[word] = meaning.cht;
        }
      }
      crossReferences.push(crossRef);
    }

    this.setState({
      contentData: verseData,
      bookId: book,
      chapter: chapter,
      verse: verse,
      crossReferences: crossReferences,
      showWordInfo: false
    });

    return;
  };

  getWidth = () => {
    return Math.max(
      document.body.scrollWidth,
      document.documentElement.scrollWidth,
      document.body.offsetWidth,
      document.documentElement.offsetWidth,
      document.documentElement.clientWidth
    );
  }

  /************************* handlers **********************************/

  handleMenuSelection = (event) => {
    const link = event.target;
    if (link.classList.contains("menu-item")) {
      // clicked on section link
      event.preventDefault();

      // scroll to the selected section
      let sectionId = link.getAttribute("target");
      this.setState({
        activeSection: sectionId,
      });
      let section = document.getElementById(sectionId);
      const headerHeight = 70; // offsetHeight is height of header
      const menuHeight = document.getElementById("studyguide-menu").offsetHeight; // offsetHeight is height of menu content
      const readingHeight = document.getElementsByClassName("body-left")[0].offsetHeight;
      if (this.getWidth() <= 1000) {
        document.getElementById("study-content").scrollTop = section.offsetTop - menuHeight - headerHeight - readingHeight;
      } else {
        document.getElementById("study-content").scrollTop = section.offsetTop - menuHeight - headerHeight;
      }
    }
  };

  handleWordClick = (event) => {
    event.persist();
    const wordId = event.currentTarget.dataset["wordid"];
    getWordJson(wordId).then((data) => {
      this.setState({
        wordObj: data,
        showWordInfo: true
      })
    });
  }

  handleStudyPaneClick = (event) => {
    // if menu is open and clicked outside selection, close menu
    if (this.props.menuOpen) {
      event.preventDefault();
      event.stopPropagation();
      this.props.closeMenu();
    } 
    else if (this.state.showWordInfo) {
      // TODO
      // stop propagation will prevent links
      // but I want links to work on word info, but not on rest of study guide

      // if word info is open, close 
      this.setState({
        showWordInfo: !this.state.showWordInfo
      });
    }
   }

  /**************************** render *********************************/

  renderWord = () => {
    const wordObj = this.state.wordObj;
    if (isEmptyObject(wordObj))
      return "";

    if (!("occurences" in wordObj)) {
      return (
        <div>
          <h3>詞性</h3>
          <p>{wordObj.pos}</p>
          <i>對於聖經中的名詞、動詞、形容詞、副詞，BibleBase會有詳細信息。</i>
        </div>
      )
    }
    return (
      <div>
        <h3>詞性</h3>
        <p>{wordObj.pos}</p>
        <h3>聖經中出現次數</h3>
        <p>{`共${wordObj.occurences}次`}</p>
        <h3>上下文意思</h3>
        <p>{`共${wordObj.meaningsCount}種`}</p>
        <table>
          <tbody>
            {Object.keys(wordObj.meanings).map((key) => (
              <tr key={key}>
                <td>
                  <b>{key}</b>
                </td>
                <td>{`${wordObj.meanings[key]}次`}</td>
              </tr>
            ))}
          </tbody>
        </table>        
        <h3>原文上下文舉例</h3>
        {Object.keys(wordObj.translits).map((word) => {
          const verses = Object.keys(wordObj.translits[word]);
          return (
            <div key={word}>
              <h4>{word}</h4>
              <table>
                <tbody>
                  {verses.map( (verse, index) => {
                    let [b, c, v] = verse.split('.');
                    v = v.split('|')[0];
                    const book = books[b].index;
                    const list = wordObj.translits[word][verse];
                    return (
                      <tr key={index}>
                        <td>
                          <Link to={`/biblebase/${book}/${c}/${v}`}
                                className={classNames({
                                  "verseLink": true,
                                  "disable-link": this.props.menuOpen
                                })}
                          >
                            {`${books[b]["short_name"].cht} ${c}:${v}`}
                          </Link>
                        </td>
                        <td>
                          <i><span>...</span><span>{list[0]}</span><span> </span><b>{list[1]}</b><span> </span><span>{list[2]}</span><span>...</span></i>
                        </td>
                      </tr>
                    )
                  })}
                  
                </tbody>
              </table>
            </div>
          )
        })}
      </div>
    );
  }

  renderChapterData() {
    // no verse selected
    const reference = Object.entries(this.state.contentData)[0][1];
    return (
      <div id="study-guide" onClickCapture={this.handleStudyPaneClick}>
        <div id="study-content-no-menu">
          <div id="sermons" className={classNames("section", {
              dim: reference.sermons === undefined || reference.sermons.length === 0})}>
            <div className="section-heading">證道與讀經班</div>
            <div className="section-description">CBCWLA教會歷年來的證道內容，以及三年一輪的讀經班所用的講義。</div>
            <div className="section-content">
              {reference.sermons === undefined || 
               reference.sermons.length === 0 ||
               (reference.sermons.map((sermon) => (
                <div className="sermon-block" key={sermon.id}>
                  <div className="title">{sermon.title}</div>
                  <div className="author">{sermon.preacher}</div>
                  <div className="date">{sermon.date}</div>
                  {sermon.audio === undefined ||
                   (<audio className="sermon-audio" controls>
                      <source src={sermon.audio} type="audio/mpeg" />Your browser does not support the audio element.</audio>
                  )}
                  {sermon.slides === undefined ||
                   (<div className="sermon-slides">
                      <a href={sermon.slides} target="_blank" rel="noopener noreferrer">Slides</a>
                    </div>
                  )}
                </div>)
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const bookId = this.state.bookId;
    const chapter = this.state.chapter;
    const verse = this.state.verse;
    const contentData = this.state.contentData;

    if (bookId === 0)
      return <div></div>

      // if no content data or content data is not current
    if (isEmptyObject(contentData)) {
      this.getVerseData(bookId, chapter, verse);
      return <div></div>;
    }

    if (verse === 0) return this.renderChapterData();

    const verseObject = Object.entries(contentData)[0][1];
    const bookTitle = this.getWidth() > 1000 ?
      this.props.bibleIndex[bookId].title
      :
      books[this.props.bibleIndex[bookId].abbr].short_name.cht;
  
    const title = `${bookTitle} ${chapter} : ${verse}`;

    const words = this.state.wordSequenceInOriginal
      ? verseObject.words
      : [...verseObject.words].sort((a, b) => a.index_cht - b.index_cht);
    const dedupedWords = this.state.wordSequenceInOriginal
      ? words
      : words.map((w, idx) =>
        (idx > 1 && words[idx-1].index_cht === w.index_cht)
        ? Object.assign({}, w, {cht: '~'})
        : w
        )

    return (
      <div id="study-guide" onClickCapture={this.handleStudyPaneClick}>
        {/* Menu */}
        <nav id="studyguide-menu">
          <div className="menu-heading">{title.toUpperCase()}</div>
          <div className="menu-items" onClickCapture={this.handleMenuSelection}>
            <div
              id="mi-other-versions"
              target="other-versions"
              selected={true}
              className={classNames("menu-item", {
                dim:
                  verseObject.versions === undefined ||
                  isEmptyObject(verseObject.versions),
                "active-menu-item":
                  this.state.activeSection === "other-versions",
              })}
            >
              聖經版本
            </div>
            <div
              id="mi-words"
              target="words"
              className={classNames("menu-item", {
                dim:
                  verseObject.words === undefined ||
                  verseObject.words.length === 0,
                "active-menu-item": this.state.activeSection === "words",
              })}
            >
              逐詞翻譯
            </div>
            <div
              id="mi-sermons"
              target="sermons"
              className={classNames("menu-item", {
                dim:
                  verseObject.sermons === undefined ||
                  verseObject.sermons.length === 0,
                "active-menu-item": this.state.activeSection === "sermons",
              })}
            >
              證道與讀經班
            </div>
            <div
              id="mi-analytics"
              target="analytics"
              className={classNames("menu-item", {
                dim:
                  verseObject.analytics === undefined ||
                  isEmptyObject(verseObject.analytics),
                "active-menu-item": this.state.activeSection === "analytics",
              })}
            >
              相關經文
            </div>
          </div>
        </nav>

        {/* content */}
        <div id="study-content">
          {/* Other versions */}
          <div
            id="other-versions"
            className={classNames("section", {
              dim:
                verseObject.versions === undefined ||
                isEmptyObject(verseObject.versions),
            })}
          >
            <div className="section-heading">聖經版本</div>
            <div className="section-description">
              中英文各選取三個常用版本。
            </div>
            <div className="section-content">
              {verseObject.versions === undefined ||
                isEmptyObject(verseObject.versions) || (
                  <table>
                    <tbody>
                      {Object.entries(verseObject.versions).map(
                        ([key, version]) => (
                          <tr className="version" key={version.version_id}>
                            <td className="version-name">
                              {this.VERSION_NAMES[version.version_id] ||
                                version.version_id}
                            </td>
                            <td className="version-content">{version.text}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                )}
            </div>
          </div>

          {/* Words */}
          <div
            id="words"
            className={classNames("section", {
              dim:
                verseObject.words === undefined ||
                verseObject.words.length === 0,
            })}
          >
            <div className="section-heading">
              逐詞翻譯
              <span style={{ float: "right", "fontSize": "60%" }}>
                <span>中文語序</span>
                <span style={{ margin: "10px" }}>
                  <Switch
                    checked={this.state.wordSequenceInOriginal}
                    onColor="#aaa"
                    onHandleColor="#333"
                    uncheckedIcon={false}
                    checkedIcon={false}
                    height={16}
                    width={36}
                    onChange={(checked) => {
                      this.setState({ wordSequenceInOriginal: checked });
                    }}
                  />
                </span>
                <span>原文語序</span>
              </span>
            </div>
            <div className="section-description">
              根據聖經原文（舊約希伯來文，新約希臘文）逐詞的翻譯，英文靠近NASB版本，中文靠近和合本。
            </div>
            <div className="section-content words-table">
              {dedupedWords.map((word, index) => (
                <div className="word-cell" key={index}>
                  <div
                    className="translit"
                    data-wordid={word.id}
                    onClickCapture={this.handleWordClick}
                  >
                    {word.translit ? (
                      <span
                        className={classNames("word-link", {
                          "disable-link": this.props.menuOpen,
                        })}
                      >
                        {word.translit}
                      </span>
                    ) : (
                      <span>-</span>
                    )}
                  </div>
                  <div className="original">{word[word.lang] || '-'}</div>
                  <div className="eng">{word.eng || '-'}</div>
                  <div className="cht">
                    {word.cht || '-'}
                    {this.state.wordSequenceInOriginal ? (
                      <span />
                    ) : (
                      <span className="punctCht">{word.punct_cht}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sermons */}
          <div
            id="sermons"
            className={classNames("section", {
              dim:
                verseObject.sermons === undefined ||
                verseObject.sermons.length === 0,
            })}
          >
            <div className="section-heading">證道與讀經班</div>
            <div className="section-description">
              CBCWLA教會歷年來的證道內容，以及三年一輪的讀經班所用的講義。
            </div>
            {verseObject.sermons === undefined ||
              verseObject.sermons.length === 0 || (
                <div className="section-content">
                  {verseObject.sermons.map((sermon) => (
                    <div className="sermon-block" key={sermon.id}>
                      <div className="title">{sermon.title}</div>
                      <div className="author">{sermon.preacher}</div>
                      <div className="date">{sermon.date}</div>
                      {sermon.audio === undefined || (
                        <audio className="sermon-audio" controls>
                          <source src={sermon.audio} type="audio/mpeg" />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                      {sermon.slides === undefined || (
                        <div className="sermon-slides">
                          <a
                            href={sermon.slides}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Slides
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
          </div>

          {/* Analytics */}
          <div
            id="analytics"
            className={classNames("section", {
              dim:
                verseObject.analytics === undefined ||
                isEmptyObject(verseObject.analytics),
            })}
          >
            <div className="section-heading">相關經文（實驗功能）</div>
            <div className="section-description">
              根據相同的原文詞根串珠，並根據原詞的詞頻排序。
            </div>
            <div className="section-content">
              {verseObject.analytics === undefined ||
                isEmptyObject(verseObject.analytics) || (
                  <table>
                    <tbody>
                      {this.state.crossReferences.map((cr) => (
                        <tr className="cross-reference" key={cr.verseKey}>
                          <td className="cr-verseKey-col">
                            <Link
                              to={`/biblebase/${cr.book}/${cr.chapter}/${cr.verse}`}
                              className={classNames({
                                "disable-link": this.props.menuOpen,
                              })}
                            >
                              {cr.verseAbbr}
                            </Link>
                          </td>
                          <td className="cr-verse-col">
                            <p>
                            {cr.verseTextCh.map((word, idx) => (
                              <span key={idx}>
                                { word.anchorWordId
                                  ? <b>{word.cht}</b>
                                  : <span>{word.cht}</span>

                                }{
                                  word.punct_cht && <span>{word.punct_cht}</span>
                                }
                              </span>
                            ))}
                            </p>
                            <p className="cr-verse-lang2">{ cr.verseTextEn }</p>
                          </td>
                          <td className="cross-ref-words-col">
                            {Object.keys(cr.wordMap).map((key) => (
                              <div
                                key={key}
                              >{`${key} ↔ ${cr.wordMap[key]}`}</div>
                            ))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>
          </div>

          {/* Hymns */}
          <div
            id="hymns"
            className={classNames("section", {
              dim:
                verseObject.hymns === undefined ||
                verseObject.hymns.length === 0,
            })}
          >
            <div className="section-heading">詩歌</div>
            <div className="section-content">
              {verseObject.hymns === undefined ||
                verseObject.hymns.length === 0 ||
                verseObject.hymns.map((hymn) => (
                  <div className="hymn block" key={hymn.id}>
                    <div className="hymn-title title">{hymn.title}</div>
                    <div className="hymn-description desc">
                      {hymn.description}
                    </div>
                    <div className="video-wrapper">
                      <iframe
                        className="iframe"
                        id={`youtube_${hymn.id}`}
                        title={hymn.title}
                        type="text/html"
                        width="100vmin"
                        height="100vmin"
                        src={`https://www.youtube.com/embed/${hymn.youtube_id}?autoplay=0&origin=http://example.com"`}
                        frameBorder="0"
                      ></iframe>
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div
            id="word-lookup"
            className={classNames({ hidden: !this.state.showWordInfo })}
          >
            {this.state.wordObj && this.state.showWordInfo
              ? this.renderWord()
              : ""}
          </div>
        </div>
      </div>
    );
  }
}

export default StudyGuide;
