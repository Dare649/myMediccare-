import { useState } from "react";
import { days } from "../../../components/dummy"; // Should contain "Monday", "Tuesday", etc.
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { axiosClient } from "../../../axios";
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css'; // Include styles

const Schedule = () => {
    const [loading, setLoading] = useState(false);
    const MySwal = withReactContent(Swal);
    const [schedules, setSchedules] = useState(
        days.map(day => ({
            day_of_week: day,
            start_time: "",
            end_time: "",
            availability: "Not Available" // Default state for availability
        }))
    );

    const isValidTimeFormat = (time) => {
        const timeFormat = /^([01]\d|2[0-3]):([0-5]\d)$/; // 24-hour format regex
        return timeFormat.test(time);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate time format and check for empty inputs
        for (const schedule of schedules) {
            if (schedule.availability === "Available") {
                if (!isValidTimeFormat(schedule.start_time) || !isValidTimeFormat(schedule.end_time)) {
                    MySwal.fire({
                        text: "Please ensure all times are in the 24-hour format (HH:mm).",
                        icon: "warning",
                        title: "Invalid Time Format"
                    });
                    return;
                }
                if (!schedule.start_time || !schedule.end_time) {
                    MySwal.fire({
                        text: "Please enter both start and end times for all available days.",
                        icon: "warning",
                        title: "Missing Time Input"
                    });
                    return;
                }
            }
        }

        // Filter out schedules that are not available
        const availableSchedules = schedules
            .filter(schedule => schedule.availability === "Available")
            .map(schedule => ({
                day_of_week: schedule.day_of_week.charAt(0).toUpperCase() + schedule.day_of_week.slice(1).toLowerCase(),
                start_time: schedule.start_time,
                end_time: schedule.end_time
            }));

        if (availableSchedules.length === 0) {
            MySwal.fire({
                text: "Please set at least one day as available with a start and end time.",
                icon: "warning",
                title: "Warning"
            });
            return;
        }

        try {
            setLoading(true);
            const response = await axiosClient.post("/api/doctor/update_schedule", { schedules: availableSchedules });
            setLoading(false);
            MySwal.fire({
                text: response?.data?.message,
                icon: "success",
                title: "Success"
            });
        } catch (error) {
            setLoading(false);
            MySwal.fire({
                text: error?.response?.data?.message,
                icon: "error",
                title: "Error"
            });
        }
    };

    const handleScheduleChange = (index, name, value) => {
        const updatedSchedules = [...schedules];
        updatedSchedules[index] = {
            ...updatedSchedules[index],
            [name]: value
        };
        setSchedules(updatedSchedules);
    };

    return (
        <section className="sm:w-full lg:w-[50%] flex flex-col items-center justify-center m-auto">
            <div className="w-full border-2 rounded-lg border-primary-100 sm:p-2 lg:p-5">
                <form onSubmit={handleSubmit} className="w-full">
                    {schedules.map((schedule, index) => (
                        <div key={index} className="w-full my-3">
                            <h2 className="font-bold capitalize text-neutral-100 mb-2">{schedule.day_of_week}</h2>
                            <div className="w-full my-3">
                                <select
                                    name="availability"
                                    className="outline-none border-2 border-neutral-50 focus:border-primary-100 px-3 py-2 w-full rounded-md capitalize"
                                    onChange={(e) => handleScheduleChange(index, 'availability', e.target.value)}
                                    value={schedule.availability}
                                >
                                    <option value="Not Available">Not Available</option>
                                    <option value="Available">Available</option>
                                </select>
                            </div>
                            {schedule.availability === "Available" && (
                                <>
                                    <div className="w-full my-3">
                                        <h2 className="font-bold capitalize text-neutral-100 mb-2">Start Time</h2>
                                        <TimePicker
                                            onChange={(value) => handleScheduleChange(index, 'start_time', value)}
                                            value={schedule.start_time}
                                            disableClock={true}
                                            format="HH:mm" // 24-hour format
                                            className="outline-none border-2 border-neutral-50 focus:border-primary-100 px-3 py-2 w-full rounded-md capitalize"
                                        />
                                    </div>
                                    <div className="w-full my-3">
                                        <h2 className="font-bold capitalize text-neutral-100 mb-2">End Time</h2>
                                        <TimePicker
                                            onChange={(value) => handleScheduleChange(index, 'end_time', value)}
                                            value={schedule.end_time}
                                            disableClock={true}
                                            format="HH:mm" // 24-hour format
                                            className="outline-none border-2 border-neutral-50 focus:border-primary-100 px-3 py-2 w-full rounded-md capitalize"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    ))}

                    <div className="w-full my-5">
                        <button
                            type="submit"
                            disabled={loading}
                            className="capitalize font-bold text-center bg-primary-100 w-full py-4 text-white rounded-lg"
                        >
                            {loading ? "Loading..." : "Update Work Schedule"}
                        </button>
                    </div>
                </form>
            </div>
            <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
                <CircularProgress color="inherit" />
            </Backdrop>
        </section>
    );
};

export default Schedule;
