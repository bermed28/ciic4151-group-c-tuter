from flask import jsonify
from model.course import CourseDAO
from controller.user import BaseUser

class BaseCourse:

    def build_map_dict(self, row):
        result = {}
        result['course_id'] = row[0]
        result['course_code'] = row[1]
        result['name'] = row[2]
        result['department'] = row[3]
        result['faculty'] = row[4]
        return result

    def build_attr_dict(self, course_id, course_code, name, department, faculty):
        result = {}
        result['course_id'] = course_id
        result['course_code'] = course_code
        result['name'] = name
        result['department'] = department
        result['faculty'] = faculty
        return result

    def getAllRegularCourses(self):
        dao = CourseDAO()
        members = dao.getAllRegularCourses()
        result_list = []
        for row in members:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list), 200

    def getCourseById(self, course_id):
        dao = CourseDAO()
        member = dao.getCourseById(course_id)
        if not member:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(member)
            return jsonify(result), 200

    def getCoursesByDepartment(self, json):
        department = json['department']
        dao = CourseDAO()
        result_list = dao.getCoursesByDepartment(department)
        course_list = []
        for row in result_list:
            obj = self.build_map_dict(row)
            course_list.append(obj)
        return jsonify(course_list), 200

    def addCourse(self, json):
        course_code = json['course_code']
        name = json['name']
        department = json['department']
        faculty = json['faculty']
        dao = CourseDAO()
        course_id = dao.insertCourse(course_code, name, department, faculty)
        result = self.build_attr_dict(course_id, course_code, name, department, faculty)
        return jsonify(result), 201

    def updateCourse(self, course_id, json):
        course_code = json['course_code']
        name = json['name']
        department = json['department']
        faculty = json['faculty']
        dao = CourseDAO()
        updated_course = dao.updateCourse(course_id, course_code, name, department, faculty)
        result = self.build_attr_dict(course_id, course_code, name, department, faculty)
        return jsonify(result), 200

    def deleteCourse(self, course_id):
        dao = CourseDAO()
        result = dao.deleteCourse(course_id)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    def getDistinctFaculties(self):
        dao = CourseDAO()
        members = dao.getDistinctFaculties()
        result_list = []
        for row in members:
            result_list.append(row[0])
        result = {"faculties": result_list}
        return jsonify(result), 200

    def getDepartmentsByFaculty(self, json):
        dao = CourseDAO()
        faculty = json['faculty']
        members = dao.getDepartmentsByFaculty(faculty)
        result_list = []
        for row in members:
            result_list.append(row[0])
        result = {"departments": result_list}
        return jsonify(result), 200

    def getTutorsByCourse(self, json):
        dao = CourseDAO()
        user_obj = BaseUser()
        course_code = json['course_code']
        student_id = json['user_id']
        members = dao.getTutorsByCourse(course_code, student_id)
        result_list = []
        for row in members:
            temp = user_obj.build_public_map_dict(row)
            user_id = temp['user_id']
            mastered_courses = user_obj.getMasteredCourseCodes(user_id)
            temp['mastered_courses'] = mastered_courses
            result_list.append(temp)
        return jsonify(result_list), 200

    def getCoursesByFacultyAndDept(self, json):
        dao = CourseDAO()
        faculty = json['faculty']
        department = json['department']
        members = dao.getCoursesByFacultyAndDept(faculty, department)
        result_list = []
        for row in members:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list), 200

    def getAllDepartments(self):
        dao = CourseDAO()
        members = dao.getAllDepartments()
        result_list = []
        for row in members:
            result_list.append(row[0])
        result = {"departments": result_list}
        return jsonify(result), 200
