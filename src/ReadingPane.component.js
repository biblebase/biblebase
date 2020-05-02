import React from "react";
import './ReadingPane.css';
import PropTypes from 'prop-types';
import classNames from 'classnames';


class ReadingPane extends React.Component {

  static propTypes = {
    bookId: PropTypes.number.isRequired,
    chapter: PropTypes.number.isRequired,
    bibleIndex: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    changeVerseSelectionRequest: PropTypes.func.isRequired
  }

  state = {
    selectedbookId: 0,
    selectedChapter: 0,
    selectedVerse: 0,
    showBookDropdown: false,
    showChapterDropdown: false
  }

  // add listeners to verse elements
  componentDidMount = () => {
    const verses = document.getElementsByClassName("verse");
    for (let verse of verses) {
      verse.addEventListener("click", this.handleSelectVerseEvent);
    }
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
        showBookDropdown: !this.state.showBookDropdown,
        showChapterDropdown: false,
      });
    }
  }

  handlePrevButtonClick = () => {
    let book = this.props.bookId;
    let chapter = this.props.chapter;
    
    // invalid
    if (chapter === 1 && book === 1) {
      return;
    }

    // need to go to previous chapter
    if (chapter === 1) {
      book -= 1;
      chapter = this.props.bibleIndex[book].chapters;
    } else {
      chapter -= 1;
    }
    this.setState({
      selectedVerse: 0
    })
    this.props.changeBookChapterRequest(book, chapter);
  }

  handleNextButtonClick = () => {
    let book = this.props.bookId;
    let chapter = this.props.chapter;

    // invalid
    if (book === 66 && chapter === 22) {
      return;
    }

    // next book
    if (chapter === this.props.bibleIndex[book].chapters) {
      book += 1;
      chapter = 1;
    } else {
      chapter += 1;
    }
    this.setState({
      selectedVerse: 0
    })
    this.props.changeBookChapterRequest(book, chapter);
  }

  handleDropdownButtonClick = (event) => {
    this.setState({
      selectedbookId: 0,
      selectedChapter: 1,
      showBookDropdown: !this.state.showBookDropdown,
      showChapterDropdown: false,
    });
  }

  handleBookSelection = (event) => {
    event.stopPropagation();
    this.setState({
        selectedbookId: event.target.value,
        selectedChapter: 1,
        showChapterDropdown: true
    });
}

  handleChapterSelection = (event) => {
    event.stopPropagation();

    // call parent function to change selected
    this.props.changeBookChapterRequest(this.state.selectedbookId, parseInt(event.target.value));

    // reset
    this.setState({
      showBookDropdown: false,
      showChapterDropdown: false,
      selectedBookId: 0,
      selectedChapter: 0,
      selectedVerse: 0
    });
      
  }

  // handle verse selected event
  handleSelectVerseEvent = (event) => {

    // if menu is not open, allow selecting verse
    if (!this.state.showBookDropdown) {
      event.stopPropagation();
      let target = event.currentTarget;
      let book = event.currentTarget.dataset.book;
      let chapter = event.currentTarget.dataset.chapter;
      let verse = event.currentTarget.dataset.verse;
      if (target.classList.contains("verse")) {
        this.setState({
          selectedVerse: parseInt(verse),
        });
        this.props.changeVerseSelectionRequest(parseInt(book), parseInt(chapter), parseInt(verse));
      }
    }
  }

  render() {
    if (Object.keys(this.props.data).length === 0) {
      return <div></div>
    }
    const verses = this.props.data['verses'];
    let menu = [];
    if (this.state.selectedbookId !== 0) {
      for (let i = 1; i <= this.props.bibleIndex[this.state.selectedbookId].chapters; i++) {
        menu.push(<option className="chapter-list-item" value={i} key={i}>{i}</option>)
      }
    }
    
    return (
      <div className="reading-pane" onClick={this.handleReadingPaneClick}>
        <div className="book-select">
          {
            this.props.bookId === 1 && this.props.chapter === 1?
            (<div className="prev prev-disabled">
              <span className="triangle triangle-prev-disabled" ></span>
            </div>) :
            (<div className="prev" onClick={this.handlePrevButtonClick}>
              <span className="triangle triangle-prev" ></span>
            </div>)
          }
          <div className="book-nav">
            <button className="book-dropdown-button" onClick={this.handleDropdownButtonClick}>
              {this.props.bibleIndex[this.props.bookId].title} {this.props.chapter}  
              <span className="triangle triangle-down"></span>
            </button>
          </div>
          {
            this.props.bookId === 66 && this.props.chapter === 22?
            (<div className="next next-disabled">
              <span className="triangle triangle-next-disabled" ></span>
            </div>) :
            (<div className="next" onClick={this.handleNextButtonClick}>
              <span className="triangle triangle-next" ></span>
            </div>)
          }
          <div className={classNames("book-dropdown", {hide: !this.state.showBookDropdown})}>
            <ul className="book-list" onClick={this.handleBookSelection}>
              {Object.keys(this.props.bibleIndex).map(bookId => (
                  (<li className={classNames("book-list-item", {highlight: this.props.bibleIndex[bookId].id === this.state.selectedbookId})} 
                  value={bookId} key={bookId}>{this.props.bibleIndex[bookId].title}</li>)
              ))}
            </ul>
          </div>
          <div className={classNames("chapter-dropdown", {hide: !this.state.showChapterDropdown})}>
            <ul className="chapter-list" onClick={this.handleChapterSelection}>
              {menu}
            </ul>
          </div>
        </div>
        <div className="content-pane">
          <div className="chapter">
            {verses.map( verse => (
              <span className={classNames("verse", {selected: verse.verse === this.state.selectedVerse})} 
                key={`${this.props.bookId}.${verse.chapter}.${verse.verse}`}
                data-book={this.props.bookId}
                data-chapter={this.props.chapter}
                data-verse={verse.verse}
                onClick={this.handleSelectVerseEvent} >
                <span className="label">{verse.verse}</span>
                <span className="content">
                  {verse.text}
                </span>
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default ReadingPane;
