import os
import psycopg2

class SessionScheduleDAO:

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

    def getAllSessionSchedules(self):
        cursor = self.conn.cursor()
        query = "select session_id, ts_id from public.session_schedule;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getTimeSlotsBySessionId(self, session_id):
        cursor = self.conn.cursor()
        query = "select ts_id from public.session_schedule where session_id = %s;"
        cursor.execute(query, (session_id,))
        result = []
        for row in cursor:
            result.append(row[0])
        cursor.close()
        return result

    def getSessionScheduleBySessionId(self, session_id):
        cursor = self.conn.cursor()
        query = "select session_id, ts_id from public.session_schedule where session_id = %s;"
        cursor.execute(query, (session_id,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def insertSessionSchedule(self, session_id, ts_id):
        cursor = self.conn.cursor()
        query = "insert into public.session_schedule(session_id, ts_id) values(%s,%s);"
        cursor.execute(query, (session_id, ts_id))
        self.conn.commit()
        cursor.close()
        return [session_id, ts_id]

    def deleteSessionSchedule(self, session_id):
        cursor = self.conn.cursor()
        query = "delete from public.session_schedule where session_id=%s;"
        cursor.execute(query, (session_id,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        cursor.close()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        return affected_rows != 0
