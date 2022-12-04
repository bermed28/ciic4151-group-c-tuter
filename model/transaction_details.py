import os
import psycopg2

class TransactionDetailsDAO:

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

    def getAllTransactionDetails(self):
        cursor = self.conn.cursor()
        query = "select td_id, ref_num, amt_captured, card_brand, last_four, receipt_url, currency, customer_id " \
                "from public.transaction_details;"
        cursor.execute(query)
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getTransactionByTransactionId(self, td_id):
        cursor = self.conn.cursor()
        query = "select td_id, ref_num, amt_captured, card_brand, last_four, receipt_url, currency, customer_id " \
                "from public.transaction_details where td_id = %s;"
        cursor.execute(query, (td_id,))
        result = cursor.fetchone()
        cursor.close()
        return result

    def getTransactionByRefNum(self, ref_num):
        cursor = self.conn.cursor()
        query = "select td_id, ref_num, amt_captured, card_brand, last_four, receipt_url, currency, customer_id " \
                "from public.transaction_details where ref_num = %s;"
        cursor.execute(query, (ref_num,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def getTransactionByCustomerId(self, customer_id):
        cursor = self.conn.cursor()
        query = "select td_id, ref_num, amt_captured, card_brand, last_four, receipt_url, currency, customer_id " \
                "from public.transaction_details where customer_id = %s;"
        cursor.execute(query, (customer_id,))
        result = []
        for row in cursor:
            result.append(row)
        cursor.close()
        return result

    def insertTransactionDetails(self, ref_num, amt_captured, card_brand, last_four, receipt_url,
                                 currency, customer_id):
        cursor = self.conn.cursor()
        query = "insert into public.transaction_details(ref_num, amt_captured, card_brand, last_four, " \
                "receipt_url, currency, customer_id)  values(%s,%s,%s,%s,%s,%s,%s) returning td_id;"
        cursor.execute(query, (ref_num, amt_captured, card_brand, last_four, receipt_url, currency, customer_id))
        td_id = cursor.fetchone()[0]
        self.conn.commit()
        cursor.close()
        return td_id

    # def updateTransaction(self, transaction_id, ref_num, amount, transaction_date, user_id, payment_method, recipient_id):
    #     cursor = self.conn.cursor()
    #     query = "update public.transactions set ref_num = %s, amount = %s, transaction_date = %s, user_id = %s, " \
    #             "payment_method = %s, recipient_id = %s where transaction_id = %s;"
    #     cursor.execute(query, (ref_num, amount, transaction_date, user_id, payment_method, recipient_id, transaction_id))
    #     self.conn.commit()
    #     cursor.close()
    #     return True

    def deleteTransaction(self, td_id):
        cursor = self.conn.cursor()
        query = "delete from public.transaction_details where td_id=%s;"
        cursor.execute(query, (td_id,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the transaction was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows != 0

    def deleteTransactionbyRefNum(self, ref_num):
        cursor = self.conn.cursor()
        query = "delete from public.transaction_details where ref_num=%s;"
        cursor.execute(query, (ref_num,))
        # determine affected rows
        affected_rows = cursor.rowcount
        self.conn.commit()
        # if affected rows == 0, the transaction was not found and hence not deleted
        # otherwise, it was deleted, so check if affected_rows != 0
        cursor.close()
        return affected_rows != 0

    def __del__(self):
        self.conn.close()
