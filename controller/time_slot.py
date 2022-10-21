from flask import jsonify
from model.time_slot import TimeSlotDAO

class BaseTimeSlot:

    def build_map_dict(self, row):
        result = {}
        result['ts_id'] = row[0]
        result['tstarttime'] = row[1]
        result['tendtime'] = row[2]
        return result

    def build_attr_dict(self, ts_id, tstarttime, tendttime):
        result = {}
        result['ts_id'] = ts_id
        result['tstarttime'] = tstarttime
        result['tendttime'] = tendttime
        return result

    def getAllTimeSlots(self):
        dao = TimeSlotDAO()
        members = dao.getAllTimeSlots()
        result_list = []
        for row in members:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    def getTimeSlotByTimeSlotId(self, ts_id):
        dao = TimeSlotDAO()
        member = dao.getTimeSlotByTimeSlotId(ts_id)
        if not member:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(member)
            return jsonify(result), 200

    # def addNewTimeSlot(self, json):
    #     ts_id = json['ts_id']
    #     tstarttime = json['tstarttime']
    #     tendtime = json['tendtime']
    # 
    #     dao = TimeSlotDAO()
    #     ts_id = dao.insertTimeSlot(tstarttime, tendtime)
    #     result = self.build_attr_dict(ts_id, tstarttime, tendtime)
    #     return jsonify(result), 201
    # 
    # def updateTimeSlot(self, json):
    #     ts_id = json['ts_id']
    #     tstarttime = json['tstarttime']
    #     tendtime = json['tendtime']
    # 
    #     dao = TimeSlotDAO()
    #     updated_time_slot = dao.updateTimeSlot(ts_id, tstarttime, tendtime)
    #     result = self.build_attr_dict(ts_id, tstarttime, tendtime)
    #     return jsonify(result), 200
    # 
    # def deleteTimeSlot(self, ts_id):
    #     dao = TimeSlotDAO()
    #     result = dao.deleteTimeSlot(ts_id)
    #     if result:
    #         return jsonify("DELETED"), 200
    #     else:
    #         return jsonify("NOT FOUND"), 404