import os
import psycopg2
import json

class SessionDAO:

    def __init__(self):
        connection_url = "dbname=%s user=%s password=%s port=%s host=%s" % (
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

    def getAllSessions(self):
        cursor = self.conn.cursor()
        query = "select session_id, session_date, is_in_person, location, user_id, course_code, c.course_id " \
                "from public.tutoring_session inner join course c on c.course_id = tutoring_session.course_id;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getSessionById(self, session_id):
        cursor = self.conn.cursor()
        query = "select session_id, session_date, is_in_person, location, user_id, course_code, c.course_id " \
                "from public.tutoring_session inner join course c on c.course_id = tutoring_session.course_id where session_id = %s;"
        cursor.execute(query, (session_id,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def getSessionsByUserId(self, user_id):
        cursor = self.conn.cursor()
        query = "with involved_tutoring_sessions as (select session_id from " \
                "((select user_id, session_id from tutoring_session where user_id = %s) " \
                "union (select user_id, session_id from members where user_id = %s)) as temp) " \
                "select session_id, session_date, tutoring_session.user_id, is_in_person, location, course_code, course_id " \
                "from tutoring_session natural inner join session_schedule natural inner join course where session_id in (select session_id " \
                "from involved_tutoring_sessions);"
        cursor.execute(query, (user_id, user_id))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def insertSession(self, session_date, is_in_person, location, user_id, course_id):
        cursor = self.conn.cursor()
        query = "insert into public.tutoring_session(session_date, is_in_person, location, user_id, course_id) " \
                "values(%s,%s,%s,%s,%s) returning session_id;"
        cursor.execute(query, (session_date, is_in_person, location, user_id, course_id))
        session_id = cursor.fetchone()[0]
        self.conn.commit()
        cursor.close()
        return session_id

    def updateSession(self, session_id, session_date, is_in_person, location, user_id):
        cursor = self.conn.cursor()
        query = "update public.tutoring_session set session_date = %s, is_in_person = %s, location = %s, " \
                "user_id = %s where session_id = %s;"
        cursor.execute(query, (session_date, is_in_person, location, user_id, session_id))
        self.conn.commit()
        cursor.close()
        return True

    def deleteSession(self, session_id):
        cursor = self.conn.cursor()
        query = "delete from public.tutoring_session where session_id=%s;"
        cursor.execute(query, (session_id,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows != 0

    def getBusiestHours(self):
        cursor = self.conn.cursor()
        query = "with busiest_hours as (select ts_id, count(ts_id) as times_booked from session_schedule \
                 group by ts_id) select * from time_slot natural inner join busiest_hours order by times_booked \
                 desc limit 5"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(json.loads(json.dumps(row, indent=4, default=str)))
        cursor.close()
        return result

    def getMostBookedTutors(self):
        cursor = self.conn.cursor()
        query = 'with booking_table as (select user_id, count(*) as times_booked from ((select user_id, session_id from tutoring_session)\
        union (select user_id, session_id from members)) as temp natural inner join public."User" group by user_id order by times_booked desc) \
        select user_id, username, password, email, name, balance, user_role, hourly_rate, times_booked from public."User" natural inner join \
        booking_table where user_role = %s order by times_booked desc limit 10;'
        cursor.execute(query, ('Tutor',))
        result = []
        for row in cursor:
            dict = {}
            dict['user_id'] = row[0]
            dict['username'] = row[1]
            dict['password'] = row[2]
            dict['email'] = row[3]
            dict['name'] = row[4]
            dict['balance'] = row[5]
            dict['user_role'] = row[6]
            dict['hourly_rate'] = row[7]
            dict['times_booked'] = row[8]
            result.append(dict)
        cursor.close()
        return result

    def checkForConflicts(self, time_slots):
        boolean = False
        cursor = self.conn.cursor()
        query = "select * from tutoring_session natural inner join session_schedule where ts_id = %s"
        for time_slot in time_slots:
            cursor.execute(query, (time_slot,))
            if cursor.rowcount > 0:
                boolean = True
                break
        cursor.close()
        return boolean

    def getInUseTsIds(self, session_id):
        cursor = self.conn.cursor()
        query = "select ts_id from public.session_schedule where session_id = %s;"
        cursor.execute(query, (session_id,))
        result = []
        for row in cursor:
            result.append(row[0])
        cursor.close()
        return result

    def changeSessionDate(self, session_id, new_session_date):
        cursor = self.conn.cursor()
        query = "update public.tutoring_session set session_date = %s where session_id = %s;"
        cursor.execute(query, (new_session_date, session_id))
        if cursor.rowcount <= 0:
            return False
        self.conn.commit()
        cursor.close()
        return True

    def removeUserByUsername(self, username, session_id):
        cursor = self.conn.cursor()
        query = 'with id_from_username as (select user_id from public."User" where username = %s) \
        delete from public.members where session_id=%s and user_id in (select user_id from id_from_username);'
        cursor.execute(query, (username, session_id))
        affected_rows = cursor.rowcount
        self.conn.commit()
        cursor.close()
        return affected_rows != 0

    def getUpcomingSessionsByUser(self, user_id):
        cursor = self.conn.cursor()
        query = 'with tutor_info as (select username, name, email, (rating / cast(rate_count as numeric(5,2))) ' \
                'as tutor_rating, department, description from public."User" where user_id in (select distinct ' \
                'recipient_id from transactions where user_id = %s)), session_info as (select course_code, ' \
                'session_date, start_time from tutoring_session natural inner join session_schedule natural inner ' \
                'join time_slot natural inner join course where session_date >= current_date and user_id = %s) ' \
                'select distinct on (session_date) session_date, start_time, course_code, name as tutor_name, ' \
                'tutor_rating, department from tutor_info natural inner join session_info order by session_date, ' \
                'start_time;'
        cursor.execute(query, (user_id, user_id,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getRecentBookingsByUser(self, user_id):
        cursor = self.conn.cursor()
        query = 'with tutor_info as (select username, name, email, (rating / cast(rate_count as numeric(5,2))) as ' \
                'tutor_rating, department, description from "User" where user_id in (select distinct recipient_id ' \
                'from transactions where user_id = %s)), session_info as (select course_code, session_date, ' \
                'start_time from tutoring_session natural inner join session_schedule natural inner join time_slot ' \
                'natural inner join course where session_date between current_date - 30 and current_date and ' \
                'user_id = %s) select distinct on (session_date) session_date, start_time, course_code, name as ' \
                'tutor_name, tutor_rating, department from tutor_info natural inner join session_info order by ' \
                'session_date, start_time;'
        cursor.execute(query, (user_id, user_id,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getTutorBySession(self, session_id):
        cursor = self.conn.cursor()
        query = 'select "User".user_id as tutor_id, username, email, name, user_role, ' \
                '(rating / cast(rate_count as numeric(5,2))) as tutor_rating, department, description from "User" ' \
                'inner join members on "User".user_id = members.user_id inner join tutoring_session on ' \
                'members.session_id = tutoring_session.session_id where user_role = %s and ' \
                'tutoring_session.session_id = %s;'
        cursor.execute(query, ("Tutor", session_id,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def getUpcomingSessionsByTutorId(self, tutor_id):
        cursor = self.conn.cursor()
        query = 'with student_info as (select username, name, email, (rating / cast(rate_count as numeric(5,2))) as ' \
                'student_rating, department, description from public."User" where user_id in (select distinct ' \
                'transactions.user_id from transactions where recipient_id = 94)), session_info as (select ' \
                'course_code, session_date, start_time from tutoring_session natural inner join session_schedule ' \
                'natural inner join time_slot natural inner join course natural inner join transactions where ' \
                'session_date >= current_date and recipient_id = 94) select distinct on (session_date) session_date, ' \
                'start_time, course_code, name as student_name, student_rating, department from student_info natural ' \
                'inner join session_info order by session_date, start_time;'
        cursor.execute(query, (tutor_id, tutor_id,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result
