import React from 'react';
import ReactDOM from 'react-dom';
// import Calendar from './calendar';
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

        // var assignmentData = getAssignmentData();
        var events = setEvents();

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
                    <input class="btn btn-primary" type="submit" value="Submit" />
                </form>
            </div>
        )
    }

};
// <h1>Select when you want your first {{ assignment_type }} to start.</h1>
// <form action="{{ url_for('assign_dates', _external=True) }}" id="select_start" method="POST">


class DateInput extends React.Component {
// Uses start and end dates from 
// COURSE_DATA['formatted_start']
// COURSE_DATA['formatted_end']
    // sets initial state
    render() {

        return (
            <div class="form-group">
                <label for="date_select">
                    Due Date:&nbsp;
                    <input 
                        class="form-control"
                        type="date"
                        name="date_select"
                        id="date_select"
                        min={ this.props.start }
                        max={ this.props.end }
                        onChange={this.props.onChange }
                        required
                    />
                </label>
                <label for="time_select">
                    Due Time:&nbsp;
                    <input
                        class="form-control"
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
};

class WeekInput extends React.Component {
    // sets initial state
    constructor(props) {
        super(props);
        this.state = { max: 4 };
        // this.state = { max: this.props.initialMax };
    }

    handleChange(event) {
        // this.setState({searchString:event.target.value});
        console.log("Weeks Changed");
    }

    render() {

        return (
            <p class="form-group">
                <label for="recurring_weeks">
                    Every&nbsp;
                    <input
                        class="form-control"
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
};

class RepetitionsInput extends React.Component {
// number of possible repetions needs to be calculated
    // sets initial state
    constructor(props) {
        super(props);
        this.state = { count: '' };
        // this.state = { count: this.props.initialCount };
    }

    handleChange(event){
        // this.setState({searchString:event.target.value});
        console.log("Repetitions Changed");
    }

    render() {

        return (
            <p class="form-group">
                <label for="repetitions">
                    Number of repetitions:&nbsp;
                    <input
                        class="form-control"
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
};

ReactDOM.render(
    <DateSelectForm />,
    document.getElementById('date_select_form')
);

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

// function getAssignmentData() {
//     var postRequest = new XMLHttpRequest();
//     var rUrl = "/get_assignments"
//     postRequest.open("POST", rUrl, false);
//     postRequest.send(null);
//     console.log(postRequest.respose);
//     return "bla";
// }

function getAssignmentCount() {
    var postRequest = new XMLHttpRequest();
    var rUrl = "/get_assignment_count"
    postRequest.open("POST", rUrl, false);
    postRequest.send(null);
    var rString = postRequest.responseText;
    return rString;
}

function setEvents() {
    return [
        {
            'title': 'All Day Event',
            'allDay': true,
            'start': new Date(2015, 3, 0),
            'end': new Date(2015, 3, 1)
        },
        {
            'title': 'Long Event',
            'start': new Date(2015, 3, 7),
            'end': new Date(2015, 3, 10)
        },

        {
            'title': 'DTS STARTS',
            'start': new Date(2016, 2, 13, 0, 0, 0),
            'end': new Date(2016, 2, 20, 0, 0, 0)
        },

        {
            'title': 'DTS ENDS',
            'start': new Date(2016, 10, 6, 0, 0, 0),
            'end': new Date(2016, 10, 13, 0, 0, 0)
        },

        {
            'title': 'Some Event',
            'start': new Date(2015, 3, 9, 0, 0, 0),
            'end': new Date(2015, 3, 9, 0, 0, 0)
        },
        {
            'title': 'Conference',
            'start': new Date(2015, 3, 11),
            'end': new Date(2015, 3, 13),
        desc: 'Big conference for important people'
        },
        {
            'title': 'Meeting',
            'start': new Date(2015, 3, 12, 10, 30, 0, 0),
            'end': new Date(2015, 3, 12, 12, 30, 0, 0),
        desc: 'Pre-meeting meeting, to prepare for the meeting'
        }
    ]
}