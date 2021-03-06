import React from 'react';
import "./Menu.css";
import Profile from "./Profile.component";
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';

class Menu extends React.Component {

  static propTypes = {
    bibleIndex: PropTypes.object.isRequired,
    menuOpen: PropTypes.bool.isRequired,
    openMenu: PropTypes.func.isRequired,
    closeMenu: PropTypes.func.isRequired,
    book: PropTypes.number.isRequired,
    chapter: PropTypes.number.isRequired
  }

  state = {
    requireLogin: false,
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

  login = (event) => {
    event.stopPropagation();
    this.setState({
      requireLogin: true
    });
  }

  handleDropdownButtonClick = (event) => {
    event.stopPropagation();
    if (this.props.menuOpen) {
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
    if (this.state.selectedbookId === 0) {// if using default selection (only changing chapter)
      let book = this.props.match.params.book? this.props.match.params.book : 1
      this.props.history.push(`/biblebase/${book}/${parseInt(event.target.value)}`);
    }
    else
      this.props.history.push(`/biblebase/${this.state.selectedbookId}/${parseInt(event.target.value)}`);

    // reset
    this.setState({
      selectedBookId: 0,
      selectedChapter: 0
    });

    this.props.closeMenu();
      
  }

  handleMenuPaneClick = (event) => {
    // if menu is open and clicked outside selection, close menu
    const classes = event.target.classList;
    if (this.props.menuOpen && !classes.contains("book-list-item") && !classes.contains("chapter-list-item")) {
      event.preventDefault();
      event.stopPropagation();
      this.props.closeMenu();
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
        prevBook -= 1;
        prevCh = this.props.bibleIndex[prevBook].chapters;
      } else {
        prevCh -= 1;
      }
  
      return (
        <Link to={`/biblebase/${prevBook}/${prevCh}`} className={classNames({"disable-link": this.props.menuOpen})}>
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
        <Link to={`/biblebase/${nextBook}/${nextCh}`} className={classNames({"disable-link": this.props.menuOpen})}>
          <div className="next">
            <span className="triangle triangle-next" ></span>
          </div>
        </Link>
      )
    }
            
  }

  render() {
    const { book, chapter } = this.props;

    let menu = [];
    if (this.state.selectedbookId !== 0) { // selected a book
      for (let i = 1; i <= this.props.bibleIndex[this.state.selectedbookId].chapters; i++) {
        menu.push(<li className="chapter-list-item" value={i} key={i}>{i}</li>)
      }
    } else { // book has not been selected, is pointing to current book
      for (let i = 1; i <= this.props.bibleIndex[book].chapters; i++) {
        menu.push(<li className={classNames("chapter-list-item", 
            {"highlight-current": i === chapter})} // highlight original chapter 
            value={i} key={i}>{i}</li>)
      }
    }

    return (
      <div id="book-menu">
        <header>
          <h1>Biblebase</h1>
        </header>
        <div id="book-selector">
          {this.renderPrevChLink(book, chapter)}
          <div className="book-nav">
            <button className="book-dropdown-button" onClick={this.handleDropdownButtonClick}>
              {this.props.bibleIndex[book].title} {chapter}  
              <span className="triangle triangle-down"></span>
            </button>
          </div>
          {this.renderNextChLink(book, chapter)}
          <div className={classNames("book-dropdown", {hide: !this.props.menuOpen})}>
            <ul className="book-list" onClick={this.handleBookSelection}>
              {Object.keys(this.props.bibleIndex).map(bid => (
                  (<li className={classNames("book-list-item", 
                      {"highlight-current": this.state.selectedbookId !== 0? 
                        this.props.bibleIndex[bid].id === this.state.selectedbookId :
                        this.props.bibleIndex[bid].id === book})} 
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

        <div id="search"></div>

        <div id="user">
          { this.state.requireLogin
            ? <Profile />
            : <button onClick={ this.login }>Login</button>
          }
        </div>

      </div>
    );
  }
}

export default withRouter(Menu);
