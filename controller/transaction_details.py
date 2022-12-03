import json

from flask import jsonify

from model.transaction_details import TransactionDetailsDAO

class BaseTransactionDetails:

    def build_map_dict(self, row):
        result = {}
        result['td_id'] = row[0]
        result['ref_num'] = row[1]
        result['amt_captured'] = row[2]
        result['card_brand'] = row[3]
        result['last_four'] = row[4]
        result['receipt_url'] = row[5]
        result['currency'] = row[6]
        result['customer_id'] = row[7]
        return result

    def build_attr_dict(self, td_id, ref_num, amt_captured, card_brand, last_four, receipt_url, currency, customer_id):
        result = {}
        result['td_id'] = td_id
        result['ref_num'] = ref_num
        result['amt_captured'] = amt_captured
        result['card_brand'] = card_brand
        result['last_four'] = last_four
        result['receipt_url'] = receipt_url
        result['currency'] = currency
        result['customer_id'] = customer_id
        return result

    def getAllTransactionDetails(self):
        dao = TransactionDetailsDAO()
        members = dao.getAllTransactionDetails()
        result_list = []
        for row in members:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list), 200

    def getTransactionByTransactionId(self, td_id):
        dao = TransactionDetailsDAO()
        transaction = dao.getTransactionByTransactionId(td_id)
        if not transaction:
            return jsonify("Not Found"), 404
        else:
            obj = self.build_map_dict(transaction)
            return jsonify(obj), 200

    def addNewTransactionDetails(self, json):
        ref_num = json['ref_num']
        amt_captured = json['amt_captured']
        card_brand = json['card_brand']
        last_four = json['last_four']
        receipt_url = json['receipt_url']
        currency = json['currency']
        customer_id = json["customer_id"]
        dao = TransactionDetailsDAO()
        td_id = dao.insertTransactionDetails(ref_num, amt_captured, card_brand, last_four, receipt_url, currency, customer_id)
        result = self.build_attr_dict(td_id, ref_num, amt_captured, card_brand, last_four, receipt_url, currency, customer_id)
        return jsonify(result), 201

    def deleteTransaction(self, transaction_id):
        dao = TransactionDetailsDAO()
        result = dao.deleteTransaction(transaction_id)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    def getTransactionByRefNum(self, json):
        refNum = json['refNum']
        dao = TransactionDetailsDAO()
        transactions = dao.getTransactionByRefNum(refNum)
        result_list = []
        for row in transactions:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list), 200

    def getTransactionByCustomerId(self, json):
        customer_id = json['customer_id']
        dao = TransactionDetailsDAO()
        transactions = dao.getTransactionByCustomerId(customer_id)
        result_list = []
        for row in transactions:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        print(result_list)
        return jsonify(result_list), 200

