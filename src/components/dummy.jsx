import { LuLayoutDashboard } from "react-icons/lu";
import { MdOutlineCalendarMonth, MdOutlineFindInPage } from "react-icons/md";
import { GiMedicines } from "react-icons/gi";
import { CiWallet, CiSettings } from "react-icons/ci";
import { PiProjectorScreenChartThin } from "react-icons/pi";
import { IoHelpCircleOutline, IoLogOutOutline } from "react-icons/io5";
import app from "../assets/images/picapp.png";

export const navLink = [
    {
        title: "dashboard",
        icon: <LuLayoutDashboard size={30}/>,
        path: "/patient-dashboard"
    },
    {
        title: "appointments",
        icon: <MdOutlineCalendarMonth size={30}/>,
        path: "/patient-appointments"
    },
    {
        title: "prescriptions",
        icon: <GiMedicines size={30}/>,
        path: "/patient-prescription"
    },
    {
        title: "wallet",
        icon: <CiWallet size={30}/>,
        path: "/patient-wallet"
    },
    {
        title: "monitoring",
        icon: <PiProjectorScreenChartThin size={30}/>,
        path: "/patient-monitoring"
    },
    {
        title: "investigations",
        icon: <MdOutlineFindInPage size={30}/>,
        path: "/patient-investigations"
    },
    {
        title: "settings",
        icon: <CiSettings size={30}/>,
        path: "/patient-settings",
        gap: true
    },
    {
        title: "help center",
        icon: <IoHelpCircleOutline size={30}/>,
        path: "/help-center"
    },
    {
        title: "sign out",
        icon: <IoLogOutOutline size={30}/>,
        gap1: true
    },
]

export const aerialCode = [
    {
        code: "+234"
    },
    {
        code: "+244"
    },
    {
        code: "+240"
    },
    {
        code: "+233"
    },
    {
        code: "+230"
    },
    {
        code: "+242"
    },
    {
        code: "+225"
    },
    {
        code: "+224"
    },
]

export const country =[
    {
        country: "nigeria",
        time: "(GMT + 1:00)",
        flag: ""
    },
    {
        country: "ghana",
        time: "(GMT + 2:00)",
        flag: ""
    },
    {
        country: "kenya",
        time: "(GMT + 3:00)",
        flag: ""
    },
    {
        country: "egypt",
        time: "(GMT + 5:00)",
        flag: ""
    },
    {
        country: "togo",
        time: "(GMT + 4:00)",
        flag: ""
    }
]

export const appointments = [
    {
        img: app,
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        time: "9am",
        date: "11th Aug, 2022",
        status: "pending"
    },
    {
        img: app,
        doctor: "dr. praise martin",
        speciality: "gynecologist",
        time: "12pm",
        date: "11th Aug, 2022",
        status: "done"
    },
    {
        img: app,
        doctor: "dr. chukwuka martin",
        speciality: "neurologist",
        time: "10am",
        date: "11th Aug, 2022",
        status: "done"
    },
    {
        img: app,
        doctor: "dr. kamsy martin",
        speciality: "general surgeon",
        time: "1pm",
        date: "11th Aug, 2022",
        status: "pending"
    },
    {
        img: app,
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        time: "9am",
        date: "11th Aug, 2022",
        status: "pending"
    },
    {
        img: app,
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        time: "9am",
        date: "11th Aug, 2022",
        status: "done"
    },
    {
        img: app,
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        time: "9am",
        date: "11th Aug, 2022",
        status: "done"
    },
]

export const prescriptions = [
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
    {
        title: "pneumonia prescription.pdf",
        doctor: "dr. osueze martin",
        speciality: "general surgeon",
        downloadSize: "2MB",
        med: "amlodipine",
        times: "once a day",
        dateTime: "Fri, 11th Aug, 2023",
        sign: "DFE"
        
    },
]

export const graphDetails = [
    {
        title: "weight",
        result: [75, 81, 105, 55, 42, 120, 69],
        backgroundColor: "#0058E6"
    },
    {
        title: "blood sugar",
        result: [50, 81, 70, 120, 140, 100, 61],
        backgroundColor: "#94A3BB"
    },
    {
        title: "blood pressure",
        result: [200, 150, 110, 90, 130, 115, 80],
        backgroundColor: "#0058E6"
    },
    {
        title: "food log",
        result: [75, 81, 105, 55, 42, 120, 69],
        backgroundColor: "#94A3BB"
    }
]

export const profile = [
    {
        firstName: "john",
        lastName: "doe",
        email: "johndoe@gmail.com",
        country: "nigeria",
        countryWithCode: 'nigeria (GMT + 1:00)',
        address: "2 london street VI, lagos",
        countryCode: "+234",
        gender: "male",
        dob: "10-12-1996",
        weight: "140kg",
        height: "6.1",
        specialNeeds: "none",
        allergies: "alergic to bitter cola",
        chronicDisease: "none",
        nextFullName: "tom johns",
        relationship: "cousin",
        nextEmail: "tomjohns@gmail.com",
        nextAddress: "2 banana empire street, lagos",
        state: "lagos",
        img: app
    }
]