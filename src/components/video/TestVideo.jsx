import { useState } from "react";
import VidRoom from './VidRoom';

const TestVideo = () => {
    const [join, setJoin] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center mx-auto mt-60">
        {
            !join && (
                <button 
                    onClick={() => setJoin(true)}
                    className='p-3 bg-primary-100 text-white'>join room
                
                </button>
            )
        }
        {
            join && (
                <VidRoom/>
            )
        }
    </div>
  )
}

export default TestVideo