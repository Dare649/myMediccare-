import { useState, useEffect, useRef } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useLocation, Link } from "react-router-dom";
import med3 from "../../../../public/images/med3.png";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import logo from "../../../assets/images/logo.png";
import { FaLongArrowAltLeft } from "react-icons/fa";

const PrescriptionList = () => {
  const MySwal = withReactContent(Swal);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const { prescription } = location.state || {};
  const downloadContainerRef = useRef(null);
  

  useEffect(() => {
    if (!prescription) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    }
  }, [prescription]);


  const handleDownloadPrescription = async () => {
    const downloadContainer = downloadContainerRef.current;
    if (downloadContainer) {
      setLoading(true); // Show loading indicator while generating the PDF
  
      // Make the container visible for rendering
      downloadContainer.style.display = "block";
  
      try {
        // Add a slight delay to ensure all elements are fully rendered
        await new Promise((resolve) => setTimeout(resolve, 500));
  
        // Capture the container with html2canvas
        const canvas = await html2canvas(downloadContainer, {
          scale: 2, // Increase scale for better quality
          useCORS: true, // Enable cross-origin resource sharing to avoid tainted canvas errors
          allowTaint: true,
        });
  
        const imgData = canvas.toDataURL("image/png");
  
        const pdf = new jsPDF();
        pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
        pdf.save("prescription.pdf");
      } catch (error) {
        console.error("Failed to generate PDF:", error);
        MySwal.fire({
          title: "Error",
          text: "Failed to generate the PDF. Please try again.",
          icon: "error",
        });
      } finally {
        setLoading(false); // Hide loading indicator after generating the PDF
        downloadContainer.style.display = "none"; // Hide the container again
      }
    }
  };
  
  

  return (
    <section className="monitoring sm:mt-10 lg:mt-40 w-full h-full lg:p-5 sm:p-2">
      <div className="w-full bg-white lg:p-10 sm:p-5">
      <Link to={"/patient-medications"} className="my-5 font-bold text-primary-100">
        <FaLongArrowAltLeft size={30}/>
      </Link>
        <h2 className="lg:text-2xl sm:text-lg font-bold capitalize lg:py-5 sm:py-2">
          {prescription?.diagnosis || "Loading Prescription..."}
        </h2>
        <div className="w-full bg-neutral-200">
          <div className="w-full bg-neutral-50 p-3 flex flex-row items-center justify-between rounded-lg">
            <div>
              <h2 className="capitalize font-bold lg:text-xl sm:text-md">
                dr. {prescription?.doctor_name || "Loading..."}
              </h2>
              
              <h3 className="mt-4 capitalize font-bold lg:text-lg sm:text-sm">
                {prescription?.prefix || ""}
              </h3>
            </div>
          </div>

          {loading ? (
            <Backdrop
              sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
              open={loading}
            >
              <CircularProgress color="inherit" />
            </Backdrop>
          ) : prescription?.prescription_items && prescription.prescription_items.length > 0 ? (
            prescription.prescription_items.map((item, id) => (
              <div key={id} className="p-5 border-b border-gray-200 w-full">
                <div className="flex flex-row items-center gap-x-2">
                  <img src={med3} alt="" className="lg:w-[5%] sm:w-[20%]" />
                  <h2 className="text-black font-bold lg:text-xl sm:text-sm capitalize">
                    {item.drug_name}
                  </h2>
                </div>
                <div className="ml-16 mt-3">
                  <p className="capitalize">
                    <strong>Dosage:</strong> {item.dose} {item.dose_unit}
                  </p>
                  <p className="capitalize">
                    <strong>Frequency:</strong> {item.frequency}
                  </p>
                  <p className="capitalize">
                    <strong>Duration:</strong> {item.duration} {item.duration_unit}
                  </p>
                  <p className="capitalize">
                    <strong>Route:</strong> {item.route_of_administration}
                  </p>
                  {item.instructions && (
                    <p>
                      <strong>Instructions:</strong> {item.instructions}
                    </p>
                  )}
                  <p className="capitalize">
                    <strong>Refill:</strong> {item.refill}
                  </p>
                  {item.reminder_time && item.reminder_time.length > 0 && (
                    <div>
                      <p className="capitalize">
                        <strong>Reminder Time:</strong>
                      </p>
                      {item.reminder_time.map((reminder, index) => (
                        <p key={index} className="text-gray-500 grid lg:grid-cols-3 sm:grid-cols-2">
                          {reminder.reminder_time}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-primary-100 font-bold text-center">
              No prescriptions available at the moment.
            </p>
          )}

          {/* Prescription Table */}
          <div 
            ref={downloadContainerRef} 
            className="lg:p-10 sm:p-5"
            style={{ display: "none" }}
          >
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-col items-center justify-center my-5">
                <img src={logo} alt="MyMedicare" className="w-[70%]" />
                <h4 className="text-md font-bold text-primary-100">MyMedicare</h4>
              </div>
              <h2 className="text-2xl font-bold capitalize">prescription note</h2>
            </div>
            <hr className="w-full bg-neutral-100" />
            <div className="w-full my-5">
              <h2 className="lg:text-2xl sm:text-lg font-bold capitalize">
                dr. {prescription?.doctor_name}
              </h2>
            </div>
            <table className="my-8 w-full">
              <thead className="capitalize font-bold sm:text-md lg:text-xl text-left text-2xl">
                <th className="py-5">medication</th>
                <th className="py-5">form</th>
                <th className="py-5">frequency</th>
                <th className="py-5">duration</th>
              </thead>
              <tbody className="w-full ">
                {prescription?.prescription_items?.map((item, index) => (
                  <tr key={index} className="border-y-2 border-neutral-100 odd:bg-white text-lg">
                    <td className="py-5 capitalize ">
                      {item.drug_name}
                    </td>
                    <td className="py-5 capitalize ">
                     {item.dose} {item.dose_unit}
                    </td>
                    <td className="py-5 capitalize ">
                      {item.frequency}
                    </td>
                    <td className="py-5 capitalize ">
                      {item.duration} {item.duration_unit}
                    </td>
           
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="py-10">
              <h2 className="capitalize text-xl">prescriber: <span className="text-primary-100 font-bold">dr. {prescription?.doctor_name}</span></h2>
            </div>
          </div>

          <div className="p-5">
            <div className="py-3">
              <p className="text-md capitalize font-medium text-primary-100">signed by</p>
              <h2 className="capitalize font-bold lg:text-xl sm:text-md ">
                dr. {prescription?.doctor_name}
              </h2>
            </div>
            <button
              onClick={handleDownloadPrescription}
              className="sm:w-full lg:w-[50%] flex flex-col items-center justify-center mx-auto rounded-lg bg-primary-100 hover:bg-transparent text-white hover:text-primary-100 hover:border-2 hover:border-primary-100 py-5 font-bold lg:text-xl sm:text-md capitalize"
            >
              download
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrescriptionList;
