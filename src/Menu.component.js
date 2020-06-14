import React from 'react';
import "./Menu.css";
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';


class Menu extends React.Component {

  static propTypes = {
    bibleIndex: PropTypes.object.isRequired,
    menuOpen: PropTypes.bool.isRequired,
    openMenu: PropTypes.func.isRequired,
    closeMenu: PropTypes.func.isRequired
  }

  state = {
    bookId: 1,
    chapter: 1,
    selectedbookId: 0,
    selectedChapter: 0
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
    this.setState({
      bookId: bookId,
      chapter: chapter
    });
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
    if (this.props.menuOpen) {
      console.log("close menu");
      this.props.closeMenu();
    } else {
      this.props.openMenu();
    }
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
      selectedBookId: 0,
      selectedChapter: 0
    });

    this.props.closeMenu();
      
  }

  render() {

    const bookId = this.state.bookId;
    const chapter = this.state.chapter;

    let menu = [];
    if (this.state.selectedbookId !== 0) { // selected a book
      for (let i = 1; i <= this.props.bibleIndex[this.state.selectedbookId].chapters; i++) {
        menu.push(<option className="chapter-list-item" value={i} key={i}>{i}</option>)
      }
    } else { // book has not been selected, is pointing to current book
      for (let i = 1; i <= this.props.bibleIndex[bookId].chapters; i++) {
        menu.push(<option className={classNames("chapter-list-item", 
            {"highlight-current": i === chapter})} // highlight original chapter 
            value={i} key={i}>{i}</option>)
      }
    }

    return (
      <div id="menu">
        <div id="branding">
          <h1>Biblebase</h1>
        </div>

        <div id="book-selector">
          {this.renderPrevChLink(bookId, chapter)}
          <div className="book-nav">
            <button className="book-dropdown-button" onClick={this.handleDropdownButtonClick}>
              {this.props.bibleIndex[bookId].title} {chapter}  
              <span className="triangle triangle-down"></span>
            </button>
          </div>
          {this.renderNextChLink(bookId, chapter)}
          <div className={classNames("book-dropdown", {hide: !this.props.menuOpen})}>
            <ul className="book-list" onClick={this.handleBookSelection}>
              {Object.keys(this.props.bibleIndex).map(bid => (
                  (<li className={classNames("book-list-item", 
                      {"highlight-current": this.state.selectedbookId !== 0? 
                        this.props.bibleIndex[bid].id === this.state.selectedbookId :
                        this.props.bibleIndex[bid].id === bookId})} 
                  value={bid} key={bid}>{this.props.bibleIndex[bid].title}</li>)
              ))}
            </ul>
          </div>
          <div className={classNames("chapter-dropdown", {hide: !this.props.menuOpen})}>
            <ul className="chapter-list" onClick={this.handleChapterSelection}>
              {menu}
            </ul>
          </div>
        </div>

        <div id="search">
          <input type="text" className="search-box" placeholder="Search"></input>
          <button className="search-button">Search</button>
        </div>
        <div id="user">

        </div>

      </div>
    );
  }
}

export default Menu;