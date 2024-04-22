import { useState } from "react";
import { CiSettings } from "react-icons/ci";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoMenu } from "react-icons/io5";
import picapp from "../assets/images/picapp.png";
import Modal from "../components/Modal";
import { NavLink, Link } from "react-router-dom";
import { navLink } from "./dummy";
import logo from "../assets/images/logo.png";

const TopBar = ({ onChange, placeholder}) => {
  const [visible, setVisible] = useState(false);

  // Toggle menu on small screen
  const handleVisible = () => {
    setVisible((prev) => !prev);
  };
  return (
    <div>
      <div className='desktopView hidden lg:flex w-[80%] fixed top-0 bg-white'>
        <div className='px-4 py-8 flex flex-row items-center justify-between w-full'>
          <div className="welcome ">
            <h2 className="text-3xl text-primary-100 font-bold">Welcome back, Praise</h2>
            <p className="first-letter:capitalize font-bold text-neutral-50">how are you doing today?</p>
          </div>
          {/* <div className="search w-60">
            <input 
              type="text" 
              placeholder={placeholder}
              onChange={onChange}
              className="w-full border-2 text-lg font-semibold border-neutral-50 p-2 focus:border-primary-100 rounded-lg outline-none"
            />
          </div> */}
          <div className="">
            <div className="flex flex-row items-center space-x-2">
              <Link to={"/patient-notifications"}>
              <IoMdNotificationsOutline size={30} className="font-bold text-neutral-50"/>
              </Link>
              <Link to={"/patient-settings"}>
              <CiSettings size={30} className="font-bold text-neutral-50"/>
              </Link>
              
              <img src={picapp} alt="MyMedicare" sizes="30"/>
            </div>
          </div>
        </div>
      </div>

      <div className="mobileView fixed top-0 flex lg:hidden w-full bg-white p-3">
        <div className="flex flex-row items-center justify-between w-full">
          <IoMenu onClick={handleVisible} size={30} className="text-primary-100"/>
          <div className="logo flex items-center text-md">
            <img src={logo} alt="MyMedicare" className="w-12" />
            <h2 className="text-md font-bold text-primary-100">MyMedicare</h2>
          </div>
          <div className="border-2 border-neutral-50 rounded-full">
            <img src={picapp} alt="MyMedicare" className="w-10"/>
          </div>
        </div>
        <div className="menu">
          {visible && (
            <Modal visible={visible}>
              <div className="fixed top-0 left-0 menuItem bg-white w-[70%] h-screen">
              <div className="welcome mx-5 mt-5">
                <h2 className="text-xl text-primary-100 font-bold">Welcome back, Praise</h2>
                <p className="first-letter:capitalize font-bold text-neutral-50">how are you doing today?</p>
              </div>
                <div className="navigation my-8 mx-5">
                  {navLink.map((item, id) => (
                    <div key={id} className={`py-2 border-b-2 border-primary-100 ${item.gap ? "mt-48" : ""}`}>
                      <NavLink
                        onClick={handleVisible}
                        to={item.path}
                        className="flex flex-row space-x-2 active:text-primary-100 text-neutral-50 capitalize text-lg font-medium hover:text-primary-100"
                      >
                        <p>{item.icon}</p>
                        <p>{item.title}</p>
                      </NavLink>
                    </div>
                  ))}
                </div>
              </div>
            </Modal>
          )}
        </div>
      </div>
    </div>
    
  )
}

export default TopBar
