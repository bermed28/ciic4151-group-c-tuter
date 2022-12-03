import os
import psycopg2

class MastersDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host=%s" % (
            os.getenv('DB_NAME'),
            os.getenv('DB_USER'),
            os.getenv('DB_PASSWORD'),
            os.getenv('DB_PORT'),
            os.getenv('DB_HOST'),
        )
        print("conection url:  ", connection_url)
        self.conn = psycopg2.connect(connection_url)
    
    def __del__(self):
        self.conn.close()

    def getAllMasters(self):
        cursor = self.conn.cursor()
        query = "select user_id, course_id from public.masters;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getMastersByUserId(self, user_id):
        cursor = self.conn.cursor()
        query = "select user_id, course_id from public.masters where user_id = %s;"
        cursor.execute(query, (user_id,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getMastersByCourseId(self, course_id):
        cursor = self.conn.cursor()
        query = "select user_id, course_id from public.masters where course_id = %s;"
        cursor.execute(query, (course_id,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def insertMasters(self, user_id, course_id):
        cursor = self.conn.cursor()
        query = "insert into public.masters(user_id, course_id) values(%s,%s)"
        cursor.execute(query, (user_id, course_id))
        self.conn.commit()
        cursor.close()
        return user_id

    def countMasteries(self, user_id):
        cursor = self.conn.cursor()
        query = "select user_id, count(*) from masters where user_id = %s group by user_id"
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        cursor.close()
        return result

    # def updateMasters(self, oldcourse_id, newcourse_id, user_id):
    #     cursor = self.conn.cursor()
    #     query = "update public.masters set user_id = %s, course_id = %s where course_id = %s and user_id = %s;"
    #     cursor.execute(query, (user_id, newcourse_id, oldcourse_id, user_id))
    #     self.conn.commit()
    #     cursor.close()
    #     return True

    def deleteMasters(self, user_id, course_id):
        cursor = self.conn.cursor()
        query = "delete from public.masters where user_id=%s and course_id=%s;"
        cursor.execute(query, (user_id, course_id))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows != 0

    def deleteAllbyUserID(self, user_id):
        cursor = self.conn.cursor()
        query = "delete from public.masters where user_id=%s;"
        cursor.execute(query, (user_id))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows != 0

    # Gets the username of the users that can teach a certain course
    def getUsersMasters(self, course_id):
        cursor = self.conn.cursor()
        query = 'select username from public."User" natural inner join masters where course_id = %s;'
        cursor.execute(query, (course_id,))
        result = []
        for user in cursor:
            result.append(user[0])
        return result

    def getCourseMastersInfoByUserID(self, user_id):
        cursor = self.conn.cursor()
        query = 'select course_id, course_code, department, faculty, name from masters natural inner join course where user_id=%s'
        cursor.execute(query, (user_id,))
        result = []
        for course in cursor:
            result.append(course)
        return result
