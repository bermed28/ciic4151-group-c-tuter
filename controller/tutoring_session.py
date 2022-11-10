import json

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
        result['user_id'] = row[4]
        result['course_code'] = row[5]
        result['course_id'] = row[6]
        return result

    def build_upcoming_dict(self, row):
        result = {}
        result['session_date'] = row[0]
        result['start_time'] = row[1]
        result['course_code'] = row[2]
        result['tutor_name'] = row[3]
        result['tutor_rating'] = row[4]
        result['department'] = row[5]
        return result

    # This function is used to create a dictionary that can be properly jsonified because
    # the time datatype causes errors in flask when trying to jsonify it directly. It´s only
    # used in the getMostBookedTimeSlots function
    def build_most_booked_dict(self, row):
        result = {}
        result['ts_id'] = row[0]
        result['tstarttime'] = row[1]
        result['tendtime'] = row[2]
        result['times_booked'] = row[3]
        return result

    def build_attr_dict(self, session_id, session_date, is_in_person, location, user_id):
        result = {}
        result['session_id'] = session_id
        result['session_date'] = session_date
        result['is_in_person'] = is_in_person
        result['location'] = location
        result['user_id'] = user_id
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
            obj['ts_ids'] = times
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
            result['ts_ids'] = times
            return jsonify(result), 200

    def getSessionsByUserId(self, user_id):
        dao = SessionDAO()
        reservation_tuples = dao.getSessionsByUserId(user_id)
        if not reservation_tuples:
            return jsonify("Not Found"), 404
        else:
            reservations = []
            ssdao = SessionScheduleDAO()
            tsDAO = TimeSlotDAO()
            for tup in reservation_tuples:
                json = self.build_map_dict(tup)
                reservations.append(json)

            reservations = list(map(dict, set(tuple(r.items()) for r in reservations)))
            allTimeSlots = tsDAO.getAllTimeSlots()
            allTimeSlotsdict = {}
            for t in allTimeSlots:
                allTimeSlotsdict[t[0]] = {"tstarttime": t[1], "tendtime": t[2]}

            for r in reservations:
                used_time_slots = ssdao.getSessionScheduleBySessionId(r['session_id'])
                times = []
                times.append(allTimeSlotsdict[(used_time_slots[0][1])]["tstarttime"])
                times.append(allTimeSlotsdict[(used_time_slots[len(used_time_slots) - 1][1])]["tendtime"])
                r['timeSlots'] = times

            return jsonify(reservations), 200

    # Adding a reservation implies adding rows to the members, user schedule, reservation schedule and room schedule
    # tables as well
    def addNewSession(self, json):
        session_date = json['session_date']
        is_in_person = json['is_in_person']
        location = json['location']
        user_id = json['user_id']
        course_id = json['course_id']
        members = json['members']
        time_slots = json['time_slots']
        user_dao = UserDAO()
        members.append(user_id)
        dao = SessionDAO()
        for user_id in members:
            occupied_ts_ids = user_dao.getUserOccupiedTimeSlots(user_id, session_date)
            for time in time_slots:
                if time in occupied_ts_ids:
                    username = user_dao.getUserById(user_id)[1]
                    return jsonify("This reservation cannot be made at this time because the user with username: " +
                                   username + " has a time conflict."), 409
        session_id = dao.insertSession(session_date, is_in_person, location, user_id, course_id)
        result = self.build_attr_dict(session_id, session_date, is_in_person, location, user_id)
        members_dao = MembersDAO()
        us_dao = UserScheduleDAO()
        session_schedule_dao = SessionScheduleDAO()
        for member in json['members']:
            if member != user_id:
                members_dao.insertMember(member, session_id)
            for time_slot in time_slots:
                us_dao.insertUserSchedule(member, time_slot, session_date)

        for time_slot in time_slots:
            session_schedule_dao.insertSessionSchedule(session_id, time_slot)
        return jsonify(result), 201

    def updateSession(self, session_id, json):
        session_date = json['session_date']
        is_in_person = json['is_in_person']
        location = json['location']
        user_id = json['user_id']
        members = json['members']
        ts_ids = json['ts_ids']
        new_time_slots = []
        dao = SessionDAO()
        old_session_info = dao.getSessionById(session_id)
        if not old_session_info:
            return jsonify("No such reservation exists."), 400
        members.append(user_id)  # Why is this done? It was in the old code as well, but
        # it doesn't make sense to me
        user_dao = UserDAO()
        for user_id in members:
            occupied_ts_ids = user_dao.getUserOccupiedTimeSlots(user_id, session_date)
            for time in ts_ids:
                if time in occupied_ts_ids:
                    username = user_dao.getUserById(user_id)[1]
                    return jsonify("This reservation cannot be made at this time because the user with username: " +
                                   username + " has a time conflict."), 409
        ses_schedule_dao = SessionScheduleDAO()
        used_ts_ids = dao.getInUseTsIds(session_id)
        for ts_id in ts_ids:
            if ts_id not in used_ts_ids:
                new_time_slots.append(ts_id)

        # Get old info before deleting
        session_dao = SessionDAO()
        members_dao = MembersDAO()
        user_schedule_dao = UserScheduleDAO()

        old_members = members_dao.getMembersBySessionId(session_id)
        old_date = old_session_info[1]
        old_location = old_session_info[3]
        user_id = old_session_info[4]
        old_members.append((user_id, session_id))

        # Delete old members
        members_dao.deleteSessionMembers(session_id)
        # Insert update members
        for mem in members:
            members_dao.insertMember(mem, session_id)

        # Go throughout old members and delete from their US the reservation
        for mem in old_members:
            for time in used_ts_ids:
                user_schedule_dao.deleteUserSchedulebyTimeIDAndDay(mem[0], time, old_date)

        updated_reservation = dao.updateSession(session_id, session_date, is_in_person, location, user_id)
        ses_schedule_dao.deleteSessionSchedule(session_id)  # Delete old ts_ids
        for ts_id in ts_ids:  # Add new ts_id
            ses_schedule_dao.insertSessionSchedule(session_id, ts_id)

        # Add new time of reservation to user schedule
        members.append(user_id)
        for mem in members:
            for time in ts_ids:
                user_schedule_dao.insertUserSchedule(mem, time, session_date)

        result = self.build_attr_dict(session_id, session_date, is_in_person, location, user_id)
        result["ts_ids"] = ts_ids
        return jsonify(result), 200

    def deleteSession(self, session_id):
        """
        Delete from Session, Session/User/Room Schedule, Members
        """
        session_dao, members_dao = SessionDAO(), MembersDAO()
        user_schedule_dao, ses_schedule_dao = UserScheduleDAO(), SessionScheduleDAO()

        reservation_info = session_dao.getSessionById(session_id)
        member_list = members_dao.getMembersBySessionId(session_id)
        member_list.append((reservation_info[4], session_id))
        time_slot_list = ses_schedule_dao.getTimeSlotsBySessionId(session_id)
        day = reservation_info[1]

        del_user_schedule = True
        del_members = True

        for member in member_list:
            for time in time_slot_list:
                if not user_schedule_dao.deleteUserSchedulebyTimeIDAndDay(member[0], time, day):
                    del_user_schedule = False

        if len(member_list) > 1:  # It has to be bigger than 1 because we add the creator of the reservation
            del_members = members_dao.deleteSessionMembers(session_id)
        else:
            del_members = True

        del_ses_schedule = ses_schedule_dao.deleteSessionSchedule(session_id)
        del_ses = session_dao.deleteSession(session_id)

        if del_ses and del_members and del_user_schedule and del_ses_schedule and del_ses:
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

    def getMostBookedTutors(self):
        dao = SessionDAO()
        result = dao.getMostBookedTutors()
        return jsonify(result)

    def getFreeTime(self, json):
        user_ids = json['user_ids']
        us_day = json['us_day']
        uschedao = UserScheduleDAO()
        tsdao = TimeSlotDAO()
        result = []
        allOccupiedTsId = []
        for user_id in user_ids:
            # finds occupied ts_id of a specific user on a certain day
            occupied_ts_ids = uschedao.getOccupiedTsId(user_id, us_day)
            for ts_id in occupied_ts_ids:
                if ts_id not in allOccupiedTsId:
                    allOccupiedTsId.append(ts_id)

        timeslots = tsdao.getAllTimeSlots()
        # loops through all the time slots and only keeps the ones that are not occupied for a user
        for time in timeslots:
            if int(time[0]) not in allOccupiedTsId:
                result.append(BaseTimeSlot().build_map_dict(time))

        return jsonify(result)

    def removeUserByUsername(self, json):
        username = json['username']
        session_id = json['session_id']
        dao = SessionDAO()
        user_dao = UserDAO()
        user_schedule_dao = UserScheduleDAO()
        ts_id_list = dao.getInUseTsIds(session_id)
        removed_from_members = dao.removeUserByUsername(username, session_id)
        user_id = user_dao.getUidbyUsername(username)
        is_in_person = dao.getSessionById(session_id)[2]
        for ts_id in ts_id_list:
            user_schedule_dao.deleteUserSchedulebyTimeIDAndDay(user_id, ts_id, is_in_person)
        if removed_from_members:
            return jsonify("Successfully removed user from the meeting."), 200
        else:
            return jsonify("Could not remove user from the meeting."), 500

    def getUpcomingSessionsByUser(self, user_id):
        dao = SessionDAO()
        result_list = []
        upcoming_sessions = dao.getUpcomingSessionsByUser(user_id)
        for session in upcoming_sessions:
            temp = self.build_upcoming_dict(session)
            result_list.append(json.loads(json.dumps(temp, indent=4, default=str)))
        return jsonify(result_list), 200

    def getRecentBookingsByUser(self, user_id):
        dao = SessionDAO()
        result_list = []
        upcoming_sessions = dao.getRecentBookingsByUser(user_id)
        for session in upcoming_sessions:
            temp = self.build_upcoming_dict(session)
            result_list.append(json.loads(json.dumps(temp, indent=4, default=str)))
        return jsonify(result_list), 200
