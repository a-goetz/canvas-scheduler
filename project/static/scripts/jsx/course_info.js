class CourseInfo extends React.Component {
	render(){
		const course_start_date = true;
		const course_end_date = true;
		const formatted_start = "the future is now";
		const formatted_end = "or it was a minute ago";

		const assignments = ['stuff', 'things', 'whatnot'];

		const assignment_type = ['whathaveyou'];

		return(
			<div>


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