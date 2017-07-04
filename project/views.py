from canvasapi import Canvas
from flask import Flask, render_template, session, request, Response
from pylti.flask import lti
import logging
import json
from logging.handlers import RotatingFileHandler

import os

if 'HEROKU_ENV' in os.environ:
    import heroku_settings as settings
else:
    import settings


app = Flask(__name__)
app.secret_key = settings.secret_key
app.config.from_object(settings.configClass)


# ============================================
# Globals
# ============================================

CANVAS = Canvas(settings.CANVAS_API_URL, settings.CANVAS_API_KEY)
ASSIGNMENTS = []
ASSIGNMENTS_EASY = []
COURSE_DATA = {}

# ============================================
# Logging
# ============================================

formatter = logging.Formatter(settings.LOG_FORMAT)
handler = RotatingFileHandler(
    settings.LOG_FILE,
    maxBytes=settings.LOG_MAX_BYTES,
    backupCount=settings.LOG_BACKUP_COUNT
)
handler.setLevel(logging.getLevelName(settings.LOG_LEVEL))
handler.setFormatter(formatter)
app.logger.addHandler(handler)


# ============================================
# Utility Functions
# ============================================

def return_error(msg):
    """
    Return the error template with error message.
    """
    return render_template('error.htm.j2', msg=msg)


def error(exception=None):
    """
    Handle error
    """
    app.logger.error("PyLTI error: {}".format(exception))
    return return_error('''Authentication error,
        please refresh and try again. If this error persists,
        please contact support.''')


def format_date_from_iso(iso):
    """
    """
    # 2017-05-15T06:00:00Z
    import datetime
    date = datetime.datetime.strptime(iso, "%Y-%m-%dT%H:%M:%SZ")
    date = date.strftime("%Y-%m-%d")
    return date


def set_vars(course_json, wanted_vars):
    """
    Set session variable to match variable from the course json.
    """
    global COURSE_DATA
    return_obj = {}

    for item in wanted_vars:
        this_item = 'course_' + item
        try:
            COURSE_DATA[this_item] = course_json[item]
            return_obj[this_item] = COURSE_DATA[this_item]
        except:
            COURSE_DATA[this_item] = None
            return_obj[this_item] = COURSE_DATA[this_item]
            print 'Could not obtain value for: ' + this_item
            pass

    if COURSE_DATA['course_start_at'] is not None:
        COURSE_DATA['formatted_start'] = \
            format_date_from_iso(COURSE_DATA['course_start_at'])
    else:
        COURSE_DATA['formatted_start'] = None
    if COURSE_DATA['course_end_at'] is not None:
        COURSE_DATA['formatted_end'] = \
            format_date_from_iso(COURSE_DATA['course_end_at'])
    else:
        COURSE_DATA['formatted_end'] = None


# ============================================
# Web Views / Routes
# ============================================

# LTI Launch
@app.route('/launch', methods=['POST', 'GET'])
@lti(error=error, request='initial', role='any', app=app)
def launch(lti=lti):
    """
    Returns the launch page
    request.form will contain all the lti params
    """
    session['custom_canvas_course_id'] = request.form.get(
        'custom_canvas_course_id')

    return render_template(
        'launch.htm.j2'
    )


# Select start date
@app.route('/select_date', methods=['POST'])
def date_select(lti=lti):
    """

    """

    cid = session['custom_canvas_course_id']
    course = CANVAS.get_course(course_id=cid)
    course_json = json.loads(course.to_json())

    wanted_vars = [
        'name', 'id', 'account_id', 'start_at',
        'end_at', 'time_zone', 'course_code'
    ]
    # Stores desired variables in global COURSE_DATA
    set_vars(course_json=course_json, wanted_vars=wanted_vars)

    session['assignment_type'] = request.form['selection']

    global ASSIGNMENTS
    ASSIGNMENTS = []

    if session['assignment_type'] == 'assignments':
        assignments = course.get_assignments()
        for item in assignments:
            if 'online_quiz' not in item.submission_types \
                    and 'discussion_topic' not in item.submission_types:
                ASSIGNMENTS.append(item)

    elif session['assignment_type'] == 'quizzes':
        quizzes = course.get_quizzes()
        for item in quizzes:
            ASSIGNMENTS.append(item)

    elif session['assignment_type'] == 'discussions':
        discussions = course.get_discussion_topics()
        for item in discussions:
            ASSIGNMENTS.append(item)
    else:
        print "No assignments of that type"

    global COURSE_DATA

    return render_template(
        'date.htm.j2',
        course_obj=COURSE_DATA,
        assignment_type=session['assignment_type'],
        list_length=len(ASSIGNMENTS),
        item_list=ASSIGNMENTS
    )


def get_date_select_vars():
    return


# Select assignments for dates
@app.route('/assign_dates', methods=['POST'])
def assign_dates(lti=lti):
    '''
    Creates dates starting with the date/time indicated
        by the from from date.htm.j2. Creates a number of
        dates based on the 'repetitions' parameter.
    :param date_select: String, format example: '2017-06-15'
    :param time_select: String, format example: '23:59'
    :param repetitions: String, format example: '7'

    :methods: Uses python Datetime library to adjust and combine
        the dates provided.

    :returns: assign.htm.j2 page that allows the user to
        attach the dates to assignments that exist in the course.
    '''
    import datetime

    # 2017-06-15 23:59
    selected_date = request.form['date_select'] + \
        ' ' + request.form['time_select']
    start_date = datetime.datetime.strptime(selected_date, "%Y-%m-%d %H:%M")
    repetitions = request.form['repetitions']

    daytotal = 1

    if request.form['recurring_weeks'] > 0:
        daytotal = int(request.form['recurring_weeks']) * 7

    date_list = []

    for x in range(0, int(repetitions)+1):
        days = daytotal*x
        newdate = start_date + datetime.timedelta(days=days)
        date_list.append(newdate)

    global ASSIGNMENTS
    assignment_type = session['assignment_type']

    return render_template(
        'assign.htm.j2',
        selected_date=selected_date,
        date_list=date_list,
        item_list=ASSIGNMENTS,
        assignment_type=assignment_type
    )


# Select assignments for dates
@app.route('/process_complete', methods=['POST'])
def process_complete(lti=lti):
    """
    Completes the process of changing the dates.

    :methods: uses assignment.edit(), quiz.edit(), or discussion.update()
        from the canvasapi python library. Uses python Datetime library to
        adjust the given times.

    :param request: The form from assign.htm.j2. Contains a 'key' indicating
        the desired date, and an 'assignment' containing the assignment id.

    :returns: review page with updated assignment information.
    """
    import datetime

    cid = session['custom_canvas_course_id']
    course = CANVAS.get_course(course_id=cid)

    assignment_type = session['assignment_type']

    assignment_list = []
    r = request.form
    for key, value in r.iteritems():
        assignment_list.append(
            {
                'date': key,
                'assignment': value
            }
        )

    canvas_obj_list = []

    for item in assignment_list:

        date = datetime.datetime.strptime(
            item['date'], "%Y-%m-%d %H:%M:%S"
        )

        if assignment_type == 'assignments':
            # Accepts times in ISO 8601 format, e.g. 2014-10-21T18:48:00Z.
            date = date.strftime("%Y-%m-%dT%H:%M:%S-06:00")
            this_assignment = course.get_assignment(item['assignment'])
            new_assignment = {"due_at": date}
            this_assignment.edit(assignment=new_assignment)
            canvas_obj_list.append(this_assignment)

        elif assignment_type == 'quizzes':
            # Accepts times in ISO 8601 format, e.g. 2011-10-21T18:48Z.
            date = date.strftime("%Y-%m-%dT%H:%M:%S-06:00")
            this_quiz = course.get_quiz(item['assignment'])
            new_quiz = {"due_at": date}
            this_quiz.edit(quiz=new_quiz)
            canvas_obj_list.append(this_quiz)

        elif assignment_type == 'discussions':
            this_discussion = course.get_discussion_topic(item['assignment'])
            this_discussion.update(lock_at=date)
            canvas_obj_list.append(this_discussion)

    return render_template(
        'review.htm.j2',
        assignment_list=assignment_list,
        canvas_obj_list=canvas_obj_list
    )


# ============================================
# Data Retrieval
# ============================================

@app.route('/get_course_data', methods=['POST'])
def get_course_data(lti=lti):
    global COURSE_DATA
    return json.dumps(COURSE_DATA)


@app.route('/get_assignments', methods=['POST'])
def get_assignments(lti=lti):
    global ASSIGNMENTS
    thisItem = ASSIGNMENTS[0].to_json()
    # for item in ASSIGNMENTS:
    #     item_json = item.to_json()
    #     print item_json
    # return assignment_list
    return thisItem


@app.route('/get_assignment_count', methods=['POST'])
def get_assignment_count(lti=lti):
    global ASSIGNMENTS
    result = len(ASSIGNMENTS)
    return str(result)


@app.route('/get_assignment_type', methods=['POST'])
def get_assignment_type(lti=lti):
    return session['assignment_type']


# ============================================
# Static Pages
# ============================================

# Home page
@app.route('/', methods=['GET'])
def index(lti=lti):
    """
    Home page for the lti. Displays information and
    links to the xml and launch pages.
    """
    return render_template('index.htm.j2')


# LTI XML Configuration
@app.route("/xml/", methods=['GET'])
def xml():
    """
    Returns the lti.xml file for the app.
    XML can be built at https://www.eduappcenter.com/
    """
    try:
        return Response(render_template(
            'lti.xml.j2'), mimetype='application/xml'
        )
    except:
        app.logger.error("Error with XML.")
        return return_error('''Error with XML. Please refresh and try again. If this error persists,
            please contact support.''')


if __name__ == "__main__":
    app.run()
