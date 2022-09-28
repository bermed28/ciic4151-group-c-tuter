from flask import jsonify
from model.masters import MastersDAO

class BaseMasters:

    def build_map_dict(self, row):
        result = {}
        result['user_id'] = row[0]
        result['course_id'] = row[1]
        return result

    def build_attr_dict(self, user_id, course_id):
        result = {}
        result['user_id'] = user_id
        result['course_id'] = course_id
        return result

    def getAllMasters(self):
        dao = MastersDAO()
        masters = dao.getAllMasters()
        result_list = []
        for row in masters:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    #This function basically gets all the courses a user can teach
    def getMastersByUserId(self, user_id):
        dao = MastersDAO()
        courses = dao.getMastersByUserId(user_id)
        if not courses:
            return jsonify("Not Found"), 404
        else:
            result_list = []
            for row in courses:
                obj = self.build_map_dict(row)
                result_list.append(obj)
            return jsonify(result_list), 200
    
    def getMastersByCourseId(self, course_id):
        dao = MastersDAO()
        courses = dao.getMastersByCourseId(course_id)
        if not courses:
            return jsonify("Not Found"), 404
        else:
            result_list = []
            for row in courses:
                obj = self.build_map_dict(row)
                result_list.append(obj)
            return jsonify(result_list), 200

    def addMasters(self, json):
        user_id = json['user_id']
        course_id = json['course_id']
        dao = MastersDAO()
        user_id = dao.insertMasters(user_id, course_id)
        result = self.build_attr_dict(user_id, course_id)
        return jsonify(result), 201

    # Un update no es necesario pa una tabla intermediaria
    # def updateMasters(self, course_id, json):
    #     course_code = json['course_code']
    #     name = json['name']
    #     department = json['department']
    #     faculty = json['faculty']
    #     dao = CourseDAO()
    #     updated_course = dao.updateCourse(course_id, course_code, name, department, faculty)
    #     result = self.build_attr_dict(course_id, course_code, name, department, faculty)
    #     return jsonify(result), 200

    def deleteMasters(self, user_id, json):
        dao = MastersDAO()
        result = dao.deleteMasters(user_id, json['course_id'])
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    def deletebyUserID(self, user_id):
        dao = MastersDAO()
        result = dao.deletebyUserID(user_id)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    # Finds the username of the users that master a specific course
    def getUsersMasters(self, course_id):
        dao = MastersDAO()
        masters_list = dao.getUsersInSession(course_id)
        result = {"masters": masters_list}
        return jsonify(result), 200