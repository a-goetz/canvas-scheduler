from canvasapi import Canvas, course, assignment, quiz
from flask import Flask, render_template, session, request, Response
from pylti.flask import lti
import settings
import logging
import json
from logging.handlers import RotatingFileHandler

app = Flask(__name__)
app.secret_key = settings.secret_key
app.config.from_object(settings.configClass)
canvas = Canvas(settings.CANVAS_API_URL, settings.CANVAS_API_KEY)

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

ITEM_LIST = []


# ============================================
# Utility Functions
# ============================================

def return_error(msg):
    return render_template('error.htm.j2', msg=msg)


def error(exception=None):
    app.logger.error("PyLTI error: {}".format(exception))
    return return_error('''Authentication error,
        please refresh and try again. If this error persists,
        please contact support.''')


# Set session variable to match variable from the course json.
def set_vars(course_json, wanted_vars):
    return_obj = {}

    for item in wanted_vars:
        this_item = 'course_' + item
        try:
            session[this_item] = course_json[item]
            return_obj[this_item] = session[this_item]
        except:
            session[this_item] = None
            return_obj[this_item] = session[this_item]
            print 'Could not obtain value for: ' + this_item
            pass

    return return_obj


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

    options = ['assignments', 'quizzes', 'discussions']

    return render_template(
        'launch.htm.j2',
        options=options
    )


# Select start date
@app.route('/select_date', methods=['POST'])
def date_select(lti=lti):
    cid = session['custom_canvas_course_id']
    this_course = canvas.get_course(course_id=cid)
    course_json = json.loads(this_course.to_json())

    wanted_vars = [
        'name', 'id', 'account_id', 'start_at',
        'end_at', 'time_zone', 'course_code'
    ]
    course_obj = set_vars(course_json=course_json, wanted_vars=wanted_vars)

    session['assignment_type'] = request.form['selection']
    selection = session['assignment_type']

    assignment_type = session['assignment_type']
    item_list = []
    list_length = 0

    if assignment_type == 'assignments':
        assignments = this_course.get_assignments()
        for item in assignments:
            if 'online_quiz' not in item.submission_types \
                    and 'discussion_topic' not in item.submission_types:
                item_list.append(item)
        list_length = len(item_list)

    elif assignment_type == 'quizzes':
        quizzes = this_course.get_quizzes()
        for item in quizzes:
            item_list.append(item)
        list_length = len(item_list)

    elif assignment_type == 'discussions':
        discussions = this_course.get_discussion_topics()
        for item in discussions:
            item_list.append(item)
        list_length = len(item_list)

    else:
        print "No assignments of that type"

    global ITEM_LIST
    ITEM_LIST = item_list

    return render_template(
        'date.htm.j2',
        course_obj=course_obj,
        selection=selection,
        assignment_type=assignment_type,
        list_length=list_length,
        item_list=item_list
    )


# Select assignments for dates
@app.route('/assign_dates', methods=['POST'])
def assign_dates(lti=lti):
    '''
    date_select    2017-06-15
    time_select    23:59
    repetitions    7
    '''
    import datetime

    # 2017-06-15 23:59
    selected_date = request.form['date_select'] + \
        ' ' + request.form['time_select']
    start_date = datetime.datetime.strptime(selected_date, "%Y-%m-%d %H:%M")
    repetitions = request.form['repetitions']

    date_list = []

    for x in range(0, int(repetitions)+1):
        days = 7*x
        newdate = start_date + datetime.timedelta(days=days)
        date_list.append(newdate)

    global ITEM_LIST
    assignment_type = session['assignment_type']

    date_list = enumerate(date_list)

    return render_template(
        'assign.htm.j2',
        selected_date=selected_date,
        date_list=date_list,
        item_list=ITEM_LIST,
        assignment_type=assignment_type
    )


# Select assignments for dates
@app.route('/process_complete', methods=['POST'])
def process_complete(lti=lti):

    return render_template(
        'review.htm.j2'
    )


# Home page
@app.route('/', methods=['GET'])
def index(lti=lti):
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
