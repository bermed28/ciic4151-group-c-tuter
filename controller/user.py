from flask import jsonify
from model.user import UserDAO
from model.time_slot import TimeSlotDAO

class BaseUser: # Note: Add Hourly Rate stuff
    
    def build_map_dict(self, row):
        result = {}
        result['user_id'] = row[0]
        result['username'] = row[1]
        result['email'] = row[2]
        result['password'] = row[3]
        result['name'] = row[4]
        result['user_role'] = row[6]
        return result

    def build_attr_dict(self, user_id, username, email, password, name, user_role):
        result = {}
        result['user_id'] = user_id
        result['username'] = username
        result['email'] = email
        result['password'] = password
        result['name'] = name
        result['user_role'] = user_role
        return result

    def getAllUsers(self):
        dao = UserDAO()
        user_list = dao.getAllUsers()
        result_list = []
        for row in user_list:
            obj = self.build_map_dict(row)
            result_list.append(obj)
        return jsonify(result_list)

    def getUserById(self, user_id):
        dao = UserDAO()
        user_tuple = dao.getUserById(user_id)
        if not user_tuple:
            return jsonify("Not Found"), 404
        else:
            result = self.build_map_dict(user_tuple)
            return jsonify(result), 200

    def getUserByLoginInfo(self, json):
        dao = UserDAO()
        email = json['email']
        password = json['password']
        user = self.build_map_dict(dao.getUserByLoginInfo(email, password))
        return jsonify(user), 200

    def addNewUser(self, json):
        username = json['username']
        email = json['email']
        password = json['password']
        name = json['name']
        user_role = json['user_role']
        dao = UserDAO()
        user_id = dao.insertUser(username, email, password, name, user_role)
        result = self.build_attr_dict(user_id, username, email, password, name, user_role)
        return jsonify(result), 201

    def updateUser(self, user_id, json):
        username = json['username']
        email = json['email']
        password = json['password']
        name = json['name']
        user_role = json['user_role']
        dao = UserDAO()
        updated_user = dao.updateUser(user_id, username, email, password, name, user_role)
        result = self.build_attr_dict(user_id, username, email, password, name, user_role)
        return jsonify(result), 200

    def deleteUser(self, user_id):
        dao = UserDAO()
        if dao.getAllUserInvolvements(user_id):
            return jsonify("You can't erase your account because you have pending reservations."), 400
        result = dao.deleteUser(user_id)
        if result:
            return jsonify("DELETED"), 200
        else:
            return jsonify("NOT FOUND"), 404

    def getAllDayUserSchedule(self, json):
        user_id = json['user_id']
        usday = json['usday']
        dao = UserDAO()
        timeslots = dao.getTimeSlot()
        occupiedTid = dao.getUserOccupiedTimeSlots(user_id, usday)

        for time in timeslots:
            if time['tid'] in occupiedTid:
                time['available'] = False

            if 'available' not in time:
                time['available'] = True

        return jsonify(timeslots)

    def getAllOccupiedUserSchedule(self, user_id):
        dao, tsDAO = UserDAO(), TimeSlotDAO()
        occupiedTidDict = dao.getAllOccupiedUserSchedule(user_id)
        for day, tids in occupiedTidDict.items():

            timeBlocks = self.getTimeBlocks(tids)

            for i in range(len(timeBlocks)):
                startTime = tsDAO.getTimeSlotByTimeSlotId(timeBlocks[i][0])
                endTime = tsDAO.getTimeSlotByTimeSlotId(timeBlocks[i][-1])
                timeBlocks[i] = [startTime[1], endTime[2]]

            occupiedTidDict[day] = timeBlocks

        return jsonify(occupiedTidDict)

    def checkRole(self, user_id):
        dao = UserDAO()
        return jsonify(dao.checkRole(user_id))

    def getRequestedIds(self, json):
        dao = UserDAO()
        usernames = json['memberNames']
        user_ids = []
        for username in usernames:
            user_id = dao.getuser_idbyUsername(username)
            if user_id != -1:
                user_ids.append(user_id)
        result = {"memberIds": user_ids}
        return jsonify(result)

    def getTimeBlocks(self, tids):
        tids.sort()
        timeBlocks, i, j = [], 0, 0

        while j < len(tids):
            if j == len(tids) - 1:
                timeBlocks.append(tids[i:j+1])
                break
            else:
                if tids[j + 1] - tids[j] > 1:
                    timeBlocks.append(tids[i:j+1])
                    j += 1
                    i = j
                else:
                    j += 1

        return timeBlocks