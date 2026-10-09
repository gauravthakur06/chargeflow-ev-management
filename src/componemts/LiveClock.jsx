import { useEffect, useState } from "react";

export default function LiveClock() {

    const [time,setTime]=useState(new Date());

    useEffect(()=>{

        const timer=setInterval(()=>{
            setTime(new Date());
        },1000);

        return ()=>clearInterval(timer);

    },[]);

    return(
        <div className="clock">
            {time.toLocaleString()}
        </div>
    )

}
