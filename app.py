from flask import Flask, request
from flask_cors import CORS
from flask_cors import cross_origin
from controller.user import BaseUser
from controller.time_slot import BaseTimeSlot
from controller.user_schedule import BaseUserSchedule
from controller.members import BaseMembers
from controller.session_schedule import BaseSessionSchedule
from controller.transactions import BaseTransactions
import json

app = Flask(__name__)

@app.route('/')
def index():
    return "<h1>Hola Hovito<h1/>"

"""""""""""""MAIN ENTITY HANDLERS (CRUD Operations)"""""""""""""""

@app.route('/tuter/users', methods=['GET', 'POST'])
def handleUsers():
    if request.method == 'POST': #ADD
        return BaseUser().addNewUser(request.json)
    else:
        return BaseUser().getAllUsers() #Get list of all users

@app.route('/tuter/users/<int:uid>', methods=['GET', 'PUT', 'DELETE'])
def handleUsersbyId(uid):
    if request.method == 'GET':
        return BaseUser().getUserById(uid)
    elif request.method == 'PUT':
        return BaseUser().updateUser(uid, request.json)
    elif request.method == 'DELETE':
        return BaseUser().deleteUser(uid)

@app.route('/tuter/users/usernames', methods=['POST'])
def handleUsernames():
    if request.method == 'POST':
        return BaseUser().getRequestedIds(request.json)

@app.route('/tuter/user-schedule', methods=['GET', 'POST'])
def handleUserSchedules():
    if request.method == 'POST':
        return BaseUserSchedule().addNewUserSchedule(request.json)
    else:
        return BaseUserSchedule().getAllUserSchedules()

@app.route('/tuter/user-schedule/<int:usid>', methods=['GET', 'PUT', 'DELETE'])
def handleUserSchedulebyId(usid):
    if request.method == 'GET':
        return BaseUserSchedule().getUserScheduleById(usid)
    elif request.method == 'PUT':
        return BaseUserSchedule().updateUserSchedule(usid, request.json)
    elif request.method == 'DELETE':
        return BaseUserSchedule().deleteUserSchedule(usid)

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

@app.route('/tuter/timeslots/<int:tid>', methods=['GET'])
def handleTimeSlotbyId(tid):
    return BaseTimeSlot().getTimeSlotByTimeSlotId(tid)

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

@app.route('/tuter/session-schedule/', methods=['GET'])
def handleSessionSchedulebyId():
    return BaseSessionSchedule().getAllSessionSchedules()

@app.route('/tuter/session-schedule/<int:session_id>', methods=['GET', 'POST', 'DELETE'])
def handleSessionSchedulebySessionId(session_id):
    if request.method == 'GET':
        return BaseSessionSchedule().getSessionScheduleBySessionId(session_id)
    elif request.method == 'POST':
        return BaseSessionSchedule().addNewSessionSchedule(request.json)
    elif request.method == 'DELETE':
        return BaseSessionSchedule().deleteSessionSchedule(session_id)

@app.route('/tuter/transactions/', methods=['GET'])
def handleTransactions():
    return BaseSessionSchedule().getAllSessionSchedules()

@app.route('/tuter/transactions/<int:transaction_id>', methods=['GET', 'POST', 'DELETE'])
def handleTransactionsbyTransactionId(transaction_id):
    if request.method == 'GET':
        return BaseTransactions().getTransactionsByTransactionsId(transaction_id)
    elif request.method == 'POST':
        return BaseTransactions().addNewTransaction(request.json)
    elif request.method == 'DELETE':
        return BaseTransactions().deleteTransaction(transaction_id)

# Misc. Endpoints

@app.route('/StackOverflowersStudios/memberNames/<int:session_id>', methods=['GET'])
def handleGetUsersInReservation(session_id):
    return BaseMembers().getUsersInSession(session_id)



"""""""""""""""""MAIN FUNCTION"""""""""""""""
if __name__ == '__main__':
    app.run(debug=True, port=8080, host="0.0.0.0")
