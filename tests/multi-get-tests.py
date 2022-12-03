import time

import pytest
import threading
import requests

ciic_courses = [
    {
        "course_code": "CIIC3015",
        "course_id": 1673,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Introduction to Computer Programming I"
    },
    {
        "course_code": "CIIC3075",
        "course_id": 1674,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Fundamentals of Computing"
    },
    {
        "course_code": "CIIC3081",
        "course_id": 1675,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Computer Architecture I"
    },
    {
        "course_code": "CIIC4010",
        "course_id": 1676,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Advanced Programming"
    },
    {
        "course_code": "CIIC4025",
        "course_id": 1677,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Analysis and Design of Algorithms"
    },
    {
        "course_code": "CIIC4030",
        "course_id": 1678,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Programming Languages"
    },
    {
        "course_code": "CIIC4050",
        "course_id": 1679,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Operating Systems"
    },
    {
        "course_code": "CIIC4060",
        "course_id": 1680,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Database Systems"
    },
    {
        "course_code": "CIIC4070",
        "course_id": 1681,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Computer Networks"
    },
    {
        "course_code": "CIIC4082",
        "course_id": 1682,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Computer Architecture II"
    },
    {
        "course_code": "CIIC4151",
        "course_id": 1683,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Senior Design Project"
    },
    {
        "course_code": "CIIC4995",
        "course_id": 1684,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Engineering Practice for Coop Students"
    },
    {
        "course_code": "CIIC4998",
        "course_id": 1685,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Undergraduate Research"
    },
    {
        "course_code": "CIIC5015",
        "course_id": 1686,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Artificial Intelligence"
    },
    {
        "course_code": "CIIC5017",
        "course_id": 1687,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Operating System and Network Administration and Security"
    },
    {
        "course_code": "CIIC5018",
        "course_id": 1688,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Cryptography and Network Security"
    },
    {
        "course_code": "CIIC5019",
        "course_id": 1689,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "High Performance Computing"
    },
    {
        "course_code": "CIIC5029",
        "course_id": 1690,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Compilers Development"
    },
    {
        "course_code": "CIIC5045",
        "course_id": 1691,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Automata and Formal Languages"
    },
    {
        "course_code": "CIIC5110",
        "course_id": 1692,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Bioinformatics Algorithms"
    },
    {
        "course_code": "CIIC5120",
        "course_id": 1693,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Virtual Machines"
    },
    {
        "course_code": "CIIC5130",
        "course_id": 1694,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Cloud Computing Infrastructures"
    },
    {
        "course_code": "CIIC5140",
        "course_id": 1695,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Big Data Analytics"
    },
    {
        "course_code": "CIIC5995",
        "course_id": 1696,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Selected Topics"
    },
    {
        "course_code": "CIIC4020",
        "course_id": 1,
        "department": "CIIC",
        "faculty": "Engineering",
        "name": "Data Structures"
    },
    {
        "course_code": "CIIC1234",
        "course_id": 2010,
        "department": "CIIC",
        "faculty": "Behavioral",
        "name": "CIIC Behavioral Interview"
    },
    {
        "course_code": "CIIC5678",
        "course_id": 2011,
        "department": "CIIC",
        "faculty": "Technical",
        "name": "CIIC Technical Interview"
    },
    {
        "course_code": "CIIC2222",
        "course_id": 2012,
        "department": "CIIC",
        "faculty": "Resume",
        "name": "CIIC Resume Verification"
    },
    {
        "course_code": "CIIC1111",
        "course_id": 2013,
        "department": "CIIC",
        "faculty": "Writing",
        "name": "CIIC Writing Help"
    }
]

tutor_info_to_get = {
    "balance": "0",
    "department": "CIIC",
    "description": "I have approximate knowledge of many things",
    "email": "chris36021@gmail.com",
    "hourly_rate": "10",
    "name": "Chris Castillo",
    "password": "pbkdf2:sha256:260000$xc4xIdyOAkRSjcMX$db57319660a9e66e1e34f04bb9d2f9ceeb2188a925013fbed2d80790c37ea880",
    "user_id": 94,
    "user_rating": "5.0000000000000000",
    "user_role": "Student",
    "username": "chris36021"
}

session_3_members = {
    "members": [
        "chris36021",
        "sangio"
    ]
}

expected_result1 = []
actual_result1 = []
expected_result2 = []
actual_result2 = []
expected_result3 = []
actual_result3 = []
time_stamps1 = []
time_stamps2 = []
time_stamps3 = []


def func1(dept: str):
    json_dict = {"department": dept}
    start = time.time()
    temp = requests.post("https://tuter-app.herokuapp.com/tuter/course-departments/", json=json_dict)
    end = time.time()
    time_stamps1.append(end - start)
    actual_result1.append(temp.json())
    return


def test_1(num_of_threads=10, dept="CIIC"):
    threads = []
    for i in range(0, num_of_threads):
        threads.append(threading.Thread(target=func1, args=(dept,)))
        expected_result1.append(ciic_courses)
    for i in range(0, num_of_threads):
        print(f"Starting thread {i}")
        threads[i].start()
    for i in range(0, num_of_threads):
        print(f"Closing thread thread {i}")
        threads[i].join()
    assert expected_result1 == actual_result1


def func2():
    start = time.time()
    response = requests.get("https://tuter-app.herokuapp.com/tuter/users/94")
    end = time.time()
    time_stamps2.append(end - start)
    resp_json = response.json()
    actual_result2.append(resp_json)
    return


def test_2(num_of_threads=10):
    threads = []
    for i in range(num_of_threads):
        threads.append(threading.Thread(target=func2))
        expected_result2.append(tutor_info_to_get)
    for i in range(num_of_threads):
        print(f"Starting thread {i}")
        threads[i].start()
    for i in range(num_of_threads):
        print(f"Closing thread thread {i}")
        threads[i].join()
    assert expected_result2 == actual_result2


def func3():
    start = time.time()
    response = requests.get("https://tuter-app.herokuapp.com/tuter/tutoring-session-members/3")
    end = time.time()
    time_stamps3.append(end - start)
    resp_json = response.json()
    actual_result3.append(resp_json)
    return


def test_3(num_of_threads=10):
    threads = []
    for i in range(num_of_threads):
        threads.append(threading.Thread(target=func3))
        expected_result3.append(session_3_members)
    for i in range(num_of_threads):
        print(f"Starting thread {i}")
        threads[i].start()
    for i in range(num_of_threads):
        print(f"Closing thread thread {i}")
        threads[i].join()
    assert expected_result3 == actual_result3


test_1()
test_2()
test_3()

def get_avg_time(time_stamps: [float]):
    sum = 0
    for time in time_stamps:
        sum += time
    return sum/len(time_stamps)

print(time_stamps1)
print("The average time taken per request in the %s request is: %s seconds." % ("first", str(get_avg_time(time_stamps1))))
print(time_stamps2)
print("The average time taken per request in the %s request is: %s seconds." % ("second", str(get_avg_time(time_stamps2))))
print(time_stamps3)
print("The average time taken per request in the %s request is: %s seconds." % ("third", str(get_avg_time(time_stamps3))))
