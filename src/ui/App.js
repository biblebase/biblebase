import React from "react";
import ReadingPane from "./ReadingPane.component";
import StudyGuide from "./StudyGuide.component";
import Menu from "./Menu.component";
import Footer from "./Footer.component";

import "./App.css";
import { bibleIndex } from "./bibleIndex";
import { Switch, Route, Redirect } from "react-router-dom";
import queryString from "query-string";

class BibleApp extends React.Component {
  state = {
    menuOpen: false,
  };

  closeMenu = () => {
    this.setState({
      menuOpen: false,
    });
  };

  openMenu = () => {
    this.setState({
      menuOpen: true,
    });
  };

  parseVerses = (query) => {
    const { verses: versesStr } = queryString.parse(query);
    const verses = versesStr.split(",").map((v) => parseInt(v));
    verses.sort((a, b) => {
      if (a === b) return 0;
      return a < b ? -1 : 1;
    });
    return verses;
  };

  render() {
    return (
      <div>
        <Switch>
          <Route
            exact
            path={process.env.PUBLIC_URL}
            render={() => <Redirect to={process.env.PUBLIC_URL + "/1/1"} />}
          />
          <Route
            path={process.env.PUBLIC_URL + "/:book/:chapter"}
            render={(props) => (
              <div className="bible-app">
                <div className="header">
                  <Menu
                    bibleIndex={bibleIndex}
                    menuOpen={this.state.menuOpen}
                    openMenu={this.openMenu}
                    closeMenu={this.closeMenu}
                    book={parseInt(props.match.params.book)}
                    chapter={parseInt(props.match.params.chapter)}
                  />
                </div>
                <div className="body">
                  <div className="body-left">
                    <ReadingPane
                      bibleIndex={bibleIndex}
                      menuOpen={this.state.menuOpen}
                      closeMenu={this.closeMenu}
                      book={parseInt(props.match.params.book)}
                      chapter={parseInt(props.match.params.chapter)}
                      verses={
                        props.location.search
                          ? this.parseVerses(props.location.search)
                          : []
                      }
                      history={props.history}
                    />
                  </div>
                  <div className="body-right">
                    <StudyGuide
                      bibleIndex={bibleIndex}
                      menuOpen={this.state.menuOpen}
                      closeMenu={this.closeMenu}
                      book={parseInt(props.match.params.book)}
                      chapter={parseInt(props.match.params.chapter)}
                      verses={
                        props.location.search
                          ? this.parseVerses(props.location.search)
                          : []
                      }
                    />
                  </div>
                </div>
                <div className="footer">
                  <Footer />
                </div>
              </div>
            )}
          />
          <Route
            path="/"
            render={() => <Redirect to={process.env.PUBLIC_URL + "/1/1"} />}
          />
        </Switch>
      </div>
    );
  }
}

export default BibleApp;
