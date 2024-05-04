import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { IoMdClose } from "react-icons/io";
import { LuActivitySquare } from "react-icons/lu";

const Weight = ({handleCancel, handleClose}) => {
    const [post, setPost] = useState([]);
    const formik = useFormik({
        initialValues: {
            date: "",
            weight: ""
        },

        validationSchema: Yup.object({
            date: Yup.string()
            .required("Required"),
            weight: Yup.string()
            .required("Required")
        })
    })
  return (
    <div className="lg:w-[50%] sm:w-full bg-white rounded-lg">
        <div className="w-full shadow-xl p-5">
            <div className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                    <LuActivitySquare size={30}/>
                    <div>
                        <h1 className="font-bold capitalize text-3xl ">weight values</h1>
                        <p className="mt-2 first-letter:capitalize font-semibold text-neutral-50">help us monitor your vitals.</p>
                    </div>
                </div>
                <IoMdClose size={25} onClick={handleClose} className="cursor-pointer  font-bold"/>
            </div>
        </div>
        <form onSubmit={formik.handleSubmit} className="p-5">
            <div className="date mb-4">
                <div className="flex flex-row items-center justify-between w-full">
                    <label className="capitalize font-bold text-lg">date</label>
                    {
                        formik.touched.date && formik.errors.date ? <p className="text-red-500 text-sm font-bold">{formik.errors.date}</p>: null
                    }
                </div>
                <div className="mt-3">
                    <input 
                        type="date"
                        className="outline-none border-2 border-neutral-50 focus:border-primary-100 px-3 py-2 w-full rounded-md"
                        id = "date"
                        value = {formik.values.date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
            </div>

            <div className="weight mb-4">
                <div className="flex flex-row items-center justify-between w-full">
                    <label className="capitalize font-bold text-lg">weight</label>
                    {
                        formik.touched.weight && formik.errors.weight ? <p className="text-red-500 text-sm font-bold">{formik.errors.weight}</p>: null
                    }
                </div>
                <div className="mt-3">
                    <input 
                        type="text"
                        className="outline-none border-2 border-neutral-50 focus:border-primary-100 px-3 py-2 w-full rounded-md"
                        placeholder="E.g 100 Kg"
                        id = "weight"
                        value = {formik.values.weight}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                </div>
            </div>

            
            
            <div className="flex lg:flex-row sm:flex-col items-center gap-2 w-full">
                <div 
                    onClick={handleCancel}
                    className="cancelAppointment w-full text-center my-2">
                <button className="font-bold capitalize text-lg outline-none border-2 border-primary-100 active:bg-primary-100 bg-transparent hover:bg-primary-100 rounded-lg text-primary-100 hover:text-white w-full   active:bg-transparent active:text-primary-100 active:border-primary-100 h-16">
                    cancel
                </button>
                </div>
                <div className="bookAppointment w-full text-center my-2">
                <button className="font-bold capitalize text-lg outline-none hover:border-2 active:border-2 bg-primary-100 rounded-lg text-white w-full hover:bg-transparent hover:text-primary-100 hover:border-primary-100 active:bg-transparent active:text-primary-100 active:border-primary-100 h-16">
                    save & continue
                </button>
                </div>
            </div>
        </form>
    </div>
  )
}

export default Weight
