import React from "react";
import ReadingPane from "./ReadingPane.component";
import StudyGuide from "./StudyGuide.component";
import "./App.css";
import { bibleIndex } from "./bibleIndex";
import { Switch, Route, Redirect } from "react-router-dom";

class BibleApp extends React.Component {

  render() {
    console.log("render app");
    return (
      <div>
        <Switch>
          <Route path="/bible/:book?/:chapter?/:verse?"
            render={(props) => (
              <div className="bible-app">
                <div className="left">
                  <ReadingPane 
                    bibleIndex={bibleIndex}
                    changeBookChapterRequest={this.changeBookChapterRequest}
                    changeVerseSelectionRequest={this.changeVerseSelectionRequest}
                    {...props} />
                </div>
                <StudyGuide bibleIndex={bibleIndex} {...props} />
              </div>
            )}
          />
          <Route expact path="/" render={() => (<Redirect to="/bible" />)} />
        </Switch>
      </div>
    );
  }
}

export default BibleApp;
