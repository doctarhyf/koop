import React from "react";


export default function ButtonHomeMenu(props){
    
    const {label, icon, setSelectedPage, route} = props;
   
    
    return (
        <button onClick={ e => setSelectedPage(route)} className="border w-max min-w-[50%] hover:bg-koop-d hover:text-white hover:shadow-md shadow-koop-d flex items-center space-x-2 border-koop-def px-4 py-2 bg-white rounded-xl text-black" >
            <span><img className="  object-cover " width={40} height={40} src={icon} /></span>
            <span>{label}</span>
        </button>
    )
}