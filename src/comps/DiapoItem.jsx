import React from "react";

export default function DiapoItem(props){
    let { data, w, h } = props;
    const img = `/diapo/${data.img}.jpg`;

    w = w === undefined ? w = '240pt' : w;
    h = h === undefined ? h = '140pt' : h;
    
    function onClick(e){
        console.log(data)
    }

    return (
        <button onClick={onClick}  className={`flex-shrink-0 object-cover  cursor-pointer  overflow-hidden w-[${w}] rounded-[14pt] h-[${h}] bg-slate-500 mx-2`}  >
            <img src={img} className="object-cover w-full " />
        </button>
    )
}