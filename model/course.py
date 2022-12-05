import psycopg2
import json, os

class CourseDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host='%s'" % (
            os.getenv('DB_NAME'),
            os.getenv('DB_USER'),
            os.getenv('DB_PASSWORD'),
            os.getenv('DB_PORT'),
            os.getenv('DB_HOST'),
        )
        print("connection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)

    def __del__(self):
        self.conn.close()

    def getAllRegularCourses(self):
        cursor = self.conn.cursor()
        query = "select course_id, course_code, name, department, faculty from public.course where " \
                "faculty <> 'Behavioral' and faculty <> 'Technical' and faculty <> 'Resume' and faculty <> 'Writing';"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(json.loads(json.dumps(row, indent=4, default=str)))
        cursor.close()
        return result

    def getCourseById(self, course_id):
        cursor = self.conn.cursor()
        query = "select course_id, course_code, name, department, faculty from public.course where course_id = %s;"
        cursor.execute(query, (course_id,))
        result = cursor.fetchone()
        cursor.close()
        return json.loads(json.dumps(result, indent=4, default=str))

    def getCoursesByDepartment(self, department):
        cursor = self.conn.cursor()
        query = "select course_id, course_code, name, department, faculty from public.course where department = %s" \
                " order by course_code asc;"
        cursor.execute(query, (department,))
        result = []
        for row in cursor:
            result.append(json.loads(json.dumps(row, indent=4, default=str)))
        cursor.close()
        return result

    def insertCourse(self, course_code, name, department, faculty):
        cursor = self.conn.cursor()
        query = "insert into public.course(course_code, name, department, faculty) values(%s,%s,%s,%s) returning course_id;"
        cursor.execute(query, (course_code, name, department, faculty))
        uid = cursor.fetchone()[0]
        self.conn.commit()
        return uid

    def updateCourse(self, course_id, course_code, name, department, faculty):
        cursor = self.conn.cursor()
        query = 'update public.course set course_code = %s, name = %s, department = %s, faculty = %s \
                 where course_id = %s;'
        cursor.execute(query, (course_code, name, department, faculty, course_id))
        self.conn.commit()
        cursor.close()
        return True

    def deleteCourse(self, course_id):
        cursor = self.conn.cursor()
        query = 'delete from public.course where course_id=%s;'
        cursor.execute(query, (course_id,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows !=0

    def getDistinctFaculties(self):
        cursor = self.conn.cursor()
        query = "select distinct faculty from public.course;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(json.loads(json.dumps(row, indent=4, default=str)))
        cursor.close()
        return result

    def getDepartmentsByFaculty(self, faculty):
        cursor = self.conn.cursor()
        query = "select distinct department from public.course  where faculty = %s order by department asc;"
        cursor.execute(query, (faculty,))
        result = []
        for row in cursor:
            result.append(json.loads(json.dumps(row, indent=4, default=str)))
        cursor.close()
        return result

    def getTutorsByCourse(self, course_code, student_id):
        cursor = self.conn.cursor()
        query = 'select user_id, username, email, password, name, balance, user_role, hourly_rate, ' \
                '(rating / cast(rate_count as numeric(5,2))) as user_rating, description, department from "User" ' \
                'where user_id IN (SELECT user_id FROM (course NATURAL INNER JOIN masters) ' \
                'WHERE course_code = %s and user_id <> %s) order by name asc;'
        cursor.execute(query, (course_code, student_id, ))
        result = []
        for row in cursor:
            result.append(json.loads(json.dumps(row, indent=4, default=str)))
        cursor.close()
        return result

    def getCoursesByFacultyAndDept(self, faculty, department):
        cursor = self.conn.cursor()
        query = "select course_id, course_code, name, department, faculty from public.course where " \
                "faculty = %s and department = %s order by course_code asc;"
        cursor.execute(query, (faculty, department,))
        result = []
        for row in cursor:
            result.append(json.loads(json.dumps(row, indent=4, default=str)))
        cursor.close()
        return result

    def getAllDepartments(self):
        cursor = self.conn.cursor()
        query = "select distinct department from public.course order by department asc;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(json.loads(json.dumps(row, indent=4, default=str)))
        cursor.close()
        return result
