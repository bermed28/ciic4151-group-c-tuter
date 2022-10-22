import psycopg2, os

class UserScheduleDAO:

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

    def getAllUserSchedules(self):
        cursor = self.conn.cursor()
        query = "select us_id, user_id, ts_id, us_day from public.user_schedule;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getUserScheduleById(self, us_id):
        cursor = self.conn.cursor()
        query = "select us_id, user_id, ts_id, us_day from public.user_schedule where us_id = %s;"
        cursor.execute(query, (us_id,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def getUserScheduleByUserId(self, user_id):
        cursor = self.conn.cursor()
        query = "select us_id, user_id, ts_id, us_day from public.user_schedule where user_id = %s;"
        cursor.execute(query, (user_id,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def insertUserSchedule(self, user_id, ts_id, us_day):
        cursor = self.conn.cursor()
        query = "insert into public.user_schedule(user_id, ts_id, us_day) values(%s,%s,%s) returning us_id;"
        cursor.execute(query, (user_id, ts_id, us_day))
        us_id = cursor.fetchone()[0]
        self.conn.commit()
        cursor.close()
        return us_id

    def updateUserSchedule(self, us_id, user_id, ts_id, us_day):
        cursor = self.conn.cursor()
        query = "update public.user_schedule set user_id = %s, ts_id = %s, us_day = %s where us_id = %s;"
        cursor.execute(query, (user_id, ts_id, us_day, us_id))
        self.conn.commit()
        cursor.close()
        return True

    def deleteUserSchedule(self, us_id):
        cursor = self.conn.cursor()
        query = "delete from public.user_schedule where us_id=%s;"
        cursor.execute(query, (us_id,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows != 0

    def deleteUserSchedulebyTimeIDAndDay(self, user_id, ts_id, ts_day):
        cursor = self.conn.cursor()
        query = "delete from public.user_schedule where user_id=%s and ts_id=%s and us_day=%s;"
        cursor.execute(query, (user_id, ts_id, ts_day))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows != 0

    def getOccupiedTsId(self, user_id, us_day):
        cursor = self.conn.cursor()
        query = "select distinct ts_id, us_day from user_schedule where user_id = %s and us_day = %s"
        cursor.execute(query, (user_id, us_day))
        result = []
        for row in cursor:
            result.append(row[0])
        cursor.close()
        return result