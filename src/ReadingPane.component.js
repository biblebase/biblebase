import React from "react";
import './ReadingPane.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { getBookChapterJson } from './DataFetchUtils';
import { Link } from 'react-router-dom';
import { isEmptyObject } from './Utils';

class ReadingPane extends React.Component {

  static propTypes = {
    bibleIndex: PropTypes.object.isRequired,
    menuOpen: PropTypes.bool.isRequired,
    closeMenu: PropTypes.func.isRequired
  }

  state = {
    bookId: 0,
    chapter: 0, 
    verse: 0,
    chapterData: {}
  }

  componentDidMount() {
    this.propsUpdated(this.props);
  }

  /* 
   * When props changes (when routing has changed), we need to catch is and update the state
   * so that it will cause updates to relevent elements in the UI. If we skip this part, 
   * the whole componenet is re-rendered when routing changes
   */
  componentWillReceiveProps(props) {
    this.propsUpdated(props);
  }

  // update current state when props change
  propsUpdated = (props) => {
    const bookId = props.match.params.book? parseInt(props.match.params.book) : 1;
    const chapter = props.match.params.chapter? parseInt(props.match.params.chapter) : 1;
    const verse = props.match.params.verse? parseInt(props.match.params.verse) : 0;
    if (bookId !== this.state.bookId || chapter !== this.state.chapterData) {
      getBookChapterJson(bookId, chapter).then(data => {
        this.setState({
          chapterData: data,
          bookId: bookId,
          chapter: chapter,
          verse: verse
        });
      });
    }
  }

  getBookData = (book, chapter) => {
    getBookChapterJson(book, chapter).then(data => {
      this.setState({
        chapterData: data
      });
    });
  }

  handleReadingPaneClick = (event) => {
    // if menu is open and clicked outside selection, close menu
    if (this.props.menuOpen) {
      event.preventDefault();
      event.stopPropagation();
      this.props.closeMenu();
    }
  }

  renderSection = (section, key) => {
    const bookId = this.state.bookId;
    const chapter = this.state.chapter;
    const verse = this.state.verse;

    if ("heading" in section) { // heading section
      return (
        <div className={`heading ${section.type}`} key={key}>{section.heading}</div>
      )
    } else { // content section
      return (
        <div className={`section ${section.type}`} key={key}>
          {section.contents.map( (content, index) => (
            <span className="section-content" key={index}>
              { "hasVerseLabel" in content &&  content.hasVerseLabel? <span className="label">{content.verseNum}</span> : ""}
              <Link to={content.verseNum === verse? `/bible/${bookId}/${chapter}` : `/bible/${bookId}/${chapter}/${content.verseNum}`}
                    className={classNames({"disable-link": this.props.menuOpen})} >
                <span data-verse={content.verseNum} className={classNames("verse", {selected: content.verseNum === verse})} >
                  {content.verseText}
                </span>
              </Link>
            </span>
            
          ))}
        </div>
      )
    }
  }

  render() {
    const bookId = this.state.bookId;
    const chapter = this.state.chapter;
    // const verse = this.state.verse;
    const chapterData = this.state.chapterData;

    if (bookId === 0)
      return <div></div>

    // data has not been loaded
    if (isEmptyObject(chapterData) || 
        chapterData.book !== bookId || chapterData.chapter !== chapter) {
      this.getBookData(bookId, chapter);
      return <div></div>
    }

    const sections = chapterData['sections'];
    
    return (
      <div className="reading-pane" onClickCapture={this.handleReadingPaneClick}>
          <div className="chapter">
            {sections.map( (section, index) => this.renderSection(section, index))}
          </div>
      </div>
    );
  }
}

export default ReadingPane;
