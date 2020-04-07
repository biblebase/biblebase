import React from 'react';
import BibleSelect from './BibleSelect.component';
import ReadingPane from './ReadingPane.component';
import StudyGuide from './StudyGuide.component';
import './App.css';
import { bibleIndex } from './bibleIndex';
import { getBookChapterJson } from './DataFetchUtils';

class BibleApp extends React.Component {

  // init to Genesis 1:1
  state = {
    bookId: "1",
    chapter: 1,
    data: null,
    selectedVerse: 1
  }

  constructor() {
    // initialize data
    super();
    this.changeBookChapterRequest(this.state.bookId, this.state.chapter);
  }

  changeBookChapterRequest = (bookId, chapter) => {

    getBookChapterJson(bookId, chapter).then( data => {
      this.setState({
        bookId: bookId,
        chapter: chapter,
        selectedVerse: 1, // default
        data: data
      });
    }, res => {
        console.log("Error: unable to fetch bible data");
        console.log(res);
      });
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
                bookId={this.state.bookId} 
                chapter={this.state.chapter} 
                bibleIndex={bibleIndex}
                changeBookChapterRequest={this.changeBookChapterRequest}/>
          </div>
          <div id="reading-pane">
            <ReadingPane 
                bookId={this.state.bookId}
                chapter={this.state.chapter}
                bibleIndex={bibleIndex}
                data={this.state.data}
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
