function getCourseData() {
    var postRequest = new XMLHttpRequest();
    var rUrl = "/get_course_data"
    postRequest.open("POST", rUrl, false);
    postRequest.send(null);
    rJSON = JSON.parse(postRequest.response);
    return rJSON;
}

function getAssignmentCount() {
    var postRequest = new XMLHttpRequest();
    var rUrl = "/get_assignment_count"
    postRequest.open("POST", rUrl, false);
    postRequest.send(null);
    rString = postRequest.responseText;
    return rString;
}

var DateSelectForm = React.createClass({

    render: function() {

        var courseData = getCourseData();
        var courseStart = '';
        var courseEnd = '';

        if (courseData.course_start_at != null) {
            courseStart = courseData.formatted_start;
        }
        if (courseData.course_end_at != null) {
            courseEnd = courseData.formatted_end;
        }

        var assignmentCount = getAssignmentCount();

        return (
            <div>
                <DateInput start={courseStart} end={courseEnd} />
                <h2>Repetitions</h2>
                <WeekInput />
                <RepetitionsInput count={assignmentCount} />
                <input type="submit" value="Submit" />
            </div>
        )
    }

});

class DateInput extends React.Component {
// Uses start and end dates from 
// COURSE_DATA['formatted_start']
// COURSE_DATA['formatted_end']

    render() {

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
                        required
                    />
                </label>
                <label>
                    Due Time:&nbsp;
                    <input
                        type="time"
                        name="time_select"
                        id="time_select"
                        value="23:59"
                        required
                    />
                </label>
            </div>
        )
    }
}

class WeekInput extends React.Component {

    render() {

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
                        max="4"
                    />&nbsp;
                    week(s)
                </label>
            </p>
        )
    }
}

class RepetitionsInput extends React.Component {
// number of possible repetions needs to be calculated
    render() {

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
                        required
                    />
                </label>
            </p>
        )
    }
}

ReactDOM.render(
    <DateSelectForm />,
    document.getElementById('date_select_form')
);