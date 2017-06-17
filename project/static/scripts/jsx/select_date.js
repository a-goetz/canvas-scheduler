var DateSelectForm = React.createClass({

    render: function() {

        return (
            <div>
                <DateInput />
                <h2>Repetitions</h2>
                <WeekInput />
                <RepetitionsInput />
                <input type="submit" value="Submit" />
            </div>
        )
    }

});

var DateInput = React.createClass({
// needs start and end dates from 
// COURSE_DATA['formatted_start']
// COURSE_DATA['formatted_end']
// @app.route('/get_course_data', methods=['POST'])
    render: function() {

        return (
            <div>
                <label>
                    Due Date:&nbsp;
                    <input 
                        type="date"
                        name="date_select"
                        id="date_select"
                        required />
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

});

var WeekInput = React.createClass({

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
                        max="4"
                    />&nbsp;
                    weeks
                </label>
            </p>
        )
    }

});

var RepetitionsInput = React.createClass({
// number of possible repetions needs to be calculated
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