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
        query = "select usid, uid, tid, usday from public.user_schedule;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getUserScheduleById(self, usid):
        cursor = self.conn.cursor()
        query = "select usid, uid, tid, usday from public.user_schedule where usid = %s;"
        cursor.execute(query, (usid,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def getUserScheduleByUserId(self, uid):
        cursor = self.conn.cursor()
        query = "select usid, uid, tid, usday from public.user_schedule where uid = %s;"
        cursor.execute(query, (uid,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def insertUserSchedule(self, uid, tid, usday):
        cursor = self.conn.cursor()
        query = "insert into public.user_schedule(uid, tid, usday) values(%s,%s,%s) returning usid;"
        cursor.execute(query, (uid, tid, usday))
        usid = cursor.fetchone()[0]
        self.conn.commit()
        cursor.close()
        return usid

    def updateUserSchedule(self, usid, uid, tid, usday):
        cursor = self.conn.cursor()
        query = "update public.user_schedule set uid = %s, tid = %s, usday = %s where usid = %s;"
        cursor.execute(query, (uid, tid, usday, usid))
        self.conn.commit()
        cursor.close()
        return True

    def deleteUserSchedule(self, usid):
        cursor = self.conn.cursor()
        query = "delete from public.user_schedule where usid=%s;"
        cursor.execute(query, (usid,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows != 0

    def deleteUserSchedulebyTimeIDAndDay(self, uid, tid, day):
        cursor = self.conn.cursor()
        query = "delete from public.user_schedule where uid=%s and tid=%s and usday=%s;"
        cursor.execute(query, (uid,tid,day))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows != 0

    def getOccupiedTsId(self, uid, usday):
        cursor = self.conn.cursor()
        query = "select distinct tid, usday from user_schedule where uid = %s and usday = %s"
        cursor.execute(query, (uid, usday))
        result = []
        for row in cursor:
            result.append(row[0])
        cursor.close()
        return result