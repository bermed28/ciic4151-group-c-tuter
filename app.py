import stripe
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_cors import cross_origin
from controller.user import BaseUser
from controller.time_slot import BaseTimeSlot
from controller.user_schedule import BaseUserSchedule
from controller.members import BaseMembers
from controller.session_schedule import BaseSessionSchedule
from controller.transactions import BaseTransactions
from controller.tutoring_session import BaseSession
from controller.transaction_details import BaseTransactionDetails
from controller.course import BaseCourse
from controller.masters import BaseMasters
import json
# This is your test secret API key. # "sk_test_51M9YIDDBbKKDMy0ZEVxI4WKZB8Rh1yuRSJxdLBpYpRfYU6HaDMLOtuEF69oJNLI7KMPYXjTjXCpA0hLltc81yskO00nogI5JjX"
stripe.api_key = 'sk_test_51M2zHJDhRypYPdkQDQSQ9cG0HxExmgOtEKtnPS5Fd1yMkyDDpob6nxH66zRfUkPvhAuGnz1SvmSAgJqMCBGJRkqn00o5ZABNjq'
                    # "whsec_17b3e166198cfead2afd76ca38a36048e17a35a9a17cc7546d70ce2a7f8586f7"
endpoint_secret = 'we_1M4a2LDhRypYPdkQrSLL36B5' #'whsec_b06564784cd37e6490a3028347d0c7b7e3ee18fd8633564004935a26e66c4c7b'

app = Flask(__name__)

@app.route('/')
def index():
    return "<h1>Hola Hovito<h1/>"

"""""""""""""STRIPE TRANSACTION HANDLING"""""""""""""""
def handle_charge_succeeded(charge_info):
    trans_dict = {}
    trans_dict['ref_num'] = charge_info['id']
    amount = str(charge_info['amount'])
    trans_dict['amt_captured'] = amount[:len(amount) - 2] + '.' + amount[len(amount) - 2:]
    trans_dict['card_brand'] = charge_info['payment_method_details']['type']
    trans_dict['last_four'] = charge_info['payment_method_details']['card']['last4']
    trans_dict['receipt_url'] = charge_info['receipt_url']
    trans_dict['currency'] = charge_info["currency"]
    trans_dict["customer_id"] = charge_info["customer"]
    print(trans_dict)
    BaseTransactionDetails().addNewTransactionDetails(trans_dict)
    print('Added transaction')

@app.route('/webhook', methods=['POST'])
def webhook():
    event = None
    payload = request.data

    try:
        event = json.loads(payload)
    except:
        print('⚠️  Webhook error while parsing basic request.' + str(e))
        return jsonify(success=False)
    if endpoint_secret:
        # Only verify the event if there is an endpoint secret defined
        # Otherwise use the basic event deserialized with json
        sig_header = request.headers.get('stripe-signature')
        try:
            event = stripe.Webhook.construct_event(
                payload, sig_header, endpoint_secret
            )
        except stripe.error.SignatureVerificationError as e:
            print('⚠️  Webhook signature verification failed.' + str(e))
            return jsonify(success=False)

    # Handle the event
    if event and event['type'] == 'charge.succeeded':
        charge_info = event['data']['object']  # contains a stripe.PaymentIntent
        handle_charge_succeeded(charge_info)
        print('Payment for {} succeeded'.format(charge_info['amount']))
        return jsonify(success=True)
    elif event['type'] == 'payment_intent.payment_failed':
        charge = event['data']['object']
        print('Are broke why cant you pay {} ???'.format(charge['amount']))
        return jsonify(success=False)
        # ... handle other event types
    elif event['type'] == 'payment_method.attached':
        payment_method = event['data']['object']  # contains a stripe.PaymentMethod
        # Then define and call a method to handle the successful attachment of a PaymentMethod.
        # handle_payment_method_attached(payment_method)
    else:
        # Unexpected event type
        print('Unhandled event type {}'.format(event['type']))

    return jsonify(success=True)

@app.route('/payment-sheet', methods=['POST'])
def payment_sheet():
    # Set your secret key. Remember to switch to your live secret key in production.
    # See your keys here: https://dashboard.stripe.com/apikeys
    # stripe.api_key = 'sk_test_51M2zHJDhRypYPdkQDQSQ9cG0HxExmgOtEKtnPS5Fd1yMkyDDpob6nxH66zRfUkPvhAuGnz1SvmSAgJqMCBGJRkqn00o5ZABNjq'
    # Use an existing Customer ID if this is a returning customer
    customer = stripe.Customer.create()
    ephemeralKey = stripe.EphemeralKey.create(
        customer=customer['id'],
        stripe_version='2022-08-01',
    )
    total = request.json['total']
    charge = int(float(total) * 100)  # 8.50 * 100 = 850cents
    paymentIntent = stripe.PaymentIntent.create(
        amount=charge,  # 1099 = $10.99
        currency='usd',
        customer=customer['id'],
        automatic_payment_methods={
            'enabled': True,
        },
    )
    return jsonify(paymentIntent=paymentIntent.client_secret,
                   ephemeralKey=ephemeralKey.secret,
                   customer=customer.id,
                   publishableKey= 'pk_test_51M2zHJDhRypYPdkQRZ4Cd7KIu3idER1Fz9Je6KWv7xKDdG2OENqBADizHpdPUtGX1jrEtdKvTuYJSUIeNkoKIoeM00UiSHJiq2') # "pk_test_51M9YIDDBbKKDMy0Z2oYonKuqOFeAkjXG2Wv9O7I6olpWPIJ3w99fstRFR2F6L3SGpNtrJmHMjQCainqMUKPivQgF00AMfE62a3")


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

@app.route('/tuter/user-role/<int:user_id>', methods=['PUT'])
def handleUserRolebyId(user_id):
    if request.method == 'PUT':
        return BaseUser().updateUserRole(user_id, request.json)

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

@app.route('/tuter/transaction-details/', methods=['GET', 'POST'])
def handleTransactionDetails():
    if request.method == 'GET':
        return BaseTransactionDetails().getAllTransactionDetails()
    elif request.method == 'POST':
        return BaseTransactionDetails().addNewTransactionDetails(request.json)

@app.route('/tuter/transactions/<int:td_id>', methods=['GET', 'DELETE'])
def handleTransactionDetailsbyTransactionId(td_id):
    if request.method == 'GET':
        return BaseTransactionDetails().getTransactionByTransactionId(td_id)
    elif request.method == 'DELETE':
        return BaseTransactionDetails().deleteTransaction(td_id)

@app.route('/tuter/transaction-details/ref', methods=['POST'])
def handleTransactionDetailsRef():
    if request.method == 'POST':
        return BaseTransactionDetails().getTransactionByRefNum(request.json)

@app.route('/tuter/transaction-details/customer', methods=['POST'])
def handleTransactionDetailsCustomer():
    if request.method == 'POST':
        return BaseTransactionDetails().getTransactionByCustomerId(request.json)

@app.route('/tuter/check/tutoring-sessions', methods=['POST'])
def handleCheckIfCanBook():
    if request.method == 'POST':
        return BaseSession().checkIfCanBook(request.json)  # Finish this and verify

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

@app.route('/tuter/tutor/tutoring-session/<int:tutor_id>', methods=['GET'])
def handleTutoringSessionsbyTutorId(tutor_id):
    if request.method == 'GET':
        return BaseSession().getUpcomingSessionsByTutorId(tutor_id)

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

@app.route('/tuter/course-masters/info/<int:user_id>', methods=['GET'])
def handleMastersInfobyUserId(user_id):
    if request.method == 'GET':
        return BaseMasters().getUserMastersCourseInfo(user_id)


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

@app.route('/tuter/transaction-receipt/', methods=['POST'])
def handleTransactionReceipt():
    if request.method == 'POST':
        return BaseTransactions().getTransactionReceipts(request.json)

@app.route('/tuter/all-depts/', methods=['GET'])
def handleAllDepts():
    if request.method == 'GET':
        return BaseCourse().getAllDepartments()

"""""""""""""""""MAIN FUNCTION"""""""""""""""
if __name__ == '__main__':
    app.run(debug=True, port=8080, host="0.0.0.0")