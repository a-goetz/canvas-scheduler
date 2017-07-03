import React from 'react';

export default class CourseInfo extends React.Component {
	render(){
		const course_start_date = true;
		const course_end_date = true;

		const assignments = ['stuff', 'things', 'whatnot'];

		const assignment_type = ['whathaveyou'];

		const formatted_start = "formatted start";
		const formatted_end = "formatted_end";

		return(
			<div>
				{ formatted_start != null && 
		 			<p>Course Start: { formatted_start }</p>
		 		}
		 		{  formatted_start != null &&
		 			<p>Course End: { formatted_end }</p>
		 		}

				<h2>{ assignments.length } { assignment_type } in your course:</h2>

				<ul>
					{
						assignments.map(function(name, index) { 
		    	            return <li key={ index }>{name}</li>;
						}
					)}
				</ul>
			</div>
		)
	}
}
// CONDITIONAL RENDERING
// https://facebook.github.io/react/docs/conditional-rendering.html#inline-if-with-logical--operator

// ITERATING THROUGH A LOOP
// https://thinkster.io/tutorials/iterating-and-rendering-loops-in-react


// {% if assignment_type == 'assignments' %}
// <li>{{ item.name }}</li>
// {% else %}
// <li>{{ item.title }}</li>
// {% endif %}
