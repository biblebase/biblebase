import React from 'react';
import PropTypes from 'prop-types';
import './BibleSelect.css';

class BibleSelect extends React.Component {

    static propTypes = {
        bookId: PropTypes.string.isRequired,
        chapter: PropTypes.number.isRequired,
        bibleIndex: PropTypes.object.isRequired,
        selectBookChapter: PropTypes.func.isRequired
    }

    state = {
        selectedBookId: this.props.bookId,
        selectedChapter: this.props.chapter
    }

    handleBookSelection = (event) => {
        this.setState({
            selectedBookId: event.target.value,
            selectedChapter: 1
        })
    }

    handleChapterSelection = (event) => {
        this.setState({
            selectedChapter: event.target.value
        })
        // call parent function to change selected
        this.props.selectBookChapter(this.state.selectedBookId, this.state.selectedChapter);
    }

    render() {
        let menu = [];
        for (let i = 1; i <= this.props.bibleIndex[this.state.selectedBookId].chapters; i++) {
            menu.push(<option value={i} key={i}>{i}</option>)
        }
        return (
            <div className="book-select">
                <select className="books-select" value={this.state.selectedBookId} onChange={this.handleBookSelection}>
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