from flask import jsonify
from model.course import CourseDAO

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

    def getAllCourses(self):
        dao = CourseDAO()
        members = dao.getAllCourses()
        result_list = []
        for row in members:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

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