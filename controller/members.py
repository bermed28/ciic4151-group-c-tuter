from flask import jsonify
from model.members import MembersDAO

class BaseMembers:

    def build_map_dict(self, row):
        result = {}
        result['user_id'] = row[0]
        result['session_id'] = row[1]
        return result

    def build_attr_dict(self, user_id, session_id):
        result = {}
        result['user_id'] = user_id
        result['session_id'] = session_id
        return result

    def getAllMembers(self):
        dao = MembersDAO()
        members = dao.getAllMembers()
        result_list = []
        for row in members:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    # This function basically gets all the reservations a user has been invited to
    def getMembersByUserId(self, user_id):
        dao = MembersDAO()
        members = dao.getMemberByUserId(user_id)
        if not members:
            return jsonify("Not Found"), 404
        else:
            result_list = []
            for row in members:
                obj = self.build_map_dict(row)
                result_list.append(obj)
            return jsonify(result_list), 200

    def addNewMember(self, json):
        user_id = json['user_id']
        session_id = json['session_id']
        dao = MembersDAO()
        user_id = dao.insertMember(user_id, session_id)
        result = self.build_attr_dict(user_id, session_id)
        return jsonify(result), 201

    def deleteMember(self, user_id, json):
        dao = MembersDAO()
        result = dao.deleteMemberbySessionID(user_id, json['session_id'])
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    def getUsersInSession(self, session_id):
        dao = MembersDAO()
        member_list = dao.getUsersInSession(session_id)
        result = {"members": member_list}
        return jsonify(result), 200