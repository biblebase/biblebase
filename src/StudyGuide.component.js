import React from 'react';
import PropTypes from 'prop-types';
import './StudyGuide.css';

class StudyGuide extends React.Component {
    static propTypes = {
        verseReference: PropTypes.object.isRequired
    }

    handleMenuSelection = (event) => {
        const link = event.target;
        console.log(event.target);
        if (link.classList.contains("menu-item")) { // clicked on section link
            event.preventDefault();

            // scroll to the selected section
            let sectionId = link.getAttribute("target");            
            let section = document.getElementById(sectionId);
            let offsetTop = section.offsetTop;
            console.log(section.offsetTop);
            document.getElementById("study-content").scrollTop = offsetTop;
        }

    }

    render() {
        return (
            <div id="study-guide">
                <div id="menu" onClick={this.handleMenuSelection}>
                    <div id="mi-other-versions" className="menu-item" target="other-versions" selected={true}>Other Versions</div>
                    <div id="mi-sermons" className="menu-item" target="sermons">Sermons</div>
                    <div id="mi-sunday-school" className="menu-item" target="sunday-school">Sunday School Materials</div>
                    <div id="mi-interpretations" className="menu-item" target="interpretations">interpretations</div>
                    <div id="mi-hymns" className="menu-item" target="hymns">Hymns</div>
                    <div id="mi-notes" className="menu-item" target="notes">Notes</div>
                </div>
                <div id="study-content">
                    <div id="other-versions" className="guide">
                        <div className="heading">
                            Other Versions
                        </div>
                        <div className="content">
                            {this.props.verseReference.otherVersions ?
                            this.props.verseReference.otherVersions.map(version => (
                                <div className="version" key={version.versionId}>
                                    <div className="version-name">{version.versionName}</div>
                                    <div className="version-content">{version.text}</div>
                                </div>
                            )) : ""}
                        </div>
                    </div>      
                    <div id="sermons" className="guide">
                        <div className="heading">
                            Sermons
                        </div>
                        <div className="content">
                            {this.props.verseReference.sermons?
                            this.props.verseReference.sermons.map(sermon => (
                                <div className="sermon" key={sermon.id}>
                                    <div className="sermon-title">{sermon.title}</div>
                                    <div className="sermon-preacher">{sermon.preacher}</div>
                                    {sermon.audio? 
                                    (<audio className="sermon-audio" controls>
                                        <source src={sermon.audio} type="audio/mpeg" />
                                        Your browser does not support the audio element.
                                    </audio>) : ""}
                                    {sermon.slides ? 
                                        (<div className="sermon-slides">
                                            <a href={sermon.slides} target="_blank" rel="noopener noreferrer">Slides</a>
                                        </div>) : ""
                                    }
                                </div>
                            )) : ""}
                        </div>
                    </div>  
                    <div id="sunday-school" className="guide">
                        <div className="heading">
                            Sunday School Materials
                        </div>
                        <div className="content">
                            {this.props.verseReference.sundaySchoolClasses?
                            this.props.verseReference.sundaySchoolClasses.map(lesson => (
                                <div className="lesson" key={lesson.id}>
                                    <div className="lesson-title">{lesson.title}</div>
                                    <div className="lesson-preacher">{lesson.preacher}</div>
                                    <div className="lesson-date">{lesson.date}</div>
                                    {lesson.slides ? 
                                        (<div className="lesson-slides">
                                            <a href={lesson.slides} target="_blank" rel="noopener noreferrer">Slides</a>
                                        </div>) : ""
                                    }
                                </div>
                            )) : ""}
                        </div>
                    </div>  
                    <div id="interpretations" className="guide">
                        <div className="heading">
                            Interpretations
                        </div>
                        <div className="content">
                            {this.props.verseReference.interpretations?
                            this.props.verseReference.interpretations.map(interpretation => (
                                <div className="interpretation" key={interpretation.id}>
                                    <div className="interpretation-title">
                                        <a href={interpretation.url} target="_blank" rel="noopener noreferrer">{interpretation.title}</a></div>
                                    <div className="interpretation-text">{interpretation.text}</div>
                                    {interpretation.linkedVerses ? 
                                        (<div className="interpretation-linkedVerses">
                                           {Object.keys(interpretation.linkedVerses).map(verse => (
                                               <div className="linked-verse" key={verse}>
                                                   {interpretation.linkedVerses[verse]} ({verse})
                                               </div>
                                           ))}
                                        </div>) : ""
                                    }
                                </div>
                            )) : ""}
                        </div>
                    </div>
                    <div id="hymns" className="guide">
                        <div className="heading">
                            Hymns
                        </div>
                        <div className="content">
                            {this.props.verseReference.hymns ?
                            this.props.verseReference.hymns.map(hymn => (
                                <div className="hymn" key={hymn.id}>
                                    <div className="hymn-title">{hymn.title}</div>
                                    <div className="hymn-description">{hymn.description}</div>
                                    <iframe id={`youtube_${hymn.id}`} title={hymn.title} type="text/html" width="640" height="360"
                                        src={`https://www.youtube.com/embed/${hymn.youtube_id}?autoplay=0&origin=http://example.com"`}
                                        frameBorder="0">
                                    </iframe>
                                </div>
                            )) : ""}
                        </div>
                    </div>
                    <div id="notes" className="guide">
                        <div className="heading">
                            Notes
                        </div>
                        <div className="content">
                            {this.props.verseReference.notes ?
                            this.props.verseReference.notes.map(note => (
                                <div className="note" key="note.id">
                                    <div className="note-author">{note.author}</div>
                                    <div className="note-time">{note.time}</div>
                                    <div className="note-text">{note.text}</div>
                                    <div className="note-likes">{`${note.likes.length} likes`}</div>
                                    <div className="note-comments">
                                        {note.comments.map(comment => (
                                            <div className="note-comment" key={comment.id}>
                                                {comment.by}<br />
                                                {comment.time}<br />
                                                {comment.text}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )) : ""}
                        </div>
                    </div>
                </div>
                
            </div>
        )
    }
}

export default StudyGuide;