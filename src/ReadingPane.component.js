import React from "react";
import './ReadingPane.css';
import PropTypes from 'prop-types';
import { getBookChapterJson } from './DataFetchUtils';

class ReadingPane extends React.Component {

  static propTypes = {
    bookKey: PropTypes.string.isRequired,
    chapter: PropTypes.number.isRequired,
    bibleIndex: PropTypes.object.isRequired,
    changeVerseSelectionRequest: PropTypes.func.isRequired
  }

  state = {
    selectedVerse: 1,
    selectedVerseTarget: null,
    data: null
  }

  // add listeners to verse elements
  componentDidMount = () => {
    const verses = document.getElementsByClassName("verse");
    for (let verse of verses) {
      verse.addEventListener("click", this.handleSelectVerseEvent);
    }
  }

  // handle verse selected event
  handleSelectVerseEvent = (event) => {
    let target = event.currentTarget;
    let selectedVerse = event.currentTarget.dataset.usfm;
    if (target.classList.contains("verse")) {
      this.props.changeVerseSelectionRequest(selectedVerse);

      // clear previous selection
      if (this.state.selectedVerseTarget !== null)
        this.state.selectedVerseTarget.classList.remove("selected");
      
      // set current selection
      target.classList.add("selected");
      this.setState({
        selectedVerse: selectedVerse,
        selectedVerseTarget: target
      });
    }
  }

  getHtml = () => {
    if (this.state.data === null)
      return <div></div>
    const verses = this.state.data['verses'];

    return (
      <div className="reading-pane">
        <div className="chapter">
          <div className="title">{this.props.bibleIndex[this.props.bookKey].title} {this.props.chapter}</div>
          {verses.map( verse => (
            <span className="verse" 
              key={`${this.props.bookKey}.${verse.chapter}.${verse.verse}`}
              data-usfm={`${this.props.bookKey}.${verse.chapter}.${verse.verse}`}
              onClick={this.handleSelectVerseEvent} >
              <span className="label">{verse.verse}</span>
              <span className="content">
                {verse.text}
              </span>
            </span>
          ))}
        </div>
      </div>
    );
  }

  render() {
    // first time
    if (this.state.data === null && Object.keys(this.props.bibleIndex).length === 0)
        return <div></div>
    if (this.state.data !== null &&
        (this.state.data.book_nr === this.props.bibleIndex[this.props.bookKey].id) &&
        (this.state.data.chapter === this.props.chapter)) { // no need to fetch data
          return this.getHtml();
    }
    else { // no data or need to fetch
      getBookChapterJson(this.props.bibleIndex[this.props.bookKey].id, this.props.chapter).then( data => {
        this.setState({
          data: data
        });
      }, (res) => {
        console.log("Error: unable to get bible data");
        console.log(res);
      });
      return this.getHtml();
    }     
    
  }
}

export default ReadingPane;
