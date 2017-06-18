(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

var DateSelectForm = React.createClass({displayName: "DateSelectForm",

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
            React.createElement("div", null, 
                React.createElement(DateInput, {start: courseStart, end: courseEnd}), 
                React.createElement("h2", null, "Repetitions"), 
                React.createElement(WeekInput, null), 
                React.createElement(RepetitionsInput, {count: assignmentCount}), 
                React.createElement("input", {type: "submit", value: "Submit"})
            )
        )
    }

});

class DateInput extends React.Component {
// Uses start and end dates from 
// COURSE_DATA['formatted_start']
// COURSE_DATA['formatted_end']

    render() {

        return (
            React.createElement("div", null, 
                React.createElement("label", null, 
                    "Due Date: ", 
                    React.createElement("input", {
                        type: "date", 
                        name: "date_select", 
                        id: "date_select", 
                        min:  this.props.start, 
                        max:  this.props.end, 
                        required: true}
                    )
                ), 
                React.createElement("label", null, 
                    "Due Time: ", 
                    React.createElement("input", {
                        type: "time", 
                        name: "time_select", 
                        id: "time_select", 
                        value: "23:59", 
                        required: true}
                    )
                )
            )
        )
    }
}

class WeekInput extends React.Component {

    render() {

        return (
            React.createElement("p", null, 
                React.createElement("label", null, 
                    "Every ", 
                    React.createElement("input", {
                        type: "number", 
                        name: "recurring_weeks", 
                        id: "recurring_weeks", 
                        min: "0", 
                        defaultValue:  1, 
                        max: "4"}
                    ), " " + ' ' +
                    "week(s)"
                )
            )
        )
    }
}

class RepetitionsInput extends React.Component {
// number of possible repetions needs to be calculated
    render() {

        return (
            React.createElement("p", null, 
                React.createElement("label", null, 
                    "Number of repetitions: ", 
                    React.createElement("input", {
                        type: "number", 
                        name: "repetitions", 
                        id: "repetitions", 
                        min: "0", 
                        max:  this.props.count-1, 
                        defaultValue:  this.props.count-1, 
                        required: true}
                    )
                )
            )
        )
    }
}

ReactDOM.render(
    React.createElement(DateSelectForm, null),
    document.getElementById('date_select_form')
);

},{}]},{},[1]);
