import React from "react";
import ReadingPane from "./ReadingPane.component";
import StudyGuide from "./StudyGuide.component";
import Menu from "./Menu.component";
import Footer from "./Footer.component";

import "./App.css";
import { bibleIndex } from "./bibleIndex";
import { Switch, Route, Redirect } from "react-router-dom";

class BibleApp extends React.Component {

  state = {
    menuOpen: false
  }

  closeMenu = () => {
    this.setState({
      menuOpen: false
    });
  }

  openMenu = () => {
    this.setState({
      menuOpen: true
    })
  }

  render() {
    return (
      <div>
        <Switch>
          <Route path="/biblebase/:book?/:chapter?/:verse?"
            render={(props) => (
              <div className="bible-app">
                <div className="header">
                  <Menu bibleIndex={bibleIndex} menuOpen={this.state.menuOpen} openMenu={this.openMenu} closeMenu={this.closeMenu} {...props} />
                </div>
                <div className="body">
                  <div className="body-left">
                    <ReadingPane bibleIndex={bibleIndex} menuOpen={this.state.menuOpen} closeMenu={this.closeMenu} {...props} />
                  </div>
                  <div className="body-right">
                    <StudyGuide bibleIndex={bibleIndex} menuOpen={this.state.menuOpen} closeMenu={this.closeMenu} {...props} />
                  </div>
                </div>
                <div className="footer">
                  <Footer />
                </div>
              </div>
            )}
          />
          <Route exact path="/" render={() => (<Redirect to="/biblebase" />)} />
        </Switch>
      </div>
    );
  }
}

export default BibleApp;
