import json

from flask import jsonify
from model.transactions import TransactionsDAO
from datetime import datetime
from controller.tutoring_session import BaseSession

class BaseTransactions:

    def build_map_dict(self, row):
        result = {}
        result['transaction_id'] = row[0]
        result['ref_num'] = row[1]
        result['amount'] = row[2]
        result['transaction_date'] = row[3]
        result['user_id'] = row[4]
        result['payment_method'] = row[5]
        result['recipient_id'] = row[6]
        result['session_id'] = row[7]
        return result

    def build_receipt_map_dict(self, row):
        result = {}
        result['tutor_username'] = row[0]
        result['tutor_name'] = row[1]
        result['total'] = row[2]
        result['ref_num'] = row[3]
        result['payment_method'] = row[4]
        result['subtotal'] = row[5]
        result['tax'] = row[6]
        result['transaction_date'] = row[7]
        result['service_tag'] = row[8]
        result['tutor_id'] = row[9]
        return result

    def build_attr_dict(self, transaction_id, ref_num, amount, transaction_date, user_id, payment_method, recipient_id, session_id):
        result = {}
        result['transaction_id'] = transaction_id
        result['ref_num'] = ref_num
        result['amount'] = amount
        result['transaction_date'] = transaction_date
        result['user_id'] = user_id
        result['payment_method'] = payment_method
        result['recipient_id'] = recipient_id
        result['session_id'] = session_id
        return result

    def getAllTransactions(self):
        dao = TransactionsDAO()
        members = dao.getAllTransactions()
        result_list = []
        for row in members:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list), 200

    def getTransactionsByTransactionId(self, transactions_id):
        dao = TransactionsDAO()
        transaction = dao.getTransactionByTransactionId(transactions_id)
        if not transaction:
            return jsonify("Not Found"), 404
        else:
            obj = self.build_map_dict(transaction)
            return jsonify(obj), 200

    def addNewTransaction(self, json):
        ref_num = json['ref_num']
        amount = json['amount']
        user_id = json['user_id']
        payment_method = json['payment_method']
        recipient_id = json['recipient_id']
        session_id = json['session_id']
        dao = TransactionsDAO()
        transaction_id = dao.insertTransaction(ref_num, amount, user_id, payment_method, recipient_id, session_id)
        result = self.build_attr_dict(transaction_id, ref_num, amount, datetime.now(), user_id, payment_method, recipient_id, session_id)
        return jsonify(result), 201

    def deleteTransaction(self, transaction_id):
        dao = TransactionsDAO()
        result = dao.deleteTransaction(transaction_id)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    def getTransactionsByUserId(self, user_id):
        dao = TransactionsDAO()
        transactions = dao.getTransactionsByUserId(user_id)
        result_list = []
        for row in transactions:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list), 200

    def getTransactionReceipts(self, json):
        user_id = json['user_id']
        dao = TransactionsDAO()
        if 'tax_pctg' in json:
            tax_pctg = json['tax_pctg']
            transactions = dao.getTransactionReceipts(user_id, tax_pctg)
        else:
            transactions = dao.getTransactionReceipts(user_id)
        result_list = []
        for row in transactions:
            obj = self.build_receipt_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list), 200
