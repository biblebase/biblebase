import React from 'react';
import PropTypes from 'prop-types';
import './BibleSelect.css';

class BibleSelect extends React.Component {

    static propTypes = {
        bookId: PropTypes.string.isRequired,
        chapter: PropTypes.number.isRequired,
        bibleIndex: PropTypes.object.isRequired,
        changeBookChapterRequest: PropTypes.func.isRequired
    }

    state = {
        selectedbookId: this.props.bookId,
        selectedChapter: this.props.chapter
    }

    handleBookSelection = (event) => {
        this.setState({
            selectedbookId: event.target.value,
            selectedChapter: 1
        })
        this.props.changeBookChapterRequest(event.target.value, 1);
    }

    handleChapterSelection = (event) => {
        this.setState({
            selectedChapter: event.target.value
        })
        // call parent function to change selected
        this.props.changeBookChapterRequest(this.state.selectedbookId, parseInt(event.target.value));
    }

    render() {
        let menu = [];
        for (let i = 1; i <= this.props.bibleIndex[this.state.selectedbookId].chapters; i++) {
            menu.push(<option value={i} key={i}>{i}</option>)
        }
        return (
            <div className="book-select">
                <select className="books-select" value={this.state.selectedbookId} onChange={this.handleBookSelection}>
                    {Object.keys(this.props.bibleIndex).map(bookId => (
                        (<option value={bookId} key={bookId}>{this.props.bibleIndex[bookId].title}</option>)
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