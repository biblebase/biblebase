import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './StudyGuide.css';

class StudyGuide extends React.Component {
    static propTypes = {
        selectedVerse: PropTypes.string.isRequired,
        verseReference: PropTypes.object.isRequired,
        scroll: PropTypes.func.isRequired
    }

    state = {
        activeSection: "otherVersions"
    }

    handleMenuSelection = (event) => {
        const link = event.target;
        if (link.classList.contains("menu-item")) { // clicked on section link
            event.preventDefault();

            // scroll to the selected section
            let sectionId = link.getAttribute("target");    
            this.setState({
                activeSection: sectionId
            })        
            let section = document.getElementById(sectionId);
            const menuHeight = document.getElementById("menu").offsetHeight;
            this.props.scroll(section.offsetTop - menuHeight);
        }

    }

    render() {
        const verseObject = this.props.verseReference;
        const title = `${this.props.selectedVerse}`;
        return (
            <div id="study-guide">
                <nav id="menu">
                    <div className="menu-heading">{title.toUpperCase()}</div>
                    <div className="menu-items" onClick={this.handleMenuSelection}>
                        <div id="mi-other-versions" target="other-versions" selected={true} className={classNames("menu-item", 
                            { dim: verseObject.otherVersions === undefined || verseObject.otherVersions.length === 0,
                              "active-menu-item": this.state.activeSection === "other-versions"})}>Other Versions</div>
                        <div id="mi-sermons" target="sermons" className={classNames("menu-item", 
                            { dim: verseObject.sermons === undefined || verseObject.sermons.length === 0,
                              "active-menu-item": this.state.activeSection === "sermons"})}>Sermons</div>
                        <div id="mi-sunday-school" target="sunday-school" className={classNames("menu-item", 
                            { dim: verseObject.sundaySchoolClasses === undefined || verseObject.sundaySchoolClasses.length === 0,
                                "active-menu-item": this.state.activeSection === "sunday-school"})}>Sunday School Materials</div>
                        <div id="mi-interpretations" target="interpretations" className={classNames("menu-item", 
                            { dim: verseObject.interpretations === undefined || verseObject.interpretations.length === 0,
                              "active-menu-item": this.state.activeSection === "interpretations"})}>interpretations</div>
                        <div id="mi-hymns" target="hymns" className={classNames("menu-item", 
                            { dim: verseObject.hymns === undefined || verseObject.hymns.length === 0,
                                "active-menu-item": this.state.activeSection === "hymns"})}>Hymns</div>
                        <div id="mi-notes" target="notes" className={classNames("menu-item", 
                            { dim: verseObject.notes === undefined || verseObject.notes.length === 0,
                                "active-menu-item": this.state.activeSection === "notes"})}>Notes</div>
                    </div>
                </nav>
                <div id="study-content">
                    <div id="other-versions" className={classNames("guide", 
                        { dim: verseObject.otherVersions === undefined || verseObject.otherVersions.length === 0})}>
                        <div className="heading">
                            Other Versions
                        </div>
                        <div className="content">
                            {verseObject.otherVersions ?
                            verseObject.otherVersions.map(version => (
                                <div className="version block" key={version.versionId}>
                                    <div className="version-name title">{version.versionName}</div>
                                    <div className="version-content">{version.text}</div>
                                </div>
                            )) : ""}
                        </div>
                    </div>      
                    <div id="sermons" className={classNames("guide", 
                        { dim: verseObject.sermons === undefined || verseObject.sermons.length === 0})}>
                        <div className="heading">
                            Sermons
                        </div>
                        <div className="content">
                            {verseObject.sermons?
                            verseObject.sermons.map(sermon => (
                                <div className="sermon block" key={sermon.id}>
                                    <div className="sermon-title title">{sermon.title}</div>
                                    <div className="sermon-preacher">{sermon.preacher}</div>
                                    <div className="sermon-date date">{sermon.date}</div>
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
                    <div id="sunday-school" className={classNames("guide", 
                        { dim: verseObject.sundaySchoolClasses === undefined || verseObject.sundaySchoolClasses.length === 0})}>
                        <div className="heading">
                            Sunday School Materials
                        </div>
                        <div className="content">
                            {verseObject.sundaySchoolClasses?
                            verseObject.sundaySchoolClasses.map(lesson => (
                                <div className="lesson block" key={lesson.id}>
                                    <div className="lesson-title title">{lesson.title}</div>
                                    <div className="lesson-preacher">{lesson.preacher}</div>
                                    <div className="lesson-date date">{lesson.date}</div>
                                    {lesson.slides ? 
                                        (<div className="lesson-slides">
                                            <a href={lesson.slides} target="_blank" rel="noopener noreferrer">Slides</a>
                                        </div>) : ""
                                    }
                                </div>
                            )) : ""}
                        </div>
                    </div>  
                    <div id="interpretations" className={classNames("guide", 
                        { dim: verseObject.interpretations === undefined || verseObject.interpretations.length === 0})}>
                        <div className="heading">
                            Interpretations
                        </div>
                        <div className="content">
                            {verseObject.interpretations?
                            verseObject.interpretations.map(interpretation => (
                                <div className="interpretation block" key={interpretation.id}>
                                    <div className="interpretation-title title">
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
                    <div id="hymns" className={classNames("guide", 
                        { dim: verseObject.hymns === undefined || verseObject.hymns.length === 0})}>
                        <div className="heading">
                            Hymns
                        </div>
                        <div className="content">
                            {verseObject.hymns ?
                            verseObject.hymns.map(hymn => (
                                <div className="hymn block" key={hymn.id}>
                                    <div className="hymn-title title">{hymn.title}</div>
                                    <div className="hymn-description desc">{hymn.description}</div>
                                    <div className="video-wrapper">
                                        <iframe className="iframe" id={`youtube_${hymn.id}`} title={hymn.title} type="text/html" width="100vmin" height="100vmin"
                                            src={`https://www.youtube.com/embed/${hymn.youtube_id}?autoplay=0&origin=http://example.com"`}
                                            frameBorder="0">
                                        </iframe>
                                    </div>
                                    
                                </div>
                            )) : ""}
                        </div>
                    </div>
                    <div id="notes" className={classNames("guide", 
                        { dim: verseObject.notes === undefined || verseObject.notes.length === 0})}>
                        <div className="heading">
                            Notes
                        </div>
                        <div className="content">
                            {verseObject.notes ?
                            verseObject.notes.map(note => (
                                <div className="note block" key="note.id">
                                    <div className="note-author title">{note.author}</div>
                                    <div className="note-time date">{note.time}</div>
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