from flask import jsonify
from model.tutoring_session import SessionDAO
from model.members import MembersDAO
from model.user_schedule import UserScheduleDAO
from model.time_slot import TimeSlotDAO
from controller.time_slot import BaseTimeSlot
from model.session_schedule import SessionScheduleDAO
from model.user import UserDAO


class BaseSession:

    def build_map_dict(self, row):
        result = {}
        result['session_id'] = row[0]
        result['session_date'] = row[1]
        result['is_in_person'] = row[2]
        result['location'] = row[3]
        return result

    # This function is used to create a dictionary that can be properly jsonified because
    # the time datatype causes errors in flask when trying to jsonify it directly. It´s only
    # used in the getMostBookedTimeSlots function
    def build_most_booked_dict(self, row):
        result = {}
        result['tid'] = row[0]
        result['tstarttime'] = row[1]
        result['tendtime'] = row[2]
        result['times_booked'] = row[3]
        return result

    def build_attr_dict(self, session_id, session_date, is_in_person, location):
        result = {}
        result['session_id'] = session_id
        result['session_date'] = session_date
        result['is_in_person'] = is_in_person
        result['location'] = location
        return result

    def getAllSessions(self):
        dao = SessionDAO()
        reservation_list = dao.getAllSessions()
        result_list = []
        for row in reservation_list:
            obj = self.build_map_dict(row)
            ssdao = SessionScheduleDAO()
            used_time_slots = ssdao.getSessionScheduleBySessionId(obj['session_id'])
            times = []
            for time_slot in used_time_slots:
                times.append(time_slot[1])
            obj['tids'] = times
            result_list.append(obj)
        return jsonify(result_list)

    def getSessionById(self, session_id):
        dao = SessionDAO()
        reservation_tuple = dao.getSessionById(session_id)
        if not reservation_tuple:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(reservation_tuple)
            ssdao = SessionScheduleDAO()
            used_time_slots = ssdao.getSessionScheduleBySessionId(session_id)
            times = []
            for time_slot in used_time_slots:
                times.append(time_slot[1])
            result['tids'] = times
            return jsonify(result), 200

    # def getSessionByUserId(self, uid):
    #     dao = SessionDAO()
    #     reservationTuples = dao.getSessionById(uid)
    #     if not reservationTuples:
    #         return jsonify("Not Found"), 404
    #     else:
    #         reservations = []
    #         ssdao = SessionScheduleDAO()
    #         tsDAO = TimeSlotDAO()
    #         for tup in reservationTuples:
    #             json = {}
    #             json['session_id'] = tup[0]
    #             json['session_date'] = tup[1]
    #             json['is_in_person'] = tup[2]
    #             json['uid'] = tup[3]
    #             json['location'] = tup[4]
    #             reservations.append(json)
    #
    #         reservations = list(map(dict, set(tuple(r.items()) for r in reservations)))
    #
    #         for r in reservations:
    #             used_time_slots = rsdao.getSessionScheduleBySessionId(r['session_id'])
    #             times = []
    #             if len(used_time_slots) == 1:
    #                 times.append(tsDAO.getTimeSlotByTimeSlotId(used_time_slots[0][1])[1])
    #                 times.append(tsDAO.getTimeSlotByTimeSlotId(used_time_slots[0][1])[2])
    #             else:
    #
    #                 times.append(tsDAO.getTimeSlotByTimeSlotId(used_time_slots[0][1])[1])
    #                 times.append(tsDAO.getTimeSlotByTimeSlotId(used_time_slots[-1][1])[2])
    #
    #             r['timeSlots'] = times
    #
    #         return jsonify(reservations), 200

    # Adding a reservation implies adding rows to the members, user schedule, reservation schedule and room schedule
    # tables as well
    def addNewSession(self, json):
        session_date = json['session_date']
        is_in_person = json['is_in_person']
        location = json['location']
        uid = json['uid']
        members = json['members']
        time_slots = json['time_slots']
        userdao = UserDAO()
        members.append(uid)
        dao = SessionDAO()
        for uid in members:
            occupiedTids = userdao.getUserOccupiedTimeSlots(uid, is_in_person)
            for time in time_slots:
                if time in occupiedTids:
                    username = userdao.getUserById(uid)[1]
                    return jsonify("This reservation cannot be made at this time because the user with username: " +
                                   username + " has a time conflict."), 409
        session_id = dao.insertSession(session_date, is_in_person, location, uid)
        result = self.build_attr_dict(session_id, session_date, is_in_person, location, uid)
        members_dao = MembersDAO()
        us_dao = UserScheduleDAO()
        reserv_dao = SessionScheduleDAO()
        for member in json['members']:
            if member != uid:
                members_dao.insertMember(member, session_id)
            for time_slot in time_slots:
                us_dao.insertUserSchedule(member, time_slot, is_in_person)

        for time_slot in time_slots:
            reserv_dao.insertSessionSchedule(session_id, time_slot)
        return jsonify(result), 201

    def updateSession(self, session_id, json):
        session_date = json['session_date']
        is_in_person = json['is_in_person']
        location = json['location']
        uid = json['uid']
        members = json['members']
        time_slots = json['tids']
        new_time_slots = []
        dao = SessionDAO()
        OldSessionInfo = dao.getSessionById(session_id)
        if not OldSessionInfo:
            return jsonify("No such reservation exists."), 400
        members.append(uid)
        userdao = UserDAO()
        for uid in members:
            occupiedTids = userdao.getUserOccupiedTimeSlots(uid, is_in_person)
            for time in time_slots:
                if time in occupiedTids:
                    username = userdao.getUserById(uid)[1]
                    return jsonify("This reservation cannot be made at this time because the user with username: " +
                                   username + " has a time conflict."), 409
        resSchedDAO = SessionScheduleDAO()
        used_tids = dao.getInUseTids(session_id)
        for tid in time_slots:
            if tid not in used_tids:
                new_time_slots.append(tid)

        # Get old info before deleting
        reservationdDAO = SessionDAO()
        membersDAO = MembersDAO()
        userSchedDAO = UserScheduleDAO()

        oldMembers = membersDAO.getMembersBySessionId(session_id)
        oldate = OldSessionInfo[2]
        oldlocation = OldSessionInfo[3]
        uid = OldSessionInfo[4]
        oldMembers.append((uid, session_id))

        # Delete old members
        membersDAO.deleteSessionMembers(session_id)
        # Insert update members
        for mem in members:
            membersDAO.insertMember(mem, session_id)

        # Go throught old members and delete from their US the reservation
        for mem in oldMembers:
            for time in used_tids:
                userSchedDAO.deleteUserSchedulebyTimeIDAndDay(mem[0], time, oldate)

        updated_reservation = dao.updateSession(session_id, session_date, is_in_person, location)
        resSchedDAO.deleteSessionSchedule(session_id) #Delete old tids
        for tid in time_slots: #Add new tid
            resSchedDAO.insertSessionSchedule(session_id, tid)

        # Add new time of reservation to user schedule
        members.append(uid)
        for mem in members:
            for time in time_slots:
                userSchedDAO.insertUserSchedule(mem, time, is_in_person)

        result = self.build_attr_dict(session_id, session_date, is_in_person, location, uid)
        result["tids"] = time_slots
        return jsonify(result), 200

    def deleteSession(self, session_id, json):
        """
        Delete from Session, Session/User/Room Schedule, Members
        """
        reservationDAO, membersDAO = SessionDAO(), MembersDAO()
        userSchedDAO, resSchedDAO = UserScheduleDAO(), SessionScheduleDAO()

        reservationInfo = reservationDAO.getSessionById(session_id)
        if json['uid'] != reservationInfo[4]:
            return jsonify("You cannot delete this reservation because you are not its creator."), 403
        memberList = membersDAO.getMembersBySessionId(session_id)
        memberList.append((reservationInfo[4], session_id))
        timeSlotList = resSchedDAO.getTimeSlotsBySessionId(session_id)
        day, room = reservationInfo[2], reservationInfo[3]

        delUserSched, delRoomSched = True, True
        delMembers = True

        for member in memberList:
            for time in timeSlotList:
                if not userSchedDAO.deleteUserSchedulebyTimeIDAndDay(member[0], time, day):
                    delUserSched = False

        if len(memberList) > 1:  # It has to be bigger than 1 because we add the creator of the reservation
            delMembers = membersDAO.deleteSessionMembers(session_id)
        else:
            delMembers = True


        for time in timeSlotList:
            if not roomSchedDAO.deleteRoomScheduleByTimeAndDay(room, time, day):
                delRoomSched = False

        delResSched = resSchedDAO.deleteSessionSchedule(session_id)
        delRes = reservationDAO.deleteSession(session_id)

        if delRes and delMembers and delUserSched and delRoomSched and delRes:
            return jsonify("DELETED"), 200
        else:
            return jsonify("COULD NOT DELETE RESERVATION CORRECTLY"), 500

    def getBusiestHours(self):
        dao = SessionDAO()
        temp = dao.getBusiestHours()
        result_list = []
        for row in temp:
            obj = self.build_most_booked_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    # def getMostBookedUsers(self):
    #     dao = SessionDAO()
    #     result = dao.getMostBookedUsers()
    #     return jsonify(result)

    def getFreeTime(self, json):
        uids = json['uids']
        usday = json['usday']
        uschedao = UserScheduleDAO()
        tsdao = TimeSlotDAO()
        result = []
        allOccupiedTid = []
        for uid in uids:
            # finds occupied tid of a specific user on a certain day
            occupiedTids = uschedao.getOccupiedTid(uid, usday)
            for tid in occupiedTids:
                if tid not in allOccupiedTid:
                    allOccupiedTid.append(tid)

        timeslots = tsdao.getAllTimeSlots()
        # loops through all the time slots and only keeps the ones that are not occupied for a user
        for time in timeslots:
            if int(time[0]) not in allOccupiedTid:
                result.append(BaseTimeSlot().build_map_dict(time))

        return jsonify(result)

    def removeUserByUsername(self, json):
        username = json['username']
        session_id = json['session_id']
        dao = SessionDAO()
        user_dao = UserDAO()
        user_schedule_dao = UserScheduleDAO()
        tid_list = dao.getInUseTids(session_id)
        removed_from_members = dao.removeUserByUsername(username, session_id)
        uid = user_dao.getUidbyUsername(username)
        is_in_person = dao.getSessionById(session_id)[2]
        for tid in tid_list:
            user_schedule_dao.deleteUserSchedulebyTimeIDAndDay(uid, tid, is_in_person)
        if removed_from_members:
            return jsonify("Successfully removed user from the meeting."), 200
        else:
            return jsonify("Could not remove user from the meeting."), 500
