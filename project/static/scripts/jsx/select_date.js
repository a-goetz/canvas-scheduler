import React from 'react';
import ReactDOM from 'react-dom';
// import CourseInfo from './course_info'; // not implemented

class DateSelectForm extends React.Component {

    constructor(props) {
        super(props);
        var assignmentCount = getAssignmentCount();
        this.state = {
            maxRepetitions: assignmentCount,
        };
    }

    dateChange(event){
        // this.setState({searchString:event.target.value});

        //test
        // this.setState({maxRepetitions:event.target.value})
        console.log(event.target.value);
        console.log("Date Change recognized by form");
    }

    render() {

        var courseData = getCourseData();
        var courseStart = '';
        var courseEnd = '';

        if (courseData.course_start_at != null) {
            courseStart = courseData.formatted_start;
        }
        if (courseData.course_end_at != null) {
            courseEnd = courseData.formatted_end;
        }

        return (
            <div>
                <form action="/assign_dates" id="select_start" method="POST">
                    <DateInput
                        start={ courseStart }
                        end={ courseEnd }
                        onChange={ this.dateChange }
                    />
                    <h2>Repetitions</h2>
                    <WeekInput />
                    <RepetitionsInput count={ this.state.maxRepetitions } />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }

};
// <h1>Select when you want your first {{ assignment_type }} to start.</h1>
// <form action="{{ url_for('assign_dates', _external=True) }}" id="select_start" method="POST">


var AJAXRequest = function(type, url, callback) {
    var postRequest = new XMLHttpRequest();
    postRequest.addEventListener("load", 
        function() {
            var data = JSON.parse(this.responseText);
            callback(data);
        });
    postRequest.open(type, url);
    postRequest.send();
}

function getCourseData() {
    var postRequest = new XMLHttpRequest();
    var rUrl = "/get_course_data"
    postRequest.open("POST", rUrl, false);
    postRequest.send(null);
    var rJSON = JSON.parse(postRequest.response);
    return rJSON;
}

function getAssignmentCount() {
    var postRequest = new XMLHttpRequest();
    var rUrl = "/get_assignment_count"
    postRequest.open("POST", rUrl, false);
    postRequest.send(null);
    var rString = postRequest.responseText;
    return rString;
}

var DateInput = React.createClass({
// Uses start and end dates from 
// COURSE_DATA['formatted_start']
// COURSE_DATA['formatted_end']
    // sets initial state
    render: function() {

        return (
            <div>
                <label>
                    Due Date:&nbsp;
                    <input 
                        type="date"
                        name="date_select"
                        id="date_select"
                        min={ this.props.start }
                        max={ this.props.end }
                        onChange={this.props.onChange }
                        required
                    />
                </label>
                <label>
                    Due Time:&nbsp;
                    <input
                        type="time"
                        name="time_select"
                        id="time_select"
                        defaultValue="23:59"
                        required
                    />
                </label>
            </div>
        )
    }
});

var WeekInput = React.createClass({
    // sets initial state
    getInitialState: function(){
        return { max: 4 };
    },

    handleChange: function(event){
        // this.setState({searchString:event.target.value});
        console.log("Weeks Changed");
    },

    render: function() {

        return (
            <p>
                <label>
                    Every&nbsp;
                    <input
                        type="number"
                        name="recurring_weeks"
                        id="recurring_weeks"
                        min="0"
                        defaultValue={ 1 }
                        max={ this.state.max }
                        onChange={ this.handleChange } 
                        required
                    />&nbsp;
                    week(s)
                </label>
            </p>
        )
    }
});

var RepetitionsInput = React.createClass({
// number of possible repetions needs to be calculated
    // sets initial state
    getInitialState: function(){
        return { count: '' };
    },
    handleChange: function(event){
        // this.setState({searchString:event.target.value});
        console.log("Repetitions Changed");
    },
    render: function() {

        return (
            <p>
                <label>
                    Number of repetitions:&nbsp;
                    <input
                        type="number"
                        name="repetitions"
                        id="repetitions"
                        min="0"
                        max={ this.props.count-1 }
                        defaultValue={ this.props.count-1 }
                        onChange={this.handleChange } 
                        required
                    />
                </label>
            </p>
        )
    }
});

ReactDOM.render(
    <DateSelectForm />,
    document.getElementById('date_select_form')
);