import psycopg2
import json, os

class UserDAO:

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

    def getAllUsers(self):
        cursor = self.conn.cursor()
        query = 'select user_id, username, email, password, name, balance, user_role, hourly_rate, (rating / cast(rate_count as numeric(5,2)))' \
                ' as user_rating, description, department from public."User";'
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getUserById(self, user_id):
        cursor = self.conn.cursor()
        query = 'select user_id, username, email, password, name, balance, user_role, hourly_rate, (rating / cast(rate_count as numeric(5,2)))' \
                ' as user_rating, description, department from public."User" where user_id = %s;'
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def getUserByLoginInfo(self, email, password):
        cursor = self.conn.cursor()
        query = 'select user_id, username, email, password, name, balance, user_role, hourly_rate, (rating / cast(rate_count as numeric(5,2)))' \
                 'as user_rating, description, department from public."User" where email=%s and password=crypt(%s, password);'
        cursor.execute(query, (email, password))
        result = cursor.fetchone()
        cursor.close()
        return result

    def getUserHashedPassword(self, email):
        cursor = self.conn.cursor()
        query = 'select password from public."User" where email=%s'
        cursor.execute(query, (email,))
        result = cursor.fetchone()[0]
        cursor.close()
        return result

    def insertUser(self, username, email, password, name, user_role, department, hourly_rate):
        cursor = self.conn.cursor()
        query = 'insert into public."User"(username,email,password,name,user_role,balance,rating,rate_count,department,hourly_rate)' \
                'values(%s,%s,crypt(%s, gen_salt(%s)),%s,%s,%s,%s,%s,%s,%s) returning user_id;'
        cursor.execute(query, (username, email, password, 'bf', name, user_role, 0, 5.0, 1, department, hourly_rate))
        user_id = cursor.fetchone()[0]
        self.conn.commit()
        cursor.close()
        return user_id

    def updateUser(self, user_id, username, email, password, name, user_role, user_balance, description, hourly_rate,
                   department):
        cursor = self.conn.cursor()
        query = 'update public."User" set username = %s, email = %s, password = crypt(%s, gen_salt(%s)), name = %s,' \
                'user_role = %s, balance = %s, description = %s, hourly_rate = %s, department = %s ' \
                'where user_id = %s and password=crypt(%s, password) returning *;'
        cursor.execute(query, (username, email, password, 'bf', name, user_role, user_balance, description,
                               hourly_rate, department, user_id, password))
        self.conn.commit()
        row = cursor.fetchone()
        cursor.close()
        if row:
            return True
        return False

    def updateDescription(self, user_id, description):
        cursor = self.conn.cursor()
        query = 'update public."User" set description = %s where user_id = %s;'
        cursor.execute(query, (description, user_id))
        self.conn.commit()
        cursor.close()
        return True

    def updateDepartment(self, user_id, department):
        cursor = self.conn.cursor()
        query = 'update public."User" set department = %s where user_id = %s;'
        cursor.execute(query, (department, user_id))
        self.conn.commit()
        cursor.close()
        return True

    def getRatingInfo(self, user_id):
        cursor = self.conn.cursor()
        query = 'select rating, rate_count from public."User" where user_id = %s'
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def setUserRating(self, user_id, new_rating, new_rate_count):
        # actual rating = rating / rate_count
        cursor = self.conn.cursor()
        query = 'update public."User" set rating = %s, rate_count = %s where user_id = %s'
        cursor.execute(query, (new_rating, new_rate_count, user_id,))
        self.conn.commit()
        cursor.close()
        return True

    def deleteUser(self, user_id):
        cursor = self.conn.cursor()
        query = 'delete from public."User" where user_id=%s;'
        cursor.execute(query, (user_id,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows !=0

    def getTimeSlot(self):
        cursor = self.conn.cursor()
        query = 'select * from time_slot;'
        cursor.execute(query)
        result = []
        for row in cursor:
            dict = {}
            dict['tid'] = row[0]
            dict['tstarttime'] = row[1]
            dict['tendtime'] = row[2] #Causes TypeError: Object of type time is not JSON serializable
            #Turning time to string with a json dumps avoids the type casting problem
            result.append(json.loads(json.dumps(dict, indent=4, default=str)))
        cursor.close()
        return result

    def getUserOccupiedTimeSlots(self, user_id, us_day):
        cursor = self.conn.cursor()
        query = 'select ts_id from user_schedule where user_id = %s and us_day = %s'
        cursor.execute(query, (user_id, us_day))
        result = []
        for row in cursor:
            result.append(row[0])
        cursor.close()
        return result

    def getAllOccupiedUserSchedule(self, user_id):
        cursor = self.conn.cursor()
        # query = 'select tid, usday from user_schedule where user_id = %s'
        query = 'with involved_reservations as (select resid from ((select user_id, resid from reservation where user_id = %s) \
        union (select user_id, resid from members where user_id = %s)) as temp), \
        time_slots_to_meet as (select tid, resday from reservation_schedule natural inner join reservation where resid in (select resid from involved_reservations)) \
        select tid, usday from user_schedule where ROW(tid, usday) not in (select tid, resday as usday from time_slots_to_meet) and user_id=%s;'

        cursor.execute(query, (user_id, user_id, user_id))
        result = {}
        for row in cursor:
            if str(row[1]) not in result:
                result[str(row[1])] = [row[0]]
            else:
                result[str(row[1])].append(row[0])
        cursor.close()
        return result

    def checkRole(self, user_id):
        cursor = self.conn.cursor()
        query = 'select user_role from public."User" where user_id = %s'
        cursor.execute(query, (user_id,))
        result = cursor.fetchone()[0]
        cursor.close()
        return result

    def getAllUserInvolvements(self, user_id):
        cursor = self.conn.cursor()
        query = 'select session_id from ((select user_id, session_id from tutoring_session where user_id = %s) union \
                 (select user_id, session_id from members where user_id = %s)) as temp'
        cursor.execute(query, (user_id, user_id))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getuser_idbyUsername(self, username):
        cursor = self.conn.cursor()
        query = 'select user_id from public."User" where username = %s;'
        cursor.execute(query, (username,))
        if cursor.rowcount <= 0:
            return -1
        result = cursor.fetchone()[0]
        cursor.close()
        return result

    def getMasteredCourseCodes(self, user_id):
        cursor = self.conn.cursor()
        query = 'select course_code from masters natural inner join course where user_id = %s;'
        cursor.execute(query, (user_id,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def setUpdateUserRole(self, user_id, new_role):
        cursor = self.conn.cursor()
        query = 'update public."User" set user_role = %s where user_id = %s'
        cursor.execute(query, (new_role, user_id,))
        self.conn.commit()
        cursor.close()
        return True
