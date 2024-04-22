import { useState } from "react";
import { appointments } from "../../components/dummy";
import Modal from "../../components/Modal";
import AppointmentBooking from "../../patientModalPages/AppointmentBooking";

const PatientAppointments = () => {
    const [search, setSearch] = useState("");
    const [visible, setVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 5;
    const lastIndex = currentPage * recordsPerPage;
    const firstIndex = lastIndex - recordsPerPage;
    const records = appointments.slice(firstIndex, lastIndex);
    const npage = Math.ceil(appointments.length / recordsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);

    // handle previous page of the table
    const prePage = () => {
        if (currentPage !== 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    //handles current page 
    const changeCPage = (id) => {
        setCurrentPage(id);
    };

    //handles next page
    const nextPage = () => {
        if (currentPage !== npage) {
            setCurrentPage(currentPage + 1);
        }
    };

    // handle modal
    const handleVisible = () => {
        setVisible((prev) => !prev);
    };

  return (
    <section className="appointment w-full h-full lg:p-5 sm:p-0">
      <main className="lg:p-10 sm:p-2 bg-white rounded-lg w-full h-full">
        <div className="flex lg:flex-row sm:flex-col gap-y-5 items-center justify-between lg:mt-0 sm:mt-10 w-full">
          <h2 className="first-letter:capitalize text-2xl font-semibold">your appointments</h2>
          <button onClick={handleVisible} className="text-white bg-primary-100 rounded-lg lg:w-40 sm:w-full h-14 first-letter:capitalize font-bold">book appointment</button>
        </div>
        {visible && (
          <Modal visible={visible} onClose={handleVisible}>
            <AppointmentBooking handleCancel={handleVisible} handleClose={handleVisible} />
          </Modal>
        )}
        <div className="search lg:w-60 sm:w-full mb-10 lg:mt-0 sm:mt-8">
          <input
              type="text"
              className="flex lg:hidden w-full border-2 text-lg font-semibold border-neutral-50 p-2 focus:border-primary-100 rounded-lg outline-none"
              placeholder="Search by status"
              onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="table-container w-full h-full overflow-auto ">
          <table className="w-full h-full">
            <tbody className="w-full">
              {records
                  .filter((item) => {
                    return search.toLocaleLowerCase() === ""
                      ? item
                      : item.status.toLocaleLowerCase().includes(search);
                  })
                  .map((item, id) => (
                      <tr key={id} className="w-full border-2 border-x-0 border-t-0 border-b border-neutral-50 hover:bg-primary-100/10 cursor-pointer sm:overflow-x-scroll">
                          <td className="py-5 text-lg font-medium capitalize">{item.doctor}</td>
                          <td className="text-lg font-medium capitalize  py-5 px-5">{item.speciality}</td>
                          <td className="text-lg font-medium capitalize  py-5 px-5">{item.date}</td>
                          <td className="text-lg font-medium capitalize  py-5 px-5">{item.time}</td>
                          <td className={`text-lg font-medium capitalize py-5 px-5  ${item.status === "done" ? "text-green-500" : "text-amber-500"}`}>{item.status}</td>
                      </tr>
                  ))}
            </tbody>
          </table>
          <div className="w-48 my-10 sm:flex sm:float-right">
            <nav className="pagination border-2 w-full border-neutral-50 rounded-lg px-1">
              <ul className="paginatioItem flex flex-row items-center space-x-3 w-full py-1 duration-300 cursor-pointer font-bold">
                <li className="hover:bg-primary-100 hover:text-white rounded-md px-3 py-1 duration-300 capitalize font-medium">
                  <a href="#" onClick={prePage}>prev</a>
                </li>
                <li className="hover:bg-primary-100 hover:text-white rounded-md px-3 py-1 duration-300 capitalize font-medium">
                  <a href="#" onClick={nextPage}>next page</a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </main>
    </section>
  );
};

export default PatientAppointments;
