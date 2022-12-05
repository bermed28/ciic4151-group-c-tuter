import React, {useState} from "react";

export const AuthContext = React.createContext();
export const BookingContext = React.createContext();

function BookingContextProvider({ children }){

    const [bookingData, setBookingData] = useState({user: {} ,activity: "", faculty: "", department: "", course: "", tutor: "", userRole: ""});

    const updateBookingData = {
        user : (newUser) => {
            setBookingData(
                (prevState) => {
                    return {...prevState, user: newUser};
                }
            )
        },

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
        },

        userRole : (newRole) => {
            setBookingData(
                (prevState) => {
                    return {...prevState, userRole: newRole};
                }
            )
        },

        clear: () => {
            setBookingData(
                () => {
                    return {
                        activity: "",
                        faculty: "",
                        department: "",
                        course: "",
                        tutor: "",
                        userRole: ""
                    }
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

