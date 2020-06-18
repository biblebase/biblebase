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

  render() {
    const bookId = this.state.bookId;
    const chapter = this.state.chapter;
    const verse = this.state.verse;
    const chapterData = this.state.chapterData;

    if (bookId === 0)
      return <div></div>

    // data has not been loaded
    if (isEmptyObject(chapterData) || 
        chapterData.book_nr !== bookId || chapterData.chapter !== chapter) {
      this.getBookData(bookId, chapter);
      return <div></div>
    }

    const verses = chapterData['verses'];
    
    return (
      <div className="reading-pane" onClickCapture={this.handleReadingPaneClick}>
          <div className="chapter">
            {verses.map( verseObj => (
              <Link key={`${bookId}.${chapter}.${verseObj.verse}`}
                    to={verseObj.verse === verse? `/bible/${bookId}/${chapter}` : `/bible/${bookId}/${chapter}/${verseObj.verse}`}
                    className={classNames({"disable-link": this.props.menuOpen})} >
                <span className={classNames("verse", {selected: verseObj.verse === verse})} 
                  key={`${bookId}.${verseObj.chapter}.${verseObj.verse}`}
                  data-book={bookId}
                  data-chapter={chapter}
                  data-verse={verseObj.verse} >
                  <span className="label">{verseObj.verse}</span>
                  <span className="content">
                    {verseObj.text}
                  </span>
                </span>
              </Link>
            ))}
          </div>
      </div>
    );
  }
}

export default ReadingPane;
