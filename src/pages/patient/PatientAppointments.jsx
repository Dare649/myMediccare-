import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "../../axios";
import ReactPaginate from "react-paginate";
import "./Paginate.css";


const PatientAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("today");
  const recordsPerPage = 5;

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        let response;
        if (filter === "today") {
          response = await axiosClient.get("/api/patient/get_appt/today");
        } else if (filter === "pending") {
          response = await axiosClient.get("/api/patient/get_appt/pending");
        } else if (filter === "upcoming") {
          response = await axiosClient.get("/api/patient/get_appt/upcoming");
        } else if (filter === "completed") {
          response = await axiosClient.get("/api/patient/get_appt/completed");
        }
        setAppointments(response.data?.data || []);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [filter]);

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = appointments.slice(firstIndex, lastIndex);

  const pageCount = Math.ceil(appointments.length / recordsPerPage); // Define pageCount here

  const handlePageClick = (data) => {
    setCurrentPage(data.selected + 1); // Update current page on pagination click
  };

  const prePage = () => {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const nextPage = () => {
    if (currentPage !== pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <section className="appointment w-full sm:mt-10 lg:mt-40 h-full lg:p-5 sm:p-0">
      <main className="lg:p-10 sm:p-2 bg-white rounded-lg w-full h-full">
        <div className="flex flex-row items-center justify-between lg:mt-0 sm:mt-10 w-full">
          <h2 className="first-letter:capitalize sm:text-xl lg:text-2xl font-semibold">
            Your Appointments
          </h2>
          <Link
            to={"/book-appointment"}
            className="text-white bg-primary-100 rounded-lg first-letter:capitalize font-bold text-center p-3"
          >
            Book Appointment
          </Link>
        </div>

       {/* Tabs for Today, Upcoming, Completed */}
        <div className="tabs flex space-x-4 my-4">
          <button
            onClick={() => setFilter("today")}
            className={`tab lg:text-lg sm:text-lg capitalize ${
              filter === "today" ? "text-primary-100 text-xl font-bold " : "font-bold text-lg neutral-50"
            }`}
          >
            today
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`tab lg:text-lg sm:text-lg capitalize ${
              filter === "pending" ? "text-primary-100 text-xl font-bold " : "font-bold text-lg neutral-50"
            }`}
          >
            pending
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`tab lg:text-lg sm:text-lg capitalize ${
              filter === "upcoming" ? "text-primary-100 text-xl font-bold " : "font-bold text-lg neutral-50"
            }`}
          >
            scheduled
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`tab lg:text-lg sm:text-lg capitalize ${
              filter === "completed" ? "text-primary-100 text-xl font-bold " : "font-bold text-lg neutral-50"
            }`}
          >
            completed
          </button>
        </div>

        <div className="search lg:w-60 sm:w-full mb-10 lg:mt-0 sm:mt-8">
          <input
            type="text"
            className="flex lg:hidden w-full border-2 text-lg font-semibold border-neutral-50 p-2 focus:border-primary-100 rounded-lg outline-none"
            placeholder="Search by doctor or status"
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {appointments.length === 0 ? (
          <div className="text-center text-lg font-semibold py-5">
            No appointment scheduled at the moment
          </div>
        ) : (
          <>
            {/* Desktop View */}
            <div className="hidden lg:flex">
              <div className="desktopView table-container w-full h-full overflow-auto">
                <table className="w-full h-full">
                  <tbody className="w-full">
                    {records
                      .filter((item) => {
                        return search.toLowerCase() === ""
                          ? item
                          : item.doctor_name.toLowerCase().includes(search) ||
                            item.appointment_status.toLowerCase().includes(search);
                      })
                      .map((item, id) => (
                        <tr
                          key={id}
                          className="w-full border-2 border-x-0 border-t-0 border-b border-neutral-50 hover:bg-primary-100/10 cursor-pointer sm:overflow-x-scroll"
                        >
                          <td className="flex flex-row items-center gap-x-2 py-5 text-lg font-medium capitalize">
                            <span>
                              <img
                                src={`https://api.example.com/doctor-images/${item.doctor_id}`}
                                alt={item.doctor_name}
                                className="h-10 w-10 rounded-full"
                              />
                            </span>
                            {item.doctor_name}
                          </td>
                          <td className="text-lg font-medium capitalize py-5 px-5">
                            {item.appointment_type}
                          </td>
                          <td className="text-lg font-medium capitalize py-5 px-5">
                            {item.appointment_date}
                          </td>
                          <td className="text-lg font-medium capitalize py-5 px-5">
                            {item.appointment_time}
                          </td>
                          <td
                            className={`text-lg font-medium capitalize py-5 px-5 ${
                              item.appointment_status === "Appointment Completed"
                                ? "text-green-500"
                                : "text-amber-500"
                            }`}
                          >
                            {item.appointment_status}
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

            {/* Mobile View */}
            <div className="lg:hidden flex flex-col w-full h-full space-y-4">
              {records
                .filter((item) => {
                  return search.toLowerCase() === ""
                    ? item
                    : item.doctor_name.toLowerCase().includes(search) ||
                      item.appointment_status.toLowerCase().includes(search);
                })
                .map((item, id) => (
                  <div
                    key={id}
                    className="w-full border-b-2 border-neutral-50 p-4 rounded-lg bg-white shadow hover:bg-primary-100/10 cursor-pointer"
                  >
                    <div className="flex flex-row justify-between items-center">
                      <div className="flex flex-row items-center space-x-3">
                        <img
                          src={`https://api.example.com/doctor-images/${item.doctor_id}`}
                          alt={item.doctor_name}
                          className="h-12 w-12 rounded-full"
                        />
                        <div className="text-md font-bold capitalize">
                          {item.doctor_name}
                        </div>
                      </div>
                      <div
                        className={`text-sm font-medium capitalize ${
                          item.appointment_status === "Appointment Completed"
                            ? "text-green-500"
                            : "text-amber-500"
                        }`}
                      >
                        {item.appointment_status}
                      </div>
                    </div>
                    <div className="flex flex-row justify-between items-center py-2">
                      <div className="text-md capitalize">
                        {item.appointment_type}
                      </div>
                      <div className="text-md">{item.appointment_date}</div>
                      <div className="text-md">{item.appointment_time}</div>
                    </div>
                  </div>
                ))}
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
          </>
        )}
      </main>
    </section>
  );
};

export default PatientAppointments;
