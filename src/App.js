import React from 'react';
import ReadingPane from './ReadingPane.component';
import StudyGuide from './StudyGuide.component';
import './App.css';
import { bibleIndex } from './bibleIndex';
import { getBookChapterJson, getVerseJson } from './DataFetchUtils';

class BibleApp extends React.Component {

  // init to Genesis 1:1
  state = {
    bookId: 50,
    chapter: 2,
    data: {},
    selectedVerse: 0,
    verseReference: {}
  }

  componentDidMount() {
    this.changeBookChapterRequest(this.state.bookId, this.state.chapter);
  }

  changeBookChapterRequest = (bookId, chapter) => {
    let tempData = {};
    getBookChapterJson(bookId, chapter).then( bibleData => {
      tempData = bibleData;
      return getVerseJson(bookId, chapter, 0);
    }, res => {
        console.log("Error: unable to fetch bible data");
        console.log(res);
    }).then(verseData => {
      this.setState({
        bookId: bookId,
        chapter: chapter,
        selectedVerse: 0,
        verseReference: verseData,
        data: tempData
      });
    }, res => {
      console.log("Unable to fetch verse data");
      console.log(res);
    });
  }

  
  // select a verse
  changeVerseSelectionRequest = (bookId, chapter, verse) => {
    getVerseJson(bookId, chapter, verse).then( data => {
      this.setState({
        selectedVerse: verse,
        verseReference: data
      });
    }, res => {
      console.log("Unable to fetch verse data");
      console.log(res);
    });
  }

  render(){
    return (
      <div className="bible-app">
        <div className="left">
          <ReadingPane 
              bookId={this.state.bookId}
              chapter={this.state.chapter}
              bibleIndex={bibleIndex}
              data={this.state.data}
              changeBookChapterRequest={this.changeBookChapterRequest}
              changeVerseSelectionRequest={this.changeVerseSelectionRequest}/>
          
        </div>
        <div className="right">
          <StudyGuide 
                bookId={this.state.bookId} 
                chapter={this.state.chapter}
                verse={this.state.selectedVerse}
                bibleIndex={bibleIndex}
                verseReference={this.state.verseReference} />
        </div>
        
      </div>
    );
  }
}

export default BibleApp;
