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

    def build_course_info_dict(self, row):
        return {
            "course_id": row[0],
            "course_code": row[1],
            "department": row[2],
            "faculty": row[3],
            "name": row[4]
        }

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
        masteries = dao.getMastersByUserId(user_id)
        masteryCount = len(masteries)
        for mastery in masteries:
            if mastery[1] == course_id:
                return jsonify("You have already mastered this course."), 400
        if masteryCount < 4:  # 4 is the limit arbitrarily set by us
            user_id = dao.insertMasters(user_id, course_id)
            result = self.build_attr_dict(user_id, course_id)
            return jsonify(result), 201
        else:
            return jsonify("You can only master up to 4 courses."), 400

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

    def deleteAllbyUserID(self, user_id):
        dao = MastersDAO()
        result = dao.deleteAllbyUserID(user_id)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    # Finds the username of the users that master a specific course
    def getUsersMasters(self, course_id):
        dao = MastersDAO()
        masters_list = dao.getUsersMasters(course_id)
        result = {"masters": masters_list}
        return jsonify(result), 200

    # Get course info of all courses that a specific user masters
    def getUserMastersCourseInfo(self, user_id):
        dao = MastersDAO()
        courses = dao.getCourseMastersInfoByUserID(user_id)
        result = []
        for course in courses:
            result.append(self.build_course_info_dict(course))
        return jsonify(result), 200
