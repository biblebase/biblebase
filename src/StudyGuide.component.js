import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { getVerseJson } from "./DataFetchUtils";
import { isEmptyObject } from './Utils';
import "./StudyGuide.css";


class StudyGuide extends React.Component {
  static propTypes = {
    bibleIndex: PropTypes.object.isRequired
  };

  state = {
    bookId: 1,
    chapter: 1,
    verse: 0,
    contentData: {},
    activeSection: "other-versions",
  };

  componentWillReceiveProps(props) {
    const bookId = props.match.params.book? parseInt(props.match.params.book) : 1;
    const chapter = props.match.params.chapter? parseInt(props.match.params.chapter) : 1;
    const verse = props.match.params.verse? parseInt(props.match.params.verse) : 0;
    if (bookId !== this.state.bookId || chapter !== this.state.chapterData) {
      getVerseJson(bookId, chapter, verse).then(data => {
        this.setState({
          contentData: data,
          bookId: bookId,
          chapter: chapter,
          verse: verse
        });
      });
    }
  }

  getVerseData = (book, chapter, verse) => {
    getVerseJson(book, chapter, verse).then((data) => {
      this.setState({
        contentData: data
      });
    });
  };

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

  renderChapterData() {
    // no verse selected
    const reference = Object.entries(this.state.contentData)[0][1];
    console.log(reference);
    return (
      <div id="study-guide">
        <div id="study-content">
          <div
            id="sermons"
            className={classNames("section", {
              dim:
                reference.sermons === undefined ||
                reference.sermons.length === 0,
            })}
          >
            <div className="section-heading">證道與讀經班</div>
            <div className="section-content">
              {reference.sermons.map((sermon) => (
                <div className="sermon-block" key={sermon.id}>
                  <div className="title">{sermon.title}</div>
                  <div className="author">{sermon.preacher}</div>
                  <div className="date">{sermon.date}</div>
                  {sermon.audio ? (
                    <audio className="sermon-audio" controls>
                      <source src={sermon.audio} type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    ""
                  )}
                  {sermon.slides ? (
                    <div className="sermon-slides">
                      <a
                        href={sermon.slides}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Slides
                      </a>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    console.log("render guide");
    const bookId = this.state.bookId;
    const chapter = this.state.chapter;
    const verse = this.state.verse;
    const contentData = this.state.contentData;

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
      <div id="study-guide">
        <nav id="menu">
          <div className="menu-.section">{title.toUpperCase()}</div>
          <div className="menu-items" onClick={this.handleMenuSelection}>
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
              id="mi-interpretations"
              target="interpretations"
              className={classNames("menu-item", {
                dim:
                  verseObject.interpretations === undefined ||
                  verseObject.interpretations.length === 0,
                "active-menu-item":
                  this.state.activeSection === "interpretations",
              })}
            >
              解經
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
        <div id="study-content">
          <div
            id="other-versions"
            className={classNames("section", {
              dim:
                verseObject.versions === undefined ||
                isEmptyObject(verseObject.versions),
            })}
          >
            <div className="section-heading">聖經版本</div>
            <div className="section-content">
              <table>
                <tbody>
                  {Object.entries(verseObject.versions).map(
                    ([key, version]) => (
                      <tr className="version" key={version.version_id}>
                        <td className="version-name title">
                          {version.version_id}
                        </td>
                        <td className="version-content">{version.text}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div
            id="words"
            className={classNames("section", {
              dim:
                verseObject.words === undefined ||
                verseObject.words.length === 0,
            })}
          >
            <div className="section-heading">逐詞翻譯</div>
            <div className="section-content words-table">
              {verseObject.words.map((word, index) => (
                <div className="word-cell" key={index}>
                  <div className="translit">
                    <span className="word-link">{word.translit}</span>
                  </div>
                  <div className="greek">{word.greek}</div>
                  <div className="eng">{word.eng}</div>
                </div>
              ))}
            </div>
          </div>
          <div
            id="sermons"
            className={classNames("section", {
              dim:
                verseObject.sermons === undefined ||
                verseObject.sermons.length === 0,
            })}
          >
            <div className="section-heading">證道與讀經班</div>
            {verseObject.sermons === undefined ||
            verseObject.sermons.length === 0 ? (
              ""
            ) : (
              <div className="section-content">
                {verseObject.sermons.map((sermon) => (
                  <div className="sermon-block" key={sermon.id}>
                    <div className="title">{sermon.title}</div>
                    <div className="author">{sermon.preacher}</div>
                    <div className="date">{sermon.date}</div>
                    {sermon.audio ? (
                      <audio className="sermon-audio" controls>
                        <source src={sermon.audio} type="audio/mpeg" />
                        Your browser does not support the audio element.
                      </audio>
                    ) : (
                      ""
                    )}
                    {sermon.slides ? (
                      <div className="sermon-slides">
                        <a
                          href={sermon.slides}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Slides
                        </a>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div
            id="interpretations"
            className={classNames("section", {
              dim:
                verseObject.interpretations === undefined ||
                verseObject.interpretations.length === 0,
            })}
          >
            <div className="section-heading">解經</div>
            <div className="section-content">
              {Object.entries(verseObject.interpretations).map((entry) => (
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
              ))}
            </div>
          </div>
          <div
            id="analytics"
            className={classNames("section", {
              dim:
                verseObject.analytics === undefined ||
                isEmptyObject(verseObject.analytics),
            })}
          >
            <div className="section-heading">相關經文</div>
            <div className="section-content">{/* TODO */}</div>
          </div>
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
              {verseObject.hymns
                ? verseObject.hymns.map((hymn) => (
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
                  ))
                : ""}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StudyGuide;
