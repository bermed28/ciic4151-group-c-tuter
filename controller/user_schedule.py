from flask import jsonify
from model.user_schedule import UserScheduleDAO

class BaseUserSchedule:

    def build_map_dict(self, row):
        result = {}
        result['us_id'] = row[0]
        result['user_id'] = row[1]
        result['ts_id'] = row[2]
        result['us_day'] = row[3]
        return result

    def build_attr_dict(self, us_id, user_id, ts_id, us_day):
        result = {}
        result['us_id'] = us_id
        result['user_id'] = user_id
        result['ts_id'] = ts_id
        result['us_day'] = us_day
        return result

    def getAllUserSchedules(self):
        dao = UserScheduleDAO()
        user_schedule_list = dao.getAllUserSchedules()
        result_list = []
        for row in user_schedule_list:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    def getUserScheduleById(self, us_id):
        dao = UserScheduleDAO()
        user_schedule = dao.getUserScheduleById(us_id)
        if not user_schedule:
            return jsonify("Not Found"), 404
        else:
            obj = self.build_map_dict(user_schedule)
            return jsonify(obj), 200

    def addNewUserSchedule(self, json):
        user_id = json['user_id']
        ts_id = json['ts_id']
        us_day = json['us_day']
        dao = UserScheduleDAO()
        us_id = dao.insertUserSchedule(user_id, ts_id, us_day)
        result = self.build_attr_dict(us_id, user_id, ts_id, us_day)
        return jsonify(result), 201

    def updateUserSchedule(self, us_id, json):
        user_id = json['user_id']
        ts_id = json['ts_id']
        us_day = json['us_day']
        dao = UserScheduleDAO()
        #Check if it usid exist
        if not dao.getUserScheduleById(us_id):
            return "User Schedule id does not exist, no update can be done"
        updated_user_schedule = dao.updateUserSchedule(us_id, user_id, ts_id, us_day)
        result = self.build_attr_dict(us_id, user_id, ts_id, us_day)
        return jsonify(result), 200

    def deleteUserSchedule(self, us_id):
        dao = UserScheduleDAO()
        result = dao.deleteUserSchedule(us_id)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    def markAvailable(self, json):
        user_id = json['user_id']
        ts_id = json['ts_id']
        us_day = json['us_day']
        dao = UserScheduleDAO()
        result = dao.deleteUserSchedulebyTimeIDAndDay(user_id, ts_id, us_day)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404
