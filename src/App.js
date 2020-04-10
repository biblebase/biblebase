import React from 'react';
import ReadingPane from './ReadingPane.component';
import StudyGuide from './StudyGuide.component';
import './App.css';
import { bibleIndex } from './bibleIndex';
import { getBookChapterJson, getVerseJson } from './DataFetchUtils';

class BibleApp extends React.Component {

  // init to Genesis 1:1
  state = {
    bookId: "1",
    chapter: 1,
    data: {},
    selectedVerse: 1,
    verseReference: {}
  }

  componentDidMount() {
    this.changeBookChapterRequest(this.state.bookId, this.state.chapter);
    this.changeVerseSelectionRequest(this.state.bookId, this.state.chapter, this.state.selectedVerse);
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
  changeVerseSelectionRequest = (bookId, chapter, verse) => {
    if (bookId === "50") { // TODO can only handle book 50 right now (sample data)
      getVerseJson(bookId, chapter, verse).then( data => {
        this.setState({
          selectedVerse: verse,
          verseReference: data
        });
      }, res => {
        console.log("Unable to fetch verse data");
        console.log(res);
      });
      
    } else {
      this.setState({
        selectedVerse: verse,
        verseReference: {}
      })
    }
  }

  render(){
    return (
      <div className="bible-app">
        <div className="left">
          <ReadingPane 
              bookId={this.state.bookId}
              chapter={this.state.chapter}
              bibleIndex={bibleIndex}
              verse={this.state.selectedVerse}
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
