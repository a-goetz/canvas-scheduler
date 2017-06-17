(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var DateSelectForm = React.createClass({displayName: "DateSelectForm",

    render: function() {

        return (
            React.createElement("div", null, 
                React.createElement(DateInput, null), 
                React.createElement("h2", null, "Repetitions"), 
                React.createElement(WeekInput, null), 
                React.createElement(RepetitionsInput, null), 
                React.createElement("input", {type: "submit", value: "Submit"})
            )
        )
    }

});

var DateInput = React.createClass({displayName: "DateInput",
// needs start and end dates from 
// COURSE_DATA['formatted_start']
// COURSE_DATA['formatted_end']
// @app.route('/get_course_data', methods=['POST'])
    render: function() {

        return (
            React.createElement("div", null, 
                React.createElement("label", null, 
                    "Due Date: ", 
                    React.createElement("input", {
                        type: "date", 
                        name: "date_select", 
                        id: "date_select", 
                        required: true})
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

});

var WeekInput = React.createClass({displayName: "WeekInput",

    render: function() {

        return (
            React.createElement("p", null, 
                React.createElement("label", null, 
                    "Every ", 
                    React.createElement("input", {
                        type: "number", 
                        name: "recurring_weeks", 
                        id: "recurring_weeks", 
                        min: "0", 
                        max: "4"}
                    ), " " + ' ' +
                    "weeks"
                )
            )
        )
    }

});

var RepetitionsInput = React.createClass({displayName: "RepetitionsInput",
// number of possible repetions needs to be calculated
    render: function() {

        return (
            React.createElement("p", null, 
                React.createElement("label", null, 
                    "Number of repetitions: ", 
                    React.createElement("input", {
                        type: "number", 
                        name: "repetitions", 
                        id: "repetitions", 
                        min: "0", 
                        required: true}
                    )
                )
            )
        )
    }

});

ReactDOM.render(
    React.createElement(DateSelectForm, null),
    document.getElementById('date_select_form')
);

},{}]},{},[1]);
