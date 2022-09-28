from flask import jsonify
from model.session_schedule import SessionScheduleDAO

class BaseSessionSchedule:

    def build_map_dict(self, row):
        result = {}
        result['session_id'] = row[0]
        result['ts_id'] = row[1]
        return result

    def build_attr_dict(self, session_id, ts_id):
        result = {}
        result['session_id'] = session_id
        result['ts_id'] = ts_id
        return result

    def getAllMembers(self):
        dao = SessionScheduleDAO()
        members = dao.getAllSessionSchedules()
        result_list = []
        for row in members:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    def getSessionScheduleBySessionId(self, session_id):
        dao = SessionScheduleDAO()
        reservation_sched = dao.getSessionScheduleBySessionId(session_id)
        if not reservation_sched:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(reservation_sched)
            return jsonify(result), 200

    def addNewSessionSchedule(self, json):
        session_id = json['session_id']
        ts_id = json['ts_id']
        dao = SessionScheduleDAO()
        ts_id = dao.insertSessionSchedule(session_id, ts_id)
        result = self.build_attr_dict(session_id, ts_id)
        return jsonify(result), 201

    def deleteSessionSchedule(self, session_id):
        dao = SessionScheduleDAO()
        result = dao.deleteSessionSchedule(session_id)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404