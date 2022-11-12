from flask import Flask, request
from flask_cors import CORS
from flask_cors import cross_origin
from controller.user import BaseUser
from controller.time_slot import BaseTimeSlot
from controller.user_schedule import BaseUserSchedule
from controller.members import BaseMembers
from controller.session_schedule import BaseSessionSchedule
from controller.transactions import BaseTransactions
from controller.tutoring_session import BaseSession
from controller.course import BaseCourse
from controller.masters import BaseMasters
import json

app = Flask(__name__)

@app.route('/')
def index():
    return "<h1>Hola Hovito<h1/>"

"""""""""""""MAIN ENTITY HANDLERS (CRUD Operations)"""""""""""""""

@app.route('/tuter/users', methods=['GET', 'POST'])
def handleUsers():
    if request.method == 'POST':  # ADD
        return BaseUser().addNewUser(request.json)
    else:
        return BaseUser().getAllUsers()  # Get list of all users

@app.route('/tuter/users/<int:user_id>', methods=['GET', 'PUT', 'DELETE'])
def handleUsersbyId(user_id):
    if request.method == 'GET':
        return BaseUser().getUserById(user_id)
    elif request.method == 'PUT':
        return BaseUser().updateUser(user_id, request.json)
    elif request.method == 'DELETE':
        return BaseUser().deleteUser(user_id)

@app.route('/tuter/login', methods=['POST'])
def handleSignInInformation():
    return BaseUser().getUserByLoginInfo(request.json)

@app.route('/tuter/users/usernames', methods=['POST'])
def handleUsernames():
    if request.method == 'POST':
        return BaseUser().getRequestedIds(request.json)

@app.route('/tuter/users/descriptions', methods=['POST'])
def handleDescription():
    if request.method == 'POST':
        return BaseUser().updateDescription(request.json)

@app.route('/tuter/users/department', methods=['POST'])
def handleDepartment():
    if request.method == 'POST':
        return BaseUser().updateDepartment(request.json)

@app.route('/tuter/user-schedule', methods=['GET', 'POST'])
def handleUserSchedules():
    if request.method == 'POST':
        return BaseUserSchedule().addNewUserSchedule(request.json)
    else:
        return BaseUserSchedule().getAllUserSchedules()

@app.route('/tuter/set-rating', methods=['POST'])
def setUserRating():
    if request.method == 'POST':
        return BaseUser().setUserRating(request.json)

@app.route('/tuter/user-schedule/<int:us_id>', methods=['GET', 'PUT', 'DELETE'])
def handleUserSchedulebyId(us_id):
    if request.method == 'GET':
        return BaseUserSchedule().getUserScheduleById(us_id)
    elif request.method == 'PUT':
        return BaseUserSchedule().updateUserSchedule(us_id, request.json)
    elif request.method == 'DELETE':
        return BaseUserSchedule().deleteUserSchedule(us_id)

@app.route('/tuter/user-schedule/markunavailable', methods=['POST'])
def handlemarkUserUnavailable():
    print(request.json)
    print(request.data)
    if request.json is not None:
        return BaseUserSchedule().addNewUserSchedule(request.json)
    else:
        return BaseUserSchedule().addNewUserSchedule(json.loads(request.data))

@app.route('/tuter/user-schedule/markavailable', methods=['POST'])
def handlemarkUserAvailable():
    return BaseUserSchedule().markAvailable(request.json)

@app.route('/tuter/timeslots', methods=['GET'])
def handleTimeSlots():
    return BaseTimeSlot().getAllTimeSlots()

@app.route('/tuter/timeslots/<int:ts_id>', methods=['GET'])
def handleTimeSlotbyId(ts_id):
    return BaseTimeSlot().getTimeSlotByTimeSlotId(ts_id)

@app.route('/tuter/members/', methods=['GET'])
def handleMembers():
    return BaseMembers().getAllMembers()
@app.route('/tuter/members/<int:user_id>', methods=['GET', 'POST', 'DELETE'])
def handleMembersbyUserId(user_id):
    if request.method == 'GET':
        return BaseMembers().getMembersByUserId(user_id)
    elif request.method == 'POST':
        return BaseMembers().addNewMember(request.json)
    elif request.method == 'DELETE':
        return BaseMembers().deleteMember(user_id, request.json)

@app.route('/tuter/session-schedule/', methods=['GET', 'POST'])
def handleSessionSchedulebyId():
    if request.method == 'GET':
        return BaseSessionSchedule().getAllSessionSchedules()
    elif request.method == 'POST':
        return BaseSessionSchedule().addNewSessionSchedule(request.json)

@app.route('/tuter/session-schedule/<int:session_id>', methods=['GET', 'DELETE'])
def handleSessionSchedulebySessionId(session_id):
    if request.method == 'GET':
        return BaseSessionSchedule().getSessionScheduleBySessionId(session_id)
    elif request.method == 'DELETE':
        return BaseSessionSchedule().deleteSessionSchedule(session_id)

@app.route('/tuter/transactions/', methods=['GET', 'POST'])
def handleTransactions():
    if request.method == 'GET':
        return BaseTransactions().getAllTransactions()
    elif request.method == 'POST':
        return BaseTransactions().addNewTransaction(request.json)

@app.route('/tuter/transactions/<int:transaction_id>', methods=['GET', 'DELETE'])
def handleTransactionsbyTransactionId(transaction_id):
    if request.method == 'GET':
        return BaseTransactions().getTransactionsByTransactionId(transaction_id)
    # elif request.method == 'PUT':
    #     return BaseTransactions().addNewTransaction(request.json)
    elif request.method == 'DELETE':
        return BaseTransactions().deleteTransaction(transaction_id)

@app.route('/tuter/tutoring-sessions', methods=['GET', 'POST'])
def handleTutoringSessions():
    if request.method == 'GET':
        return BaseSession().getAllSessions()
    elif request.method == 'POST':
        return BaseSession().addNewSession(request.json)  # Finish this and verify

@app.route('/tuter/tutoring-session/<int:session_id>', methods=['GET', 'PUT', 'DELETE'])
def handleTutoringSessionsbySessionId(session_id):
    if request.method == 'GET':
        return BaseSession().getSessionById(session_id)
    elif request.method == 'PUT':
        return BaseSession().updateSession(session_id, request.json)
    elif request.method == 'DELETE':
        return BaseSession().deleteSession(session_id)

@app.route('/tuter/user/tutoring-session/<int:user_id>', methods=['GET'])
def handleTutoringSessionsbyUserId(user_id):
    if request.method == 'GET':
        return BaseSession().getSessionsByUserId(user_id)

@app.route('/tuter/courses', methods=['GET', 'POST'])
def handleCourses():
    if request.method == 'POST':
        return BaseCourse().addCourse(request.json)
    else:
        return BaseCourse().getAllRegularCourses()  # Get list of all regular courses

@app.route('/tuter/courses/<int:course_id>', methods=['GET', 'PUT'])
def handleCoursesbyId(course_id):
    if request.method == 'GET':
        return BaseCourse().getCourseById(course_id)
    elif request.method == 'PUT':
        return BaseCourse().updateCourse(course_id, request.json)

@app.route('/tuter/masters', methods=['GET', 'POST'])
def handleMasters():
    if request.method == 'POST':
        return BaseMasters().addMasters(request.json)
    else:
        return BaseMasters().getAllMasters() #Get list of all masters

@app.route('/tuter/masters/<int:user_id>', methods=['GET', 'DELETE'])
def handleMastersbyId(user_id):
    if request.method == 'GET':
        return BaseMasters().getMastersByUserId(user_id)
    elif request.method == 'DELETE':  # Deletes the specified user_id and course_id combination specified
        return BaseMasters().deleteMasters(user_id, request.json)

# This works but, we may want to make it return the actual user info
@app.route('/tuter/course-masters/<int:course_id>', methods=['GET'])
def handleMastersbyCourseId(course_id):
    if request.method == 'GET':  # Gets all the masters for a specific course
        return BaseMasters().getMastersByCourseId(course_id)

# Misc. Endpoints
# This works, but we need to clarify the definition of a 'member'. Does it,
# or does it not include the session creator?
@app.route('/tuter/tutoring-session-members/<int:session_id>', methods=['GET'])
def handleGetUsersInSession(session_id):
    return BaseMembers().getUsersInSession(session_id)

@app.route('/tuter/tutoring-sessions/getFreeTime', methods=['POST'])
@cross_origin()
def handleGetFreeTime():
    return BaseSession().getFreeTime(request.json)

@app.route('/tuter/tutoring-sessions/most-booked', methods=['GET'])
def handleUserStat():
    return BaseSession().getMostBookedTutors()

@app.route('/tuter/course-departments/', methods=['POST'])
def handleCoursesbyDepartments():
    if request.method == 'POST':
        return BaseCourse().getCoursesByDepartment(request.json)

@app.route('/tuter/faculties/', methods=['GET'])
def handleFaculties():
    if request.method == 'GET':
        return BaseCourse().getDistinctFaculties()

@app.route('/tuter/depts-by-faculty/', methods=['POST'])
def handleDepartmentsByFaculty():
    if request.method == 'POST':
        return BaseCourse().getDepartmentsByFaculty(request.json)

@app.route('/tuter/courses-by-faculty-and-dept/', methods=['POST'])
def handleCoursesByFacultyAndDept():
    if request.method == 'POST':
        return BaseCourse().getCoursesByFacultyAndDept(request.json)

@app.route('/tuter/tutors-by-course/', methods=['POST'])
def handleTutorsByCourse():
    if request.method == 'POST':
        return BaseCourse().getTutorsByCourse(request.json)

@app.route('/tuter/transactions-by-user/<int:user_id>', methods=['GET'])
def handleTransactionsByUser(user_id):
    if request.method == 'GET':
        return BaseTransactions().getTransactionsByUserId(user_id)

@app.route('/tuter/upcoming-sessions/<int:user_id>', methods=['GET'])
def handleUpcomingSessions(user_id):
    if request.method == 'GET':
        return BaseSession().getUpcomingSessionsByUser(user_id)

@app.route('/tuter/recent-bookings/<int:user_id>', methods=['GET'])
def handleRecentBookings(user_id):
    if request.method == 'GET':
        return BaseSession().getRecentBookingsByUser(user_id)

@app.route('/tuter/tutor-by-session/<int:session_id>', methods=['GET'])
def handleTutorBySession(session_id):
    if request.method == 'GET':
        return BaseSession().getTutorBySession(session_id)

"""""""""""""""""MAIN FUNCTION"""""""""""""""
if __name__ == '__main__':
    app.run(debug=True, port=8080, host="0.0.0.0")
