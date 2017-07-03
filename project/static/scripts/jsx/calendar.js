import React from 'react';
import BigCalendar from 'react-big-calendar';
import moment from 'moment';

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
BigCalendar.momentLocalizer(moment); // or globalizeLocalizer

let allViews = Object.keys(BigCalendar.views).map(k => BigCalendar.views[k])

export default class Calendar extends React.Component {
	constructor(props) {
		super(props);
		this.state = { events: this.props.events }
	}

	render() {

		const today = new Date();
		const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

		return (
			<div>
				<BigCalendar
					{...this.props}
					culture='en-GB'
					events={this.props.events}
					views={allViews}
					defaultDate={today}
				/>
			</div>
		)
	}
}


// ReactDOM.render(
//     <Calendar />,
//     document.getElementById('calendar')
// );
