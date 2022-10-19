from flask import jsonify
from model.transactions import TransactionsDAO

class BaseTransactions:

    def build_map_dict(self, row):
        result = {}
        result['transaction_id'] = row[0]
        result['ref_num'] = row[1]
        result['amount'] = row[2]
        result['transaction_date'] = row[3]
        result['user_id'] = row[4]
        result['payment_method'] = row[5]
        return result

    def build_attr_dict(self, transaction_id, ref_num, amount, transaction_date, user_id, payment_method):
        result = {}
        result['transaction_id'] = transaction_id
        result['ref_num'] = ref_num
        result['amount'] = amount
        result['transaction_date'] = transaction_date
        result['user_id'] = user_id
        result['payment_method'] = payment_method
        return result

    def getAllTransactions(self):
        dao = TransactionsDAO()
        members = dao.getAllTransactions()
        result_list = []
        for row in members:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    def getTransactionsByTransactionsId(self, transactions_id):
        dao = TransactionsDAO()
        members = dao.getTransactionByTransactionId(transactions_id)
        if not members:
            return jsonify("Not Found"), 404
        else:
            result_list = []
            for row in members:
                obj = self.build_map_dict(row)
                result_list.append(obj)
            return jsonify(result_list), 200

    def addNewTransaction(self, json):
        ref_num = json['ref_num']
        amount = json['amount']
        transaction_date = json['transaction_date']
        user_id = json['user_id']
        payment_method = json['payment_method']
        dao = TransactionsDAO()
        transaction_id = dao.insertTransaction(ref_num, amount, transaction_date, user_id, payment_method)
        result = self.build_attr_dict(transaction_id, ref_num, amount, transaction_date, user_id, payment_method)
        return jsonify(result), 201

    def deleteTransaction(self, transaction_id, json):
        dao = TransactionsDAO()
        result = dao.deleteTransaction(transaction_id)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404