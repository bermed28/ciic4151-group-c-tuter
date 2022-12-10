import os
import psycopg2

class TransactionsDAO:

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

    def getAllTransactions(self):
        cursor = self.conn.cursor()
        query = "select transaction_id, ref_num, amount, transaction_date, user_id, payment_method, recipient_id, " \
                "session_id from public.transactions;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getTransactionByTransactionId(self, transaction_id):
        cursor = self.conn.cursor()
        query = "select transaction_id, ref_num, amount, transaction_date, user_id, payment_method, recipient_id, " \
                "session_id from public.transactions where transaction_id = %s;"
        cursor.execute(query, (transaction_id,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def insertTransaction(self, ref_num, amount, user_id, payment_method, recipient_id, session_id):
        cursor = self.conn.cursor()
        query = "insert into public.transactions(ref_num, amount, transaction_date, user_id, payment_method, " \
                "recipient_id, session_id) values(%s,%s,now(),%s,%s,%s,%s) returning transaction_id;"
        cursor.execute(query, (ref_num, amount, user_id, payment_method, recipient_id, session_id))
        tid = cursor.fetchone()[0]
        self.conn.commit()
        cursor.close()
        return tid

    def updateTransaction(self, transaction_id, ref_num, amount, transaction_date, user_id, payment_method, recipient_id, session_id):
        cursor = self.conn.cursor()
        query = "update public.transactions set ref_num = %s, amount = %s, transaction_date = %s, user_id = %s, " \
                "payment_method = %s, recipient_id = %s, session_id = %s where transaction_id = %s;"
        cursor.execute(query, (ref_num, amount, transaction_date, user_id, payment_method, recipient_id, transaction_id, session_id))
        self.conn.commit()
        cursor.close()
        return True

    def deleteTransaction(self, transaction_id):
        cursor = self.conn.cursor()
        query = "delete from public.transactions where transaction_id=%s;"
        cursor.execute(query, (transaction_id,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the transaction was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows != 0

    def deleteTransactionbySessionID(self, session_id):
        cursor = self.conn.cursor()
        query = "delete from public.transactions where session_id=%s RETURNING ref_num;"
        cursor.execute(query, (session_id,))
        # determine affected rows
        affected_rows = cursor.rowcount
        ref_num = cursor.fetchone()[0]
        self.conn.commit()
        # if affected rows == 0, the transaction was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return ref_num

    def getTransactionsByUserId(self, user_id):
        cursor = self.conn.cursor()
        query = "select transaction_id, ref_num, amount, transaction_date, user_id, payment_method, recipient_id " \
                "from public.transactions where user_id = %s;"
        cursor.execute(query, (user_id,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def __del__(self):
        self.conn.close()

    def getTransactionReceipts(self, user_id, tax_pctg=0.115):
        total_price_mult = 1 + tax_pctg
        cursor = self.conn.cursor()
        query = 'with tutor_info as (select distinct session_id, "User".user_id as tutor_id, username as tutor_username, name as tutor_name, ' \
                'email as tutor_email, (rating / cast(rate_count as numeric(5,2))) as tutor_rating, department as ' \
                'tutor_department, description as tutor_description from "User" inner join transactions t on ' \
                '"User".user_id = t.recipient_id where "User".user_id in (select distinct ' \
                'recipient_id from transactions where user_id = %s)) select tutor_username, tutor_name, amount as ' \
                'total, ref_num, payment_method, round(cast(amount/%s as numeric), 2) as subtotal, ' \
                'round(cast(amount/%s * %s as numeric), 2) as tax,  transaction_date, course_code as service_tag, tutor_id ' \
                'from transactions natural inner join tutoring_session natural inner join course natural inner join ' \
                'tutor_info where user_id = %s;'
        cursor.execute(query, (user_id, total_price_mult, total_price_mult, tax_pctg, user_id,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result
