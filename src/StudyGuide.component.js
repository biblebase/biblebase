import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import {  getWordHtml, GET_VERSE_ENDPOINT } from "./DataFetchUtils";
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

  state = {
    bookId: 0,
    chapter: 0,
    verse: 0,
    contentData: {},
    activeSection: "other-versions",
    showWordInfo: false,
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
    if (bookId !== this.state.bookId || chapter !== this.state.chapterData) {
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
        crossReferences: []
      });
      return;
    }

    const verseObj = Object.entries(verseData)[0][1];
    // console.log(verseObj);

    const crDict = verseObj.analytics.thisVerse.dict;

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
      crossRef.verseTextCh = cr.cunp;

      // word map of cross referenced words
      crossRef.wordMap = {};
      for (let wordId of Object.keys(cr.anchors)) {
        if (wordId in crDict) {
          const word = crDict[wordId];
          const meaning = cr.words.filter((wordObj) => {
            return wordObj.id === wordId;
          })[0].eng;
          crossRef.wordMap[word] = meaning;
        }
      }
      crossReferences.push(crossRef);
    }

    this.setState({
      contentData: verseData,
      bookId: book,
      chapter: chapter,
      verse: verse,
      crossReferences: crossReferences
    });
  };

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
      const menuHeight = document.getElementById("menu").offsetHeight; // offsetHeight is height of menu content
      document.getElementById("study-content").scrollTop =
        section.offsetTop - menuHeight;
    }
  };

  handleWordClick = (event) => {
    event.persist();
    const wordId = event.currentTarget.dataset["wordid"];
    // get html for word info
    getWordHtml(wordId).then((text) => {
      // TODO this is not ideal as I'm inserting html and not JSX, I don't have <Link>, but <a href> instead.
      // This mean page will reload when clicked on referenced links
      const regex = /href="\/#/gmi
      let html = text.replace(regex, `href="/bible/`);
      document.getElementById("word-lookup").innerHTML = html; 
      this.setState({
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
    } else if (this.state.showWordInfo) {
      // if word info is open, close
      event.stopPropagation();
      this.setState({
        showWordInfo: !this.state.showWordInfo
      });
    }
   }

  /**************************** render *********************************/

  renderChapterData() {
    // no verse selected
    const reference = Object.entries(this.state.contentData)[0][1];
    return (
      <div id="study-guide" onClickCapture={this.handleStudyPaneClick}>
        <div id="study-content">
          <div id="sermons" className={classNames("section", {
              dim: reference.sermons === undefined || reference.sermons.length === 0})}>
            <div className="section-heading">證道與讀經班</div>
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
    const bookTitle = this.props.bibleIndex[bookId].title;
    const title = `${bookTitle} ${chapter} : ${verse}`;

    return (
      <div id="study-guide" onClickCapture={this.handleStudyPaneClick}>

        {/* Menu */}
        <nav id="menu">
          <div className="menu-heading">{title.toUpperCase()}</div>
          <div className="menu-items" onClickCapture={this.handleMenuSelection}>
            <div id="mi-other-versions" target="other-versions" selected={true}
              className={classNames("menu-item", {
                dim: verseObject.versions === undefined || isEmptyObject(verseObject.versions),
                "active-menu-item": this.state.activeSection === "other-versions"})}>聖經版本</div>
            <div id="mi-words" target="words"
              className={classNames("menu-item", {
                dim: verseObject.words === undefined || verseObject.words.length === 0,
                "active-menu-item": this.state.activeSection === "words"})}>逐詞翻譯</div>
            <div id="mi-sermons" target="sermons"
              className={classNames("menu-item", {
                dim: verseObject.sermons === undefined || verseObject.sermons.length === 0,
                "active-menu-item": this.state.activeSection === "sermons"})}>證道與讀經班</div>
            <div id="mi-interpretations" target="interpretations"
              className={classNames("menu-item", {
                dim: verseObject.interpretations === undefined || verseObject.interpretations.length === 0,
                "active-menu-item": this.state.activeSection === "interpretations"})}>解經</div>
            <div id="mi-analytics" target="analytics" 
              className={classNames("menu-item", {
                dim: verseObject.analytics === undefined || isEmptyObject(verseObject.analytics),
                "active-menu-item": this.state.activeSection === "analytics"})}>相關經文</div>
          </div>
        </nav>

        {/* content */}
        <div id="study-content">

          {/* Other versions */}
          <div id="other-versions" className={classNames("section", {
            dim: verseObject.versions === undefined || isEmptyObject(verseObject.versions)})}>
            <div className="section-heading">聖經版本</div>
            <div className="section-content">
              {verseObject.versions === undefined || isEmptyObject(verseObject.versions) ||
              (<table>
                <tbody>
                  {Object.entries(verseObject.versions).map(
                    ([key, version]) => (
                      <tr className="version" key={version.version_id}>
                        <td className="version-name">{version.version_id}</td>
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
          <div id="words" className={classNames("section", {
            dim: verseObject.words === undefined || verseObject.words.length === 0})}>
            <div className="section-heading">逐詞翻譯</div>
            <div className="section-content words-table">
              {verseObject.words === undefined || verseObject.words.length === 0 ||
              (verseObject.words.map((word, index) => (
                <div className="word-cell" key={index}>
                  <div className="translit" data-wordid={word.id} onClickCapture={this.handleWordClick}>
                    <span className="word-link">{word.translit}</span>
                  </div>
                  <div className="greek">{word.greek}</div>
                  <div className="eng">{word.eng}</div>
                </div>
              )))}
            </div>
          </div>

          {/* Sermons */}
          <div id="sermons" className={classNames("section", {
              dim: verseObject.sermons === undefined || verseObject.sermons.length === 0 })}>
            <div className="section-heading">證道與讀經班</div>
            {verseObject.sermons === undefined || verseObject.sermons.length === 0 ||
              (<div className="section-content">
                {verseObject.sermons.map((sermon) => (
                  <div className="sermon-block" key={sermon.id}>
                    <div className="title">{sermon.title}</div>
                    <div className="author">{sermon.preacher}</div>
                    <div className="date">{sermon.date}</div>
                    {sermon.audio === undefined || 
                      (<audio className="sermon-audio" controls>
                        <source src={sermon.audio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>)
                    }
                    {sermon.slides === undefined ||
                      (<div className="sermon-slides">
                        <a href={sermon.slides} target="_blank" rel="noopener noreferrer">Slides</a>
                      </div>
                      )
                    }
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interpretations */}
          <div id="interpretations" className={classNames("section", {
              dim: verseObject.interpretations === undefined || verseObject.interpretations.length === 0})}>
            <div className="section-heading">解經</div>
            <div className="section-content">
              {verseObject.interpretations === undefined || verseObject.interpretations.length === 0 || 
                (Object.entries(verseObject.interpretations).map((entry) => (
                <div className="sub-section" key={entry[0]}>
                  <div className="title">{entry[1].title}</div>
                  <div className="author">{entry[1].author}</div>
                  {entry[1].content.map((content, index) => (
                    <div className="paragraph-block" key={index}>
                      {content.paragraphs.map((para, i) => (
                        <p key={i} className="paragraph">{para}</p>
                      ))}
                    </div>
                  ))}
                </div>
              )))}
            </div>
          </div>

          {/* Analytics */}
          <div id="analytics" className={classNames("section", {
              dim: verseObject.analytics === undefined || isEmptyObject(verseObject.analytics)})}>
            <div className="section-heading">相關經文</div>
            <div className="section-content">
              {verseObject.analytics === undefined || isEmptyObject(verseObject.analytics) ||
                (<table>
                  <tbody>
                    {this.state.crossReferences.map((cr) => (
                      <tr className="cross-reference" key={cr.verseKey}>
                        <td className="cr-verseKey-col">
                          <Link to={`/bible/${cr.book}/${cr.chapter}/${cr.verse}`}>{cr.verseAbbr}</Link>
                        </td>
                        <td className="cr-verse-col">{cr.verseTextCh}</td>
                        <td className="cross-ref-words-col">
                          {Object.keys(cr.wordMap).map((key) => (
                            <div key={key}>{`${key} ↔ ${cr.wordMap[key]}`}</div>
                          ))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>)
              }
            </div>
          </div>

          {/* Hymns */}
          <div id="hymns" className={classNames("section", {
              dim: verseObject.hymns === undefined || verseObject.hymns.length === 0})}>
            <div className="section-heading">詩歌</div>
            <div className="section-content">
              {verseObject.hymns === undefined || verseObject.hymns.length === 0 ||
              (verseObject.hymns.map((hymn) => (
                <div className="hymn block" key={hymn.id}>
                  <div className="hymn-title title">{hymn.title}</div>
                  <div className="hymn-description desc">
                    {hymn.description}
                  </div>
                  <div className="video-wrapper">
                    <iframe className="iframe" id={`youtube_${hymn.id}`} title={hymn.title} type="text/html" width="100vmin" height="100vmin"
                      src={`https://www.youtube.com/embed/${hymn.youtube_id}?autoplay=0&origin=http://example.com"`}
                      frameBorder="0"></iframe>
                  </div>
                </div>
              )))}
            </div>
          </div>
          <div id="word-lookup" className={classNames({ hidden: !this.state.showWordInfo })}>
          </div>
        </div>
      </div>
    );
  }
}

export default StudyGuide;
