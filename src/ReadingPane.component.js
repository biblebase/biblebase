import React from "react";
import './ReadingPane.css';
import PropTypes from 'prop-types';

class ReadingPane extends React.Component {

  static propTypes = {
    bookId: PropTypes.string.isRequired,
    chapter: PropTypes.number.isRequired,
    bibleIndex: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    changeVerseSelectionRequest: PropTypes.func.isRequired
  }

  state = {
    selectedVerse: 1,
    selectedVerseTarget: null,
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

  render() {
    if (this.props.data === null) {
      return <div></div>
    }
    const verses = this.props.data['verses'];

    return (
      <div className="reading-pane">
        <div className="chapter">
          <div className="title">{this.props.bibleIndex[this.props.bookId].title} {this.props.chapter}</div>
          {verses.map( verse => (
            <span className="verse" 
              key={`${this.props.bookId}.${verse.chapter}.${verse.verse}`}
              data-usfm={`${this.props.bookId}.${verse.chapter}.${verse.verse}`}
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
}

export default ReadingPane;
