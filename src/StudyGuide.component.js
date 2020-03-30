import React from 'react';
import PropTypes from 'prop-types';
import './StudyGuide.css';

class StudyGuide extends React.Component {
    static propTypes = {
        verseReference: PropTypes.object.isRequired
    }

    render() {
        return (
            <div className="study-guide">
                {JSON.stringify(this.props.verseReference)}
            </div>
        )
    }
}

export default StudyGuide;