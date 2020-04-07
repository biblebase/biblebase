import React from 'react';
import BibleSelect from './BibleSelect.component';
import ReadingPane from './ReadingPane.component';
import StudyGuide from './StudyGuide.component';
import './App.css';
import { encode } from 'punycode';
import { getBibleIndex, getVerseJson  } from './DataFetchUtils';

class BibleApp extends React.Component {

  // init to Genesis 1:1
  state = {
    bookKey: "gen",
    chapter: 1,
    selectedVerse: 1,
    bibleIndex: {}
  }

  bibleIndex = {}

  constructor() {
    super();

    // load bible index
    getBibleIndex().then(data => {
      this.setState({
        bibleIndex: data
      });

    }, () => {
      console.log("Error: Unable to fetch bible index");
    });
  }


  changeBookChapterRequest = (bookKey, chapter) => {
    this.setState({
      bookKey: bookKey,
      chapter: chapter,
      selectedVerse: 1 // default
    })
  }

  
  // select a verse
  changeVerseSelectionRequest = (verse) => {
    this.setState({
      selectedVerse: verse,
    });
  }

  render(){
    return (
      <div className="bible-app">
        <div className="left">
          <div id="book-select">
            <BibleSelect 
                bookKey={this.state.bookKey} 
                chapter={this.state.chapter} 
                bibleIndex={this.state.bibleIndex}
                changeBookChapterRequest={this.changeBookChapterRequest}/>
          </div>
          <div id="reading-pane">
            <ReadingPane 
                bookKey={this.state.bookKey}
                chapter={this.state.chapter}
                bibleIndex={this.state.bibleIndex}
                changeVerseSelectionRequest={this.changeVerseSelectionRequest}/>
          </div>
          
        </div>
        {/* <div className="right">
          <StudyGuide selectedVerse={this.state.selectedVerse} verseReference={this.state.verseReference}/>
        </div> */}
        
      </div>
    );
  }
}

export default BibleApp;
