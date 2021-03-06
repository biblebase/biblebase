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
    const {book, chapter} = this.props;
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
    let { book, chapter, verse } = this.props;

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
              <Link to={content.verseNum === verse? `/biblebase/${book}/${chapter}` : `/biblebase/${book}/${chapter}/${content.verseNum}`}
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
    const { chapterData } = this.state;

    if (isEmptyObject(chapterData))
      return null;

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
