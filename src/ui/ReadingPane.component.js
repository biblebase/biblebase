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
    closeMenu: PropTypes.func.isRequired,
    jin: PropTypes.bool,
    book: PropTypes.number.isRequired,
    chapter: PropTypes.number.isRequired,
    verse: PropTypes.number
  }

  state = {
    chapterData: {}
  }

  componentDidMount() {
    this.fetch();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.book !== this.props.book || prevProps.chapter !== this.props.chapter)
      this.fetch();
  }

  // update current state when props change
  fetch = () => {
    const {book, chapter, jin} = this.props;
    getBookChapterJson(book, chapter, jin).then(data => {
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
    let { book, chapter, verse } = this.props;

    if ("heading" in section) { // heading section
      if (Array.isArray(section.heading)) {
        return <div className={`heading ${section.type}`} key={key}>{
          section.heading.map( (content, idx) => {
            if (typeof content === 'object') {
              return (
                <Link to={content.href} key={idx}
                      className={classNames({"disable-link": this.props.menuOpen})} >
                {content.text}
                </Link>);
            } else {
              return content;
            }
          })
        }</div>
      } else {
        return (
          <div className={`heading ${section.type}`} key={key}>{section.heading}</div>
        )
      }
    } else { // content section
      return (
        <div className={`section ${section.type}`} key={key}>
          {section.contents.map( (content, index) => {
            const {hasVerseLabel, verseNum, verseText, classes, title, href} = content;
            const link = href ?
              href :
              verseNum === verse? `/biblebase/${book}/${chapter}` : `/biblebase/${book}/${chapter}/${verseNum}`;
            return(
              <span className="section-content" key={index}>
                { hasVerseLabel ? <span className="label">{verseNum}</span> : ""}
                <Link to={link}
                      title={title}
                      className={classNames({"disable-link": this.props.menuOpen})} >
                  <span data-verse={verseNum} className={classNames("verse", classes, {selected: verseNum === verse})} >
                    {verseText}
                  </span>
                </Link>
              </span>
            )}
          )}
        </div>
      )
    }
  }

  render() {
    const { chapterData } = this.state;
    const { jin } = this.props;

    if (isEmptyObject(chapterData))
      return null;

    const sections = chapterData['sections'];
    
    return (
      <div className="reading-pane" onClickCapture={this.handleReadingPaneClick}>
          <div className={classNames("chapter", jin ? 'jin' : '')}>
            {sections.map( (section, index) => this.renderSection(section, index))}
          </div>
      </div>
    );
  }
}

export default ReadingPane;
