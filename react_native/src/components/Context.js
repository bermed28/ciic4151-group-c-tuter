import React, {useState} from "react";

export const AuthContext = React.createContext();
export const BookingContext = React.createContext();

function BookingContextProvider({ children }){

    const [bookingData, setBookingData] = useState({activity: "", faculty: "", department: "", course: "", tutor: ""});

    const updateBookingData = {
        activity : (newActivity) => {
            setBookingData(
                (prevState) => {
                    return {...prevState, activity: newActivity};
                }
            )
        },

        faculty : (newFaculty) => {
            setBookingData(
                (prevState) => {
                    return {...prevState, faculty: newFaculty};
                }
            )
        },

        department : (newDepartment) => {
            setBookingData(
                (prevState) => {
                    return {...prevState, department: newDepartment};
                }
            )
        },

        course : (newCourse) => {
            setBookingData(
                (prevState) => {
                    return {...prevState, course: newCourse};
                }
            )
        },

        tutor : (newTutor) => {
            setBookingData(
                (prevState) => {
                    return {...prevState, tutor: newTutor};
                }
            )
        }
    }
    return (
        <BookingContext.Provider value={{bookingData, updateBookingData}}>
            { children }
        </BookingContext.Provider>
    );
}

export default BookingContextProvider;

