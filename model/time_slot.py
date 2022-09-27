import psycopg2
import json, os

class TimeSlotDAO:

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

    def getAllTimeSlots(self):
        cursor = self.conn.cursor()
        query = "select tid, tstarttime, tendtime from public.time_slot;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(json.loads(json.dumps(row, indent=4, default=str)))
        cursor.close()
        return result

    def getTimeSlotByTimeSlotId(self, tid):
        cursor = self.conn.cursor()
        query = "select tid, tstarttime, tendtime from public.time_slot where tid = %s;"
        cursor.execute(query, (tid,))
        result = cursor.fetchone()
        cursor.close()
        return json.loads(json.dumps(result, indent=4, default=str))

    def __del__(self):
        self.conn.close()
    #
    # def insertTimeSlot(self, tstarttime, tendtime):
    #     cursor = self.conn.cursor()
    #     query = "insert into public.time_slot(tstarttime, tendtime) values(%s,%s) returning tid;"
    #     cursor.execute(query, (tstarttime, tendtime))
    #     uid = cursor.fetchone()[0]
    #     self.conn.commit()
    #     return uid
    #
    # def updateTimeSlot(self, tid, tstarttime, tendtime):
    #     cursor = self.conn.cursor()
    #     query = "update public.time_slot set tstarttime = %s, tendtime = %s where tid = %s;"
    #     cursor.execute(query, (tstarttime, tendtime, tid))
    #     self.conn.commit()
    #     return True
    #
    # def deleteTimeSlot(self, tid):
    #     cursor = self.conn.cursor()
    #     query = "delete from public.time_slot where tid=%s;"
    #     cursor.execute(query, (tid,))
    #     # determine affected rows
    #     affected_rows = cursor.rowcount
    #     self.conn.commit()
    #     # if affected rows == 0, the part was not found and hence not deleted
    #     # otherwise, it was deleted, so check if affected_rows != 0
    #     return affected_rows !=0