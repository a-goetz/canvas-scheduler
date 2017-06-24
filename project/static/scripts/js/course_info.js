(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class CourseInfo extends React.Component {
	render(){
		const course_start_date = true;
		const course_end_date = true;
		const formatted_start = "the future is now";
		const formatted_end = "or it was a minute ago";

		const assignments = ['stuff', 'things', 'whatnot'];

		const assignment_type = ['whathaveyou'];

		return(
			React.createElement("div", null, 


				React.createElement("h2", null,  assignments.length, " ",  assignment_type, " in your course:"), 

				React.createElement("ul", null, 
					
						assignments.map(function(name, index) { 
		    	            return React.createElement("li", {key:  index }, name);
						}
					)
				)
			)
		)
	}
}

			// <div>
			// 	{ course_start_date ? (
			// 		<p>Course Start: { formatted_start }</p>
			// 	)}
			// 	{ course_end_date ? (
			// 		<p>Course End: { formatted_end }</p>
			// 	)}

			// 	<h2>{ assignments.length } { assignment_type } in your course:</h2>

			// 	<ul>
			// 		{assignments.map(function(name, index) { 
	    	//          return <li key={ index }>{name}</li>;
			// 		})}
			// 	</ul>
			// </div>


// {% if assignment_type == 'assignments' %}
// <li>{{ item.name }}</li>
// {% else %}
// <li>{{ item.title }}</li>
// {% endif %}



// https://thinkster.io/tutorials/iterating-and-rendering-loops-in-react
// var Hello = React.createClass({
//     render: function() {
//         var names = ['Jake', 'Jon', 'Thruster'];
//         return (
//             <ul>
//                 {names.map(function(name, index){
//                     return <li key={ index }>{name}</li>;
//                   })}
//             </ul>
//         )
//     }
// });

},{}]},{},[1]);
