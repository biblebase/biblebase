import React from 'react';
import PropTypes from 'prop-types';
import './BibleSelect.css';

class BibleSelect extends React.Component {

    static propTypes = {
        bookKey: PropTypes.string.isRequired,
        chapter: PropTypes.number.isRequired,
        bibleIndex: PropTypes.object.isRequired,
        changeBookChapterRequest: PropTypes.func.isRequired
    }

    state = {
        selectedbookKey: this.props.bookKey,
        selectedChapter: this.props.chapter
    }

    handleBookSelection = (event) => {
        this.setState({
            selectedbookKey: event.target.value,
            selectedChapter: 1
        })
        this.props.changeBookChapterRequest(event.target.value, 1);
    }

    handleChapterSelection = (event) => {
        this.setState({
            selectedChapter: event.target.value
        })
        // call parent function to change selected
        this.props.changeBookChapterRequest(this.state.selectedbookKey, parseInt(event.target.value));
    }

    render() {
        if (Object.keys(this.props.bibleIndex).length === 0) {
            return <div></div>;
        }
        let menu = [];
        for (let i = 1; i <= this.props.bibleIndex[this.state.selectedbookKey].chapters; i++) {
            menu.push(<option value={i} key={i}>{i}</option>)
        }
        return (
            <div className="book-select">
                <select className="books-select" value={this.state.selectedbookKey} onChange={this.handleBookSelection}>
                    {Object.keys(this.props.bibleIndex).map(bookKey => (
                        (<option value={bookKey} key={bookKey}>{this.props.bibleIndex[bookKey].title}</option>)
                    ))}
                </select>
                <select className="chapters-select" value={this.state.selectedChapter} onChange={this.handleChapterSelection}>
                    {menu}
                </select>
            </div>
        );
        
    }
}

export default BibleSelect;