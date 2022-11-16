import os
import psycopg2

class MembersDAO:

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

    def getAllMembers(self):
        cursor = self.conn.cursor()
        query = "select user_id, session_id from public.members;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getMemberByUserId(self, user_id):
        cursor = self.conn.cursor()
        query = "select user_id, session_id from public.members where user_id = %s;"
        cursor.execute(query, (user_id,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getMembersBySessionId(self, session_id):
        cursor = self.conn.cursor()
        query = "select user_id, session_id from public.members where session_id = %s;"
        cursor.execute(query, (session_id,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def insertMember(self, user_id, session_id):
        cursor = self.conn.cursor()
        query = "insert into public.members(user_id, session_id) values(%s,%s)"
        cursor.execute(query, (user_id, session_id))
        self.conn.commit()
        cursor.close()
        return True

    def deleteSessionMembers(self, session_id):
        cursor = self.conn.cursor()
        query = "delete from public.members where session_id=%s;"
        cursor.execute(query, (session_id,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the part was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows != 0

    def deleteMemberbySessionID(self, user_id, session_id):
        cursor = self.conn.cursor()
        query = "delete from public.members where user_id=%s and session_id=%s;"
        cursor.execute(query, (user_id, session_id))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the member was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows != 0

    def getUsersInSession(self, session_id):
        cursor = self.conn.cursor()
        query = 'with users_in_session as (select user_id from tutoring_session where session_id = %s union ' \
                '(select user_id from members where session_id = %s)) select username from "User" natural inner join' \
                ' users_in_session;'
        cursor.execute(query, (session_id, session_id,))
        result = []
        for user in cursor:
            result.append(user[0])
        return result

    def __del__(self):
        self.conn.close()
