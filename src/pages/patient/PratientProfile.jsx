import {profile} from "../../components/dummy";

const PratientProfile = () => {
  return (
    <section className='w-full'>
      {
        profile.map((item, id) =>(
          <div key={id}>
            <div className="w-full flex lg:flex-row sm:flex-col items-center justify-between gap-5">
              <div className="flex flex-row gap-4">
                <div className="flex gap-x-3 h-16 w-16 rounded-full ">
                  <img src={item.img} alt="MyMedicare" className="p-1 rounded-full w-full"/>
                </div>
                <div>
                  <h2 className="text-lg font-bold capitalize"><span className="capitalize">{item.firstName}</span><span className="ml-2 capitalize">{item.lastName}</span></h2>
                  <p className="capitalize text-neutral-50 font-semibold "><span>{item.state}</span>,<span className="ml-2">{item.country}</span></p>
                </div>
              </div>
            </div>
            <h4 className="capitalize text-lg my-2 font-medium">personal</h4>
            <hr className="w-full bg-neutral-50"/>
            <div className="userDetails w-full p-5">
              <div className="personal w-full">
                <div className="w-full flex lg:flex-row items-center sm:flex-col gap-5">
                  <div className="firstName flex flex-col mb-2 sm:w-full lg:w-[50%]">
                    <label className="capitalize text-neutral-100 text-xl font-semibold mb-2">first name</label>
                    <input
                      type="text"
                      placeholder="John"
                      className="outline-none border-2 border-neutral-50 p-2 w-full text-lg font-medium rounded-lg focus:border-primary-100"
                    />               
                  </div>
                  <div className="firstName flex flex-col mb-2 sm:w-full lg:w-[50%]">
                    <label className="capitalize text-neutral-100 text-xl font-semibold mb-2">last name</label>
                    <input
                      type="text"
                      placeholder="John"
                      className="outline-none border-2 border-neutral-50 p-2 w-full text-lg font-medium rounded-lg focus:border-primary-100"
                    />               
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      }
    </section>
  )
}

export default PratientProfile
