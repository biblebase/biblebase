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
    changeVerseSelectionRequest: PropTypes.func.isRequired
  }

  state = {
    bookId: 1,
    chapter: 1, 
    verse: 0,
    /* for menu selection */
    selectedbookId: 0,
    selectedChapter: 0,
    selectedVerse: 0,
    showBookDropdown: false,
    chapterData: {}
  }

  /* 
   * When props changes (when routing has changed), we need to catch is and update the state
   * so that it will cause updates to relevent elements in the UI. If we skip this part, 
   * the whole componenet is re-rendered when routing changes
   */
  componentWillReceiveProps(props) {
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
    event.stopPropagation();
    // if menu is open and clicked outside selection, close menu
    if (this.state.showBookDropdown && 
        !event.target.classList.contains("book-dropdown") &&
        !event.target.classList.contains("chapter-dropdown")) {
      this.setState({
        selectedbookId: 0,
        selectedChapter: 1,
        showBookDropdown: !this.state.showBookDropdown
      });
    }
  }

  renderPrevChLink = (book, chapter) => {    
    if (book === 1 && chapter === 1) {
      return (
        <div className="prev prev-disabled">
          <span className="triangle triangle-prev-disabled" ></span>
        </div>
      ); 
    } else {
      let prevBook = book;
      let prevCh = chapter;
      // need to go to previous book
      if (chapter === 1) {
        prevBook =- 1;
        prevCh = this.props.bibleIndex[book].chapters;
      } else {
        prevCh -= 1;
      }
  
      return (
        <Link to={`/bible/${prevBook}/${prevCh}`}>
          <div className="prev">
            <span className="triangle triangle-prev" ></span>
          </div>
        </Link>
      )
    }
            
  }

  renderNextChLink = (book, chapter) => {    
  
    if (book === 66 && chapter === 22) {
      return (
        <div className="next next-disabled">
          <span className="triangle triangle-next-disabled" ></span>
        </div>
      ); 
    } else {
      let nextBook = book;
      let nextCh = chapter;
      // need to go to next book
      if (chapter === this.props.bibleIndex[book].chapters) {
        nextBook += 1;
        nextCh = 1;
      } else {
        nextCh += 1;
      }
      return (
        <Link to={`/bible/${nextBook}/${nextCh}`}>
          <div className="next">
            <span className="triangle triangle-next" ></span>
          </div>
        </Link>
      )
    }
            
  }

  handleDropdownButtonClick = (event) => {
    this.setState({
      selectedbookId: 0,
      selectedChapter: 1,
      showBookDropdown: !this.state.showBookDropdown
    });
  }

  handleBookSelection = (event) => {
    event.stopPropagation();
    this.setState({
        selectedbookId: event.target.value,
        selectedChapter: 1
    });
}

  handleChapterSelection = (event) => {
    event.stopPropagation();

    // call parent function to change selected
    if (this.state.selectedbookId === 0) // if using default selection (only changing chapter)
      this.props.history.push(`/bible/${this.props.match.params.book}/${parseInt(event.target.value)}`);
    else
      this.props.history.push(`/bible/${this.state.selectedbookId}/${parseInt(event.target.value)}`);

    // reset
    this.setState({
      showBookDropdown: false,
      selectedBookId: 0,
      selectedChapter: 0,
      selectedVerse: 0
    });
      
  }

  render() {
    console.log("render reading pane");
    const bookId = this.state.bookId;
    const chapter = this.state.chapter;
    const verse = this.state.verse;
    const chapterData = this.state.chapterData;

    // data has not been loaded
    if (isEmptyObject(chapterData) || 
        chapterData.book_nr !== bookId || chapterData.chapter != chapter) {
      this.getBookData(bookId, chapter);
      return <div></div>
    }

    const verses = chapterData['verses'];
    let menu = [];
    if (this.state.selectedbookId !== 0) { // selected a book
      for (let i = 1; i <= this.props.bibleIndex[this.state.selectedbookId].chapters; i++) {
        menu.push(<option className="chapter-list-item" value={i} key={i}>{i}</option>)
      }
    } else { // book has not been selected, is pointing to current book
      for (let i = 1; i <= this.props.bibleIndex[bookId].chapters; i++) {
        menu.push(<option className={classNames("chapter-list-item", 
            {highlight: i === chapter})} // highlight original chapter 
            value={i} key={i}>{i}</option>)
      }
    }
    
    return (
      <div className="reading-pane" onClick={this.handleReadingPaneClick}>
        <div className="book-select">
          {this.renderPrevChLink(bookId, chapter)}
          <div className="book-nav">
            <button className="book-dropdown-button" onClick={this.handleDropdownButtonClick}>
              {this.props.bibleIndex[bookId].title} {chapter}  
              <span className="triangle triangle-down"></span>
            </button>
          </div>
          {this.renderNextChLink(bookId, chapter)}
          <div className={classNames("book-dropdown", {hide: !this.state.showBookDropdown})}>
            <ul className="book-list" onClick={this.handleBookSelection}>
              {Object.keys(this.props.bibleIndex).map(bid => (
                  (<li className={classNames("book-list-item", 
                      {highlight: this.state.selectedbookId !== 0? 
                        this.props.bibleIndex[bid].id === this.state.selectedbookId :
                        this.props.bibleIndex[bid].id === bookId})} 
                  value={bid} key={bid}>{this.props.bibleIndex[bid].title}</li>)
              ))}
            </ul>
          </div>
          <div className={classNames("chapter-dropdown", {hide: !this.state.showBookDropdown})}>
            <ul className="chapter-list" onClick={this.handleChapterSelection}>
              {menu}
            </ul>
          </div>
        </div>
        <div className="content-pane">
          <div className="chapter">
            {verses.map( verseObj => (
              <Link key={`${bookId}.${chapter}.${verseObj.verse}`}
                    to={verseObj.verse === verse? `/bible/${bookId}/${chapter}` : `/bible/${bookId}/${chapter}/${verseObj.verse}`}>
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
      </div>
    );
  }
}

export default ReadingPane;
