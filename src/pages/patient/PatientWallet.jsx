import { useState, useEffect } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { PiCoins } from "react-icons/pi";
import { FaPoundSign } from "react-icons/fa";
import { PiEyeLight } from "react-icons/pi";
import { HiOutlineEyeSlash } from "react-icons/hi2";
import { axiosClient } from "../../axios";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
import { transactions } from "../../components/dummy";
import { FaUserDoctor, FaHouseChimneyMedical, FaSuitcaseMedical, FaPaperPlane } from "react-icons/fa6";
import "./Paginate.css";
import Modal from "../../components/Modal";
import FundModal from "../../patientModalPages/FundModal";


const PatientWallet = () => {
  const [showBalance, setShowBalance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [fund, setFund] = useState(false);
  const itemsPerPage = 5;

  const handleFund = () => {
    setFund((prev) => !prev);
  };

  const handleBalance = () => {
    setShowBalance((prev) => !prev);
  };

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const offset = currentPage * itemsPerPage;
  const currentItems = transactions.slice(offset, offset + itemsPerPage);
  const pageCount = Math.ceil(transactions.length / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get("/api/patient");
            setData(response?.data?.data);
        } catch (error) {
          setLoading(false);
          MySwal.fire({
            icon: "error",
            title: "Error",
            text: error?.response?.data?.message || "An error occurred",
          });
        }
    };

   

    fetchData();
}, []); // Empty dependency array ensures this runs once on mount

const formatAmountWithCommas = (amount) => {
  if (amount === undefined || amount === null || amount === "") {
    return ""; // Return an empty string if the amount is invalid
  }

  // Convert string to float if necessary
  if (typeof amount === "string") {
    amount = parseFloat(amount.replace(/,/g, ""));
  }

  // Check if the amount is a valid number
  if (isNaN(amount)) {
    return ""; // Return an empty string if the amount is NaN
  }

  // Use toLocaleString() to format the amount with commas
  return amount.toLocaleString();
};

  return (
    <section className="w-full h-screen lg:p-5 sm:px-2 sm:py-10 sm:mt-10 lg:mt-40">
      <div className="bg-white flex flex-row items-center justify-between rounded-lg w-full lg:my-8 sm:my-5 lg:px-5 sm:px-3 sm:py-2 lg:py-3">
        <h2 className="capitalize font-semibold lg:text-2xl sm:text-xl">Wallet</h2>
        <button onClick={handleFund} className="w-40 h-14 bg-primary-100 text-white rounded-lg">
          <h2 className="flex flex-row items-center gap-x-2 justify-center">
            <span><FiPlusCircle size={25} /></span>
            <span className="first-letter:capitalize lg:text-xl sm:text-md font-semibold">Add Money</span>
          </h2>
        </button>
      </div>

      {fund && (
        <Modal visible={fund} onClick={handleFund}>
          <FundModal handleClose={handleFund} />
        </Modal>
      )}

      <div className="bg-white border-2 border-neutral-50 rounded-lg w-full lg:my-8 sm:my-5">
        <div className="flex flex-row items-center justify-between lg:px-5 sm:px-3 sm:py-2 lg:py-3">
          <h2 className="capitalize font-semibold lg:text-2xl sm:text-lg">Wallet Balance</h2>
          <PiCoins size={30} />
        </div>
        <hr className="w-full bg-neutral-50" />
        <div className="my-5">
          <div className="w-full flex flex-row items-center justify-between lg:px-5 sm:px-3">
            <div className="flex flex-row items-center">
              <FaPoundSign size={20} />
              <h2 className="lg:text-2xl sm:text-xl font-bold">
                {showBalance ? formatAmountWithCommas(data?.balance) : "xxxx"}
              </h2>
              <span onClick={handleBalance} className="cursor-pointer font-bold sm:ml-2">
                {showBalance ? <HiOutlineEyeSlash size={20} /> : <PiEyeLight size={20} />}
              </span>
            </div>
            <p className="capitalize font-semibold lg:text-md sm:text-sm">Nigerian Naira</p>
          </div>
          <p className="text-neutral-50 font-semibold capitalize lg:px-5 sm:px-3">December 12, 2024</p>
        </div>
      </div>

      <div className="table w-full">
        <div className="mobileView flex lg:hidden">
          <div>
            <div className="flex flex-row items-center justify-between">
              <h2 className="text-lg font-semibold first-letter:capitalize">Recent Transactions</h2>
              <Link className="first-letter:capitalize text-neutral-50 text-lg">See All</Link>
            </div>
            <div className="bg-white rounded-lg w-full my-5 py-3 px-2">
              {currentItems.map((item, id) => (
                <div key={id} className="w-full flex flex-row items-center justify-between py-3 border-b-2 border-neutral-50">
                  <div className="flex flex-row items-center gap-x-2">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-neutral-1">
                      {item.type === "sample collection" ? (
                        <FaSuitcaseMedical />
                      ) : item.type === "appointment" ? (
                        <FaUserDoctor />
                      ) : item.type === "refund" ? (
                        <FaHouseChimneyMedical />
                      ) : (
                        <FaPaperPlane className="rotate-90" />
                      )}
                    </div>
                    <div>
                      <h2 className="flex flex-row font-medium capitalize gap-x-1">
                        <span className="text-xs">{item.status}</span>
                        <span className="text-xs">{item.type}</span>
                      </h2>
                      <h3 className="text-xs font-semibold capitalize">{item.date}</h3>
                    </div>
                  </div>
                  <h2 className="flex flex-row items-center font-bold text-md">
                    <FaPoundSign size={20} />
                    <span>{formatAmountWithCommas(item.amount)}</span>
                  </h2>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="desktopView hidden lg:flex w-full">
          <div className="w-full bg-white rounded-lg my-5 p-5">
            <table className="w-full">
              <thead className="capitalize text-2xl w-full mb-3">
                <tr className="text-left">
                  <th className="px-6">Date</th>
                  <th className="px-6">Type</th>
                  <th className="px-6">Status</th>
                  <th className="px-6">Amount</th>
                </tr>
              </thead>
              <tbody className="capitalize font-normal text-lg">
                {currentItems.map((item, id) => (
                  <tr key={id} className="border-b-2 border-neutral-50">
                    <td className="py-2 px-6">{item.date}</td>
                    <td className="py-2 px-6">{item.type}</td>
                    <td className="py-2 px-6">{item.status}</td>
                    <td className="py-2 px-6 flex flex-row items-center gap-x-2">
                      <FaPoundSign size={20} />
                      <span>{formatAmountWithCommas(item.amount)}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="paginate flex items-end justify-end py-5">
              <ReactPaginate
                breakLabel="..."
                previousLabel={"Prev"}
                nextLabel={"Next"}
                pageCount={pageCount}
                marginPagesDisplayed={2}
                pageRangeDisplayed={2}
                onPageChange={handlePageClick}
                containerClassName={"pagination"}
                pageClassName={"page-item"}
                pageLinkClassName={"page-link"}
                previousClassName={"page-item"}
                previousLinkClassName={"page-link"}
                nextClassName={"page-item"}
                nextLinkClassName={"page-link"}
                breakClassName={"page-item"}
                breakLinkClassName={"page-link"}
                activeClassName={"active"}
              />
            </div>
          </div>
          
        </div>
        
      </div>
    </section>
  );
};

export default PatientWallet;
