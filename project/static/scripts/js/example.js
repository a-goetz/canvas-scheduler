(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

// EXAMPLE CODE
var DynamicSearch = React.createClass({
  displayName: "DynamicSearch",


  // sets initial state
  getInitialState: function getInitialState() {
    return { searchString: '' };
  },

  // sets state, triggers render method
  handleChange: function handleChange(event) {
    // grab value form input box
    this.setState({ searchString: event.target.value });
    console.log("scope updated!");
  },

  render: function render() {

    var countries = this.props.items;
    var searchString = this.state.searchString.trim().toLowerCase();

    // filter countries list by value from input box
    if (searchString.length > 0) {
      countries = countries.filter(function (country) {
        return country.name.toLowerCase().match(searchString);
      });
    }

    return React.createElement(
      "div",
      null,
      React.createElement("input", { type: "text", value: this.state.searchString, onChange: this.handleChange, placeholder: "Search!" }),
      React.createElement(
        "ul",
        null,
        countries.map(function (country) {
          return React.createElement(
            "li",
            null,
            country.name,
            " "
          );
        })
      )
    );
  }

});

// list of countries, defined with JavaScript object literals
var countries = [{ "name": "Sweden" }, { "name": "China" }, { "name": "Peru" }, { "name": "Czech Republic" }];

// ReactDOM.render(
//   <DynamicSearch items={ countries } />,
//   document.getElementById('main')
// );

},{}]},{},[1]);
